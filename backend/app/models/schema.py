from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text
)
from sqlalchemy.orm import relationship
from app.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class Sensor(Base):
    __tablename__ = "sensors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    type = Column(String(50), default="low_cost_optical", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    readings = relationship("SensorReading", back_populates="sensor", cascade="all, delete-orphan")


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(Integer, ForeignKey("sensors.id", ondelete="CASCADE"), nullable=False, index=True)
    pm25 = Column(Float, nullable=False)
    pm10 = Column(Float, nullable=False)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    recorded_at = Column(DateTime(timezone=True), default=utcnow, nullable=False, index=True)

    sensor = relationship("Sensor", back_populates="readings")


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    type = Column(String(50), nullable=False)  # 'school', 'hospital', 'area', 'worker_zone'
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

    predictions = relationship("Prediction", back_populates="location")
    advisories = relationship("Advisory", back_populates="location")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id", ondelete="SET NULL"), nullable=True, index=True)
    predicted_pm25 = Column(Float, nullable=False)
    predicted_pm10 = Column(Float, nullable=False)
    aqi = Column(Integer, nullable=False)
    category = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    location = relationship("Location", back_populates="predictions")


class Advisory(Base):
    __tablename__ = "advisories"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id", ondelete="SET NULL"), nullable=True, index=True)
    context = Column(String(50), nullable=False)  # 'school' | 'worker'
    risk_level = Column(String(50), nullable=False)
    advisory_text = Column(Text, nullable=False)
    generated_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    location = relationship("Location", back_populates="advisories")
