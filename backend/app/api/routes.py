from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.schema import Sensor, SensorReading, Location, Prediction, Advisory
from app.schemas.pydantic_models import (
    SensorResponse,
    SensorReadingBase,
    LocationResponse,
    PredictRequest,
    PredictResponse,
    AdvisoryRequest,
    AdvisoryResponse,
    MapDataResponse,
    MapDataSummary,
)
from app.services.aqi_calculator import calculate_cpcb_aqi, get_aqi_category_info
from app.services.advisory_engine import generate_ai_advisory
from app.ml.model import spatial_predictor

router = APIRouter()

# -------------------------------------------------------------
# 1. Health Check
# -------------------------------------------------------------
@router.get("/health", tags=["System"])
def get_health(db: Session = Depends(get_db)):
    """Health check validating database connection and ML model readiness."""
    try:
        sensor_count = db.query(Sensor).count()
        reading_count = db.query(SensorReading).count()
        return {
            "status": "healthy",
            "database": "connected",
            "sensors_registered": sensor_count,
            "readings_stored": reading_count,
            "ml_model_trained": spatial_predictor.is_trained,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        return {
            "status": "degraded",
            "database": f"error: {str(e)}",
            "ml_model_trained": spatial_predictor.is_trained,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }


# -------------------------------------------------------------
# 1.1 Real-Time Live Telemetry Tick (Open-Meteo Integration)
# -------------------------------------------------------------
@router.post("/realtime-tick", tags=["Real-Time Telemetry"])
def trigger_realtime_tick(db: Session = Depends(get_db)):
    """
    Fetches real-time air quality data for Delhi NCR from Open-Meteo,
    updates all 25 low-cost sensors with live baselines, and returns status.
    """
    from app.services.live_feed import record_live_telemetry_tick
    return record_live_telemetry_tick(db)


# -------------------------------------------------------------
# 2. Map Data (Sensors, Locations, Summaries)
# -------------------------------------------------------------

@router.get("/map-data", response_model=MapDataResponse, tags=["Air Quality"])
def get_map_data(db: Session = Depends(get_db)):
    """
    Returns complete dataset for the interactive map:
    - Active sensors with their latest readings and CPCB AQI
    - Schools with micro-predictions & AI advisories
    - Worker zones with exposure metrics
    - Hospitals
    - City-wide summary statistics
    """
    sensors = db.query(Sensor).filter(Sensor.is_active == True).all()
    sensor_responses = []
    aqi_values = []
    max_aqi = 0
    peak_location = "Delhi NCR"

    for s in sensors:
        latest = (
            db.query(SensorReading)
            .filter(SensorReading.sensor_id == s.id)
            .order_by(desc(SensorReading.recorded_at))
            .first()
        )
        
        reading_base = None
        aqi_val = None
        category = None
        color = None

        if latest:
            reading_base = SensorReadingBase(
                pm25=latest.pm25,
                pm10=latest.pm10,
                temperature=latest.temperature,
                humidity=latest.humidity,
                recorded_at=latest.recorded_at
            )
            aqi_val, category, color, _ = calculate_cpcb_aqi(latest.pm25, latest.pm10)
            aqi_values.append(aqi_val)
            if aqi_val > max_aqi:
                max_aqi = aqi_val
                peak_location = s.name

        sensor_responses.append(
            SensorResponse(
                id=s.id,
                name=s.name,
                lat=s.lat,
                lng=s.lng,
                type=s.type,
                is_active=s.is_active,
                latest_reading=reading_base,
                aqi=aqi_val,
                category=category,
                color=color
            )
        )

    # Fetch locations
    locations = db.query(Location).all()
    schools = []
    worker_zones = []
    hospitals = []

    for loc in locations:
        latest_pred = (
            db.query(Prediction)
            .filter(Prediction.location_id == loc.id)
            .order_by(desc(Prediction.created_at))
            .first()
        )
        latest_adv = (
            db.query(Advisory)
            .filter(Advisory.location_id == loc.id)
            .order_by(desc(Advisory.generated_at))
            .first()
        )

        pred_dict = None
        if latest_pred:
            color_info = get_aqi_category_info(latest_pred.aqi)
            pred_dict = {
                "id": latest_pred.id,
                "pm25": latest_pred.predicted_pm25,
                "pm10": latest_pred.predicted_pm10,
                "aqi": latest_pred.aqi,
                "category": latest_pred.category,
                "color": color_info["color"],
                "risk_level": color_info["risk_level"],
                "created_at": latest_pred.created_at.isoformat()
            }

        adv_dict = None
        if latest_adv:
            adv_dict = {
                "id": latest_adv.id,
                "context": latest_adv.context,
                "risk_level": latest_adv.risk_level,
                "advisory_text": latest_adv.advisory_text,
                "generated_at": latest_adv.generated_at.isoformat()
            }

        loc_resp = LocationResponse(
            id=loc.id,
            name=loc.name,
            type=loc.type,
            lat=loc.lat,
            lng=loc.lng,
            latest_prediction=pred_dict,
            latest_advisory=adv_dict
        )

        if loc.type == "school":
            schools.append(loc_resp)
        elif loc.type == "worker_zone":
            worker_zones.append(loc_resp)
        elif loc.type == "hospital":
            hospitals.append(loc_resp)

    # City-wide summary
    avg_aqi = round(sum(aqi_values) / len(aqi_values)) if aqi_values else 245
    cat_info = get_aqi_category_info(avg_aqi)

    summary = MapDataSummary(
        total_sensors=len(sensors),
        active_sensors=len([s for s in sensors if s.is_active]),
        avg_aqi=avg_aqi,
        max_aqi=max_aqi if max_aqi > 0 else 380,
        peak_location=peak_location,
        overall_category=cat_info["category"],
        overall_color=cat_info["color"],
        timestamp=datetime.now(timezone.utc)
    )

    return MapDataResponse(
        sensors=sensor_responses,
        schools=schools,
        worker_zones=worker_zones,
        hospitals=hospitals,
        summary=summary
    )


# -------------------------------------------------------------
# 3. Locations API
# -------------------------------------------------------------
@router.get("/locations", response_model=List[LocationResponse], tags=["Locations"])
def get_locations(
    type: Optional[str] = Query(None, description="Filter by 'school', 'hospital', 'worker_zone', 'area'"),
    db: Session = Depends(get_db)
):
    """Retrieves registered locations with their latest predictions & advisories."""
    query = db.query(Location)
    if type:
        query = query.filter(Location.type == type)
    locations = query.all()

    response = []
    for loc in locations:
        latest_pred = (
            db.query(Prediction)
            .filter(Prediction.location_id == loc.id)
            .order_by(desc(Prediction.created_at))
            .first()
        )
        latest_adv = (
            db.query(Advisory)
            .filter(Advisory.location_id == loc.id)
            .order_by(desc(Advisory.generated_at))
            .first()
        )

        pred_dict = None
        if latest_pred:
            color_info = get_aqi_category_info(latest_pred.aqi)
            pred_dict = {
                "id": latest_pred.id,
                "pm25": latest_pred.predicted_pm25,
                "pm10": latest_pred.predicted_pm10,
                "aqi": latest_pred.aqi,
                "category": latest_pred.category,
                "color": color_info["color"],
                "risk_level": color_info["risk_level"],
                "created_at": latest_pred.created_at.isoformat()
            }

        adv_dict = None
        if latest_adv:
            adv_dict = {
                "id": latest_adv.id,
                "context": latest_adv.context,
                "risk_level": latest_adv.risk_level,
                "advisory_text": latest_adv.advisory_text,
                "generated_at": latest_adv.generated_at.isoformat()
            }

        response.append(
            LocationResponse(
                id=loc.id,
                name=loc.name,
                type=loc.type,
                lat=loc.lat,
                lng=loc.lng,
                latest_prediction=pred_dict,
                latest_advisory=adv_dict
            )
        )

    return response


@router.get("/locations/{id}", response_model=LocationResponse, tags=["Locations"])
def get_location_by_id(id: int, db: Session = Depends(get_db)):
    """Retrieves a single location by ID."""
    loc = db.query(Location).filter(Location.id == id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")

    latest_pred = (
        db.query(Prediction)
        .filter(Prediction.location_id == loc.id)
        .order_by(desc(Prediction.created_at))
        .first()
    )
    latest_adv = (
        db.query(Advisory)
        .filter(Advisory.location_id == loc.id)
        .order_by(desc(Advisory.generated_at))
        .first()
    )

    pred_dict = None
    if latest_pred:
        color_info = get_aqi_category_info(latest_pred.aqi)
        pred_dict = {
            "id": latest_pred.id,
            "pm25": latest_pred.predicted_pm25,
            "pm10": latest_pred.predicted_pm10,
            "aqi": latest_pred.aqi,
            "category": latest_pred.category,
            "color": color_info["color"],
            "risk_level": color_info["risk_level"],
            "created_at": latest_pred.created_at.isoformat()
        }

    adv_dict = None
    if latest_adv:
        adv_dict = {
            "id": latest_adv.id,
            "context": latest_adv.context,
            "risk_level": latest_adv.risk_level,
            "advisory_text": latest_adv.advisory_text,
            "generated_at": latest_adv.generated_at.isoformat()
        }

    return LocationResponse(
        id=loc.id,
        name=loc.name,
        type=loc.type,
        lat=loc.lat,
        lng=loc.lng,
        latest_prediction=pred_dict,
        latest_advisory=adv_dict
    )


# -------------------------------------------------------------
# 4. Schools API (Dedicated Endpoints)
# -------------------------------------------------------------
@router.get("/schools", response_model=List[LocationResponse], tags=["Schools"])
def get_schools(db: Session = Depends(get_db)):
    """Returns all schools with their latest predictions and advisories for School Safety Mode."""
    return get_locations(type="school", db=db)


@router.get("/schools/{id}", response_model=LocationResponse, tags=["Schools"])
def get_school_by_id(id: int, db: Session = Depends(get_db)):
    """Returns a single school by ID."""
    school = db.query(Location).filter(Location.id == id, Location.type == "school").first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return get_location_by_id(id=id, db=db)


# -------------------------------------------------------------
# 5. ML Spatial Prediction API
# -------------------------------------------------------------
@router.post("/predict", response_model=PredictResponse, tags=["ML Prediction"])
def predict_air_quality(
    req: PredictRequest,
    db: Session = Depends(get_db)
):
    """
    Accepts arbitrary latitude & longitude coordinates.
    Runs the scikit-learn spatial regressor to interpolate PM2.5, PM10, AQI, and weather.
    Optionally persists prediction to database if location_id is provided.
    """
    location_name = "Street-level Coordinate"
    if req.location_id:
        loc = db.query(Location).filter(Location.id == req.location_id).first()
        if loc:
            location_name = loc.name

    pred = spatial_predictor.predict(req.lat, req.lng)

    # Persist prediction in DB
    now = datetime.now(timezone.utc)
    prediction_record = Prediction(
        location_id=req.location_id,
        predicted_pm25=pred["predicted_pm25"],
        predicted_pm10=pred["predicted_pm10"],
        aqi=pred["aqi"],
        category=pred["category"],
        created_at=now
    )
    db.add(prediction_record)
    db.commit()

    return PredictResponse(
        lat=pred["lat"],
        lng=pred["lng"],
        location_id=req.location_id,
        location_name=location_name,
        predicted_pm25=pred["predicted_pm25"],
        predicted_pm10=pred["predicted_pm10"],
        aqi=pred["aqi"],
        category=pred["category"],
        color=pred["color"],
        risk_level=pred["risk_level"],
        temperature=pred["temperature"],
        humidity=pred["humidity"],
        nearest_sensor=pred["nearest_sensor"],
        nearest_sensor_distance_km=pred["nearest_sensor_distance_km"],
        timestamp=now
    )


# -------------------------------------------------------------
# 6. AI Health Advisory API
# -------------------------------------------------------------
@router.post("/advisory", response_model=AdvisoryResponse, tags=["AI Advisory"])
def create_advisory(
    req: AdvisoryRequest,
    db: Session = Depends(get_db)
):
    """
    Core AI Automation Step:
    Transforms raw/predicted pollution telemetry into human-readable,
    contextual (School or Outdoor Worker) actionable health advisories.
    Uses OpenAI client if configured; falls back automatically to CPCB expert system.
    Persists advisory to the database.
    """
    location_name = req.location_name or "Target Zone"
    if req.location_id and not req.location_name:
        loc = db.query(Location).filter(Location.id == req.location_id).first()
        if loc:
            location_name = loc.name

    adv_result = generate_ai_advisory(
        location_name=location_name,
        pm25=req.pm25,
        pm10=req.pm10,
        aqi=req.aqi,
        category=req.category,
        context=req.context
    )

    now = datetime.now(timezone.utc)

    # Persist in DB
    advisory_record = Advisory(
        location_id=req.location_id,
        context=req.context,
        risk_level=adv_result.get("risk_level", "Moderate"),
        advisory_text=adv_result.get("advisory_text", ""),
        generated_at=now
    )
    db.add(advisory_record)
    db.commit()
    db.refresh(advisory_record)

    return AdvisoryResponse(
        id=advisory_record.id,
        location_id=req.location_id,
        location_name=location_name,
        context=req.context,
        risk_level=adv_result.get("risk_level", "Moderate"),
        advisory_text=adv_result.get("advisory_text", ""),
        actionable_protocols=adv_result.get("actionable_protocols", []),
        recess_or_shift_guidance=adv_result.get("recess_or_shift_guidance", "Exercise caution outdoors."),
        mask_mandate=adv_result.get("mask_mandate", "N95 recommended."),
        air_purifier_or_shelter=adv_result.get("air_purifier_or_shelter", "Operate filtration."),
        engine_used=adv_result.get("engine_used", "CPCB Automated Expert System"),
        generated_at=now
    )
