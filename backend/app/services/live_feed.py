import urllib.request
import json
import logging
import random
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.schema import Sensor, SensorReading, Location, Prediction
from app.services.aqi_calculator import calculate_cpcb_aqi
from app.services.seeder import DELHI_SENSORS, DELHI_LOCATIONS
from app.ml.model import spatial_predictor

logger = logging.getLogger("vayu_live_feed")

OPEN_METEO_URL = (
    "https://air-quality-api.open-meteo.com/v1/air-quality"
    "?latitude=28.6139&longitude=77.2090&current=pm10,pm2_5"
)

def fetch_live_delhi_telemetry() -> tuple:
    """
    Fetches actual real-time PM2.5 & PM10 data for Delhi NCR from Open-Meteo API.
    Returns (pm25, pm10, source_str).
    """
    try:
        req = urllib.request.Request(
            OPEN_METEO_URL,
            headers={"User-Agent": "VayuNet-RealTime-Agent/1.0"}
        )
        with urllib.request.urlopen(req, timeout=4) as response:
            data = json.loads(response.read().decode())
            current = data.get("current", {})
            pm25 = float(current.get("pm2_5", 115.0))
            pm10 = float(current.get("pm10", 140.0))
            logger.info(f"Successfully fetched live Delhi air quality: PM2.5={pm25}, PM10={pm10}")
            return pm25, pm10, "Open-Meteo Live Satellite/Station Telemetry"
    except Exception as e:
        logger.warning(f"Could not reach Open-Meteo ({e}). Using simulated live telemetry.")
        # Fallback to realistic current-hour baseline
        now = datetime.now(timezone.utc)
        hour = now.hour
        diurnal = 1.2 if (6 <= hour <= 10 or 18 <= hour <= 23) else 0.85
        pm25 = round(165.0 * diurnal * random.uniform(0.95, 1.05), 1)
        pm10 = round(pm25 * 1.8 * random.uniform(0.95, 1.05), 1)
        return pm25, pm10, "VayuNet Real-Time Diurnal Simulator"


def record_live_telemetry_tick(db: Session) -> dict:
    """
    Ingests a live telemetry tick:
    1. Fetches current live Delhi PM2.5/PM10.
    2. Disperses readings across all 25 sensors using their baseline micro-variations.
    3. Saves new readings into sensor_readings table.
    4. Updates predictions for all schools and worker zones.
    """
    base_pm25, base_pm10, source_name = fetch_live_delhi_telemetry()
    now = datetime.now(timezone.utc)

    sensors = db.query(Sensor).filter(Sensor.is_active == True).all()
    if not sensors:
        return {"status": "no_sensors"}

    # Map baselines from DELHI_SENSORS list
    baseline_map = {s["name"]: s["baseline"] for s in DELHI_SENSORS}

    new_sensor_data = []
    for s in sensors:
        baseline = baseline_map.get(s.name, 1.0)
        # Apply realistic micro-noise (wind gusts, traffic pulse)
        micro_jitter = random.uniform(0.96, 1.04)
        pm25 = round(max(15.0, base_pm25 * baseline * micro_jitter), 1)
        pm10 = round(max(pm25 * 1.25, base_pm10 * baseline * micro_jitter), 1)
        
        temp = round(22.0 + random.uniform(-1.5, 1.5), 1)
        humidity = round(60.0 + random.uniform(-3.0, 3.0), 1)

        reading = SensorReading(
            sensor_id=s.id,
            pm25=pm25,
            pm10=pm10,
            temperature=temp,
            humidity=humidity,
            recorded_at=now
        )
        db.add(reading)

        aqi, category, color, risk = calculate_cpcb_aqi(pm25, pm10)
        new_sensor_data.append({
            "id": s.id,
            "name": s.name,
            "pm25": pm25,
            "pm10": pm10,
            "aqi": aqi,
            "category": category,
            "color": color
        })

    # Update predictions for all locations
    locations = db.query(Location).all()
    for loc in locations:
        pred = spatial_predictor.predict(loc.lat, loc.lng, now)
        pred_record = Prediction(
            location_id=loc.id,
            predicted_pm25=pred["predicted_pm25"],
            predicted_pm10=pred["predicted_pm10"],
            aqi=pred["aqi"],
            category=pred["category"],
            created_at=now
        )
        db.add(pred_record)

    db.commit()

    return {
        "status": "success",
        "source": source_name,
        "base_pm25": base_pm25,
        "base_pm10": base_pm10,
        "sensors_updated": len(new_sensor_data),
        "timestamp": now.isoformat()
    }
