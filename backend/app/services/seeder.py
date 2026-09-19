import math
import random
import logging
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.schema import Sensor, SensorReading, Location, Prediction, Advisory
from app.services.aqi_calculator import calculate_cpcb_aqi
from app.services.advisory_engine import generate_ai_advisory
from app.ml.model import spatial_predictor

logger = logging.getLogger("vayu_seeder")

DELHI_SENSORS = [
    {"name": "Anand Vihar CPCB/DPCC", "lat": 28.6508, "lng": 77.3152, "type": "traffic_industrial", "baseline": 1.45},
    {"name": "Connaught Place Inner Circle", "lat": 28.6328, "lng": 77.2197, "type": "commercial_transit", "baseline": 1.05},
    {"name": "Punjabi Bagh West", "lat": 28.6683, "lng": 77.1167, "type": "arterial_corridor", "baseline": 1.25},
    {"name": "R.K. Puram Sector 1", "lat": 28.5660, "lng": 77.1767, "type": "institutional_residential", "baseline": 1.10},
    {"name": "Lodhi Road IMD Complex", "lat": 28.5910, "lng": 77.2270, "type": "green_diplomatic", "baseline": 0.85},
    {"name": "Dwarka Sector 8 Metro", "lat": 28.5710, "lng": 77.0690, "type": "residential_suburban", "baseline": 1.00},
    {"name": "Rohini Sector 16", "lat": 28.7325, "lng": 77.1190, "type": "dense_residential", "baseline": 1.30},
    {"name": "Okhla Phase II Industrial", "lat": 28.5307, "lng": 77.2713, "type": "heavy_industrial", "baseline": 1.50},
    {"name": "ITO Mega Junction", "lat": 28.6289, "lng": 77.2405, "type": "heavy_traffic", "baseline": 1.40},
    {"name": "Chandni Chowk Red Fort Gate", "lat": 28.6562, "lng": 77.2300, "type": "walled_city_commercial", "baseline": 1.35},
    {"name": "Nehru Nagar Ring Road", "lat": 28.5678, "lng": 77.2505, "type": "arterial_transit", "baseline": 1.20},
    {"name": "Siri Fort Sports Complex", "lat": 28.5504, "lng": 77.2159, "type": "green_institutional", "baseline": 0.90},
    {"name": "Pusa ICAR Campus", "lat": 28.6360, "lng": 77.1600, "type": "institutional_green", "baseline": 0.95},
    {"name": "Jahangirpuri Industrial", "lat": 28.7259, "lng": 77.1650, "type": "industrial_transit", "baseline": 1.55},
    {"name": "Wazirpur Industrial Area", "lat": 28.6998, "lng": 77.1654, "type": "heavy_industrial", "baseline": 1.48},
    {"name": "Ashok Vihar Phase 1", "lat": 28.6946, "lng": 77.1814, "type": "residential_mixed", "baseline": 1.15},
    {"name": "Sonia Vihar Water Works", "lat": 28.7105, "lng": 77.2494, "type": "riverfront_periurban", "baseline": 1.10},
    {"name": "Patparganj Industrial Estate", "lat": 28.6237, "lng": 77.2872, "type": "commercial_industrial", "baseline": 1.30},
    {"name": "Najafgarh Rural Hub", "lat": 28.6090, "lng": 76.9855, "type": "suburban_periurban", "baseline": 0.95},
    {"name": "IGI Airport T3 Runway South", "lat": 28.5562, "lng": 77.0999, "type": "aviation_corridor", "baseline": 1.05},
    {"name": "Bawana Industrial Park", "lat": 28.7997, "lng": 77.0329, "type": "heavy_industrial", "baseline": 1.60},
    {"name": "Narela Logistics Terminal", "lat": 28.8526, "lng": 77.0932, "type": "freight_hub", "baseline": 1.50},
    {"name": "Alipur GT Karnal Corridor", "lat": 28.7972, "lng": 77.1332, "type": "highway_transit", "baseline": 1.35},
    {"name": "Mundka Metro Corridor", "lat": 28.6835, "lng": 77.0319, "type": "industrial_transit", "baseline": 1.42},
    {"name": "Saket District Centre", "lat": 28.5205, "lng": 77.2014, "type": "commercial_hub", "baseline": 1.08},
]

DELHI_LOCATIONS = [
    # 10 Schools
    {"name": "Delhi Public School, R.K. Puram", "type": "school", "lat": 28.5672, "lng": 77.1824},
    {"name": "The Mother's International School, Sri Aurobindo Marg", "type": "school", "lat": 28.5398, "lng": 77.1982},
    {"name": "Modern School, Barakhamba Road", "type": "school", "lat": 28.6291, "lng": 77.2285},
    {"name": "Sanskriti School, Chanakyapuri", "type": "school", "lat": 28.5934, "lng": 77.1832},
    {"name": "Springdales School, Pusa Road", "type": "school", "lat": 28.6432, "lng": 77.1798},
    {"name": "Sardar Patel Vidyalaya, Lodhi Estate", "type": "school", "lat": 28.5946, "lng": 77.2248},
    {"name": "Bal Bharati Public School, Ganga Ram Marg", "type": "school", "lat": 28.6402, "lng": 77.1865},
    {"name": "St. Columba's School, Ashok Place", "type": "school", "lat": 28.6268, "lng": 77.2064},
    {"name": "Vasant Valley School, Vasant Kunj", "type": "school", "lat": 28.5218, "lng": 77.1472},
    {"name": "Apeejay School, Sheikh Sarai Phase I", "type": "school", "lat": 28.5369, "lng": 77.2242},

    # 6 Hospitals
    {"name": "AIIMS New Delhi, Ansari Nagar", "type": "hospital", "lat": 28.5672, "lng": 77.2100},
    {"name": "Safdarjung Hospital, Ring Road", "type": "hospital", "lat": 28.5701, "lng": 77.2078},
    {"name": "Sir Ganga Ram Hospital, Old Rajinder Nagar", "type": "hospital", "lat": 28.6385, "lng": 77.1895},
    {"name": "Max Super Speciality Hospital, Saket", "type": "hospital", "lat": 28.5273, "lng": 77.2120},
    {"name": "Fortis Escorts Heart Institute, Okhla", "type": "hospital", "lat": 28.5602, "lng": 77.2798},
    {"name": "Lok Nayak Jai Prakash Hospital (LNJP), Delhi Gate", "type": "hospital", "lat": 28.6369, "lng": 77.2415},

    # 6 Outdoor Worker Zones
    {"name": "Anand Vihar ISBT & Railway Terminal", "type": "worker_zone", "lat": 28.6482, "lng": 77.3150},
    {"name": "Okhla Industrial Area Phase-II Freight Yard", "type": "worker_zone", "lat": 28.5285, "lng": 77.2730},
    {"name": "Chandni Chowk Wholesale Porters Hub", "type": "worker_zone", "lat": 28.6550, "lng": 77.2315},
    {"name": "Delhi Metro Phase-4 Construction Corridor", "type": "worker_zone", "lat": 28.5750, "lng": 77.1250},
    {"name": "Sarai Kale Khan Regional Transit & Delivery Hub", "type": "worker_zone", "lat": 28.5905, "lng": 77.2570},
    {"name": "Ghazipur Logistics & Waste Management Depot", "type": "worker_zone", "lat": 28.6250, "lng": 77.3290},
]


def generate_diurnal_reading(baseline_multiplier: float, timestamp: datetime) -> tuple:
    """
    Generates realistic winter smog reading in Delhi based on time of day.
    Peak 1: 07:00 - 10:00 (morning traffic + shallow winter inversion)
    Trough: 13:00 - 16:00 (solar heating + boundary layer expansion)
    Peak 2: 19:00 - 23:00 (evening traffic + night inversion + biomass)
    """
    hour = timestamp.hour
    
    # Mathematical diurnal curve
    if 6 <= hour <= 10:
        diurnal = 1.35 + 0.15 * math.sin((hour - 6) * math.pi / 4)
    elif 11 <= hour <= 16:
        diurnal = 0.75 + 0.10 * math.cos((hour - 11) * math.pi / 5)
    elif 17 <= hour <= 23:
        diurnal = 1.40 + 0.20 * math.sin((hour - 17) * math.pi / 6)
    else:
        diurnal = 1.15 + 0.10 * math.sin((hour) * math.pi / 6)

    # City-wide winter baseline: PM2.5 mean ~180 µg/m³ in smog season
    city_pm25_base = 175.0
    random_noise = random.uniform(0.92, 1.08)

    pm25 = city_pm25_base * baseline_multiplier * diurnal * random_noise
    pm25 = max(25.0, round(pm25, 1))

    # PM10 is generally 1.6x to 2.1x PM2.5 in Indian conditions due to road dust and soil crust
    pm10_factor = random.uniform(1.65, 2.05)
    pm10 = max(pm25 * 1.25, round(pm25 * pm10_factor, 1))

    # Temperature in Delhi winter: 12°C night to 25°C day
    temp = 18.0 + 6.0 * math.sin((hour - 9) * math.pi / 12) + random.uniform(-0.8, 0.8)
    temp = round(max(9.0, min(32.0, temp)), 1)

    # Humidity: 85% morning fog to 45% afternoon
    humidity = 65.0 - 20.0 * math.sin((hour - 9) * math.pi / 12) + random.uniform(-2.0, 2.0)
    humidity = round(max(30.0, min(95.0, humidity)), 1)

    return pm25, pm10, temp, humidity


def seed_database_if_empty(db: Session) -> bool:
    """
    Checks if database is populated. If empty, seeds sensors, 48 hours of time-series readings,
    all schools, hospitals, worker zones, runs ML training, and creates initial predictions/advisories.
    """
    existing_sensor = db.query(Sensor).first()
    if existing_sensor is not None:
        logger.info("Database already seeded with sensors. Skipping full seed.")
        train_ml_model_from_db(db)
        return False

    logger.info("Starting automated initial data seeding (48-hour realistic Delhi NCR telemetry)...")

    # 1. Insert Sensors
    sensor_entities = []
    for s_data in DELHI_SENSORS:
        sensor = Sensor(
            name=s_data["name"],
            lat=s_data["lat"],
            lng=s_data["lng"],
            type=s_data["type"],
            is_active=True
        )
        db.add(sensor)
        sensor_entities.append((sensor, s_data["baseline"]))

    db.flush()  # assign IDs

    # 2. Insert 48 hours of hourly readings for each sensor
    now = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)
    total_readings = 0
    raw_training_records = []
    sensors_cache_list = []

    for sensor, baseline in sensor_entities:
        sensors_cache_list.append({
            "id": sensor.id,
            "name": sensor.name,
            "lat": sensor.lat,
            "lng": sensor.lng
        })
        for h in range(48, -1, -1):
            reading_time = now - timedelta(hours=h)
            pm25, pm10, temp, hum = generate_diurnal_reading(baseline, reading_time)
            
            reading = SensorReading(
                sensor_id=sensor.id,
                pm25=pm25,
                pm10=pm10,
                temperature=temp,
                humidity=hum,
                recorded_at=reading_time
            )
            db.add(reading)
            total_readings += 1

            raw_training_records.append({
                "lat": sensor.lat,
                "lng": sensor.lng,
                "pm25": pm25,
                "pm10": pm10,
                "temperature": temp,
                "humidity": hum,
                "recorded_at": reading_time
            })

    # 3. Insert Locations (Schools, Hospitals, Worker Zones)
    location_entities = []
    for loc_data in DELHI_LOCATIONS:
        loc = Location(
            name=loc_data["name"],
            type=loc_data["type"],
            lat=loc_data["lat"],
            lng=loc_data["lng"]
        )
        db.add(loc)
        location_entities.append(loc)

    db.flush()

    # 4. Train the ML Spatial Model immediately
    logger.info(f"Training ML Spatial Interpolator on {len(raw_training_records)} seeded telemetry points...")
    spatial_predictor.train(raw_training_records, sensors_cache_list)

    # 5. Generate Initial Predictions & Advisories for All Locations
    for loc in location_entities:
        pred = spatial_predictor.predict(loc.lat, loc.lng, now)
        prediction_record = Prediction(
            location_id=loc.id,
            predicted_pm25=pred["predicted_pm25"],
            predicted_pm10=pred["predicted_pm10"],
            aqi=pred["aqi"],
            category=pred["category"],
            created_at=now
        )
        db.add(prediction_record)

        # Context based on location type
        context = "school" if loc.type == "school" else "worker"
        adv_data = generate_ai_advisory(
            location_name=loc.name,
            pm25=pred["predicted_pm25"],
            pm10=pred["predicted_pm10"],
            aqi=pred["aqi"],
            category=pred["category"],
            context=context
        )

        advisory_record = Advisory(
            location_id=loc.id,
            context=context,
            risk_level=adv_data.get("risk_level", "Moderate"),
            advisory_text=adv_data.get("advisory_text", ""),
            generated_at=now
        )
        db.add(advisory_record)

    db.commit()
    logger.info(f"Seeding complete! 25 Sensors, {total_readings} Readings, {len(location_entities)} Locations, Predictions & Advisories populated.")
    return True


def train_ml_model_from_db(db: Session):
    """Refreshes and trains spatial model from current database state."""
    sensors = db.query(Sensor).filter(Sensor.is_active == True).all()
    if not sensors:
        return

    sensor_map = {s.id: {"name": s.name, "lat": s.lat, "lng": s.lng} for s in sensors}
    sensors_cache_list = [{"id": s.id, "name": s.name, "lat": s.lat, "lng": s.lng} for s in sensors]

    # Pull last 48 hours of readings
    cutoff = datetime.now(timezone.utc) - timedelta(hours=48)
    readings = db.query(SensorReading).filter(SensorReading.recorded_at >= cutoff).all()

    training_records = []
    for r in readings:
        s_info = sensor_map.get(r.sensor_id)
        if s_info:
            training_records.append({
                "lat": s_info["lat"],
                "lng": s_info["lng"],
                "pm25": r.pm25,
                "pm10": r.pm10,
                "temperature": r.temperature,
                "humidity": r.humidity,
                "recorded_at": r.recorded_at
            })

    if training_records:
        spatial_predictor.train(training_records, sensors_cache_list)
