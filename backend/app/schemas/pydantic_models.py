from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- SENSORS & READINGS ---

class SensorReadingBase(BaseModel):
    pm25: float
    pm10: float
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    recorded_at: datetime

class SensorReadingResponse(SensorReadingBase):
    id: int
    sensor_id: int

    class Config:
        from_attributes = True

class SensorBase(BaseModel):
    name: str
    lat: float
    lng: float
    type: str = "low_cost_optical"
    is_active: bool = True

class SensorResponse(SensorBase):
    id: int
    latest_reading: Optional[SensorReadingBase] = None
    aqi: Optional[int] = None
    category: Optional[str] = None
    color: Optional[str] = None

    class Config:
        from_attributes = True


# --- LOCATIONS ---

class LocationBase(BaseModel):
    name: str
    type: str  # 'school', 'hospital', 'area', 'worker_zone'
    lat: float
    lng: float

class LocationResponse(LocationBase):
    id: int
    latest_prediction: Optional[Dict[str, Any]] = None
    latest_advisory: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


# --- PREDICTIONS ---

class PredictRequest(BaseModel):
    lat: float = Field(..., ge=-90.0, le=90.0, description="Latitude")
    lng: float = Field(..., ge=-180.0, le=180.0, description="Longitude")
    location_id: Optional[int] = None

class PredictResponse(BaseModel):
    lat: float
    lng: float
    location_id: Optional[int] = None
    location_name: Optional[str] = None
    predicted_pm25: float
    predicted_pm10: float
    aqi: int
    category: str
    color: str
    risk_level: str
    temperature: float
    humidity: float
    nearest_sensor: str
    nearest_sensor_distance_km: float
    timestamp: datetime


# --- ADVISORIES ---

class AdvisoryRequest(BaseModel):
    location_id: Optional[int] = None
    location_name: Optional[str] = "Selected Coordinates"
    lat: Optional[float] = None
    lng: Optional[float] = None
    pm25: float
    pm10: float
    aqi: int
    category: str
    context: str = Field(default="school", description="'school' or 'worker'")

class AdvisoryResponse(BaseModel):
    id: Optional[int] = None
    location_id: Optional[int] = None
    location_name: Optional[str] = None
    context: str
    risk_level: str
    advisory_text: str
    actionable_protocols: List[str]
    recess_or_shift_guidance: str
    mask_mandate: str
    air_purifier_or_shelter: str
    engine_used: str  # 'OpenAI gpt-4o-mini' or 'CPCB Automated Expert System'
    generated_at: datetime


# --- MAP & SUMMARY ---

class MapDataSummary(BaseModel):
    total_sensors: int
    active_sensors: int
    avg_aqi: int
    max_aqi: int
    peak_location: str
    overall_category: str
    overall_color: str
    timestamp: datetime

class MapDataResponse(BaseModel):
    sensors: List[SensorResponse]
    schools: List[LocationResponse]
    worker_zones: List[LocationResponse]
    hospitals: List[LocationResponse]
    summary: MapDataSummary
