import enum
import uuid

from sqlalchemy import Column, String, Float, Integer, JSON, Text, ForeignKey, Enum as SAEnum, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class Level(str, enum.Enum):
    low = "low"
    mid = "mid"
    high = "high"


class SkinType(Base):
    __tablename__ = "skin_types"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)          # e.g. "dry", "oily"
    moisture_level = Column(SAEnum(Level), nullable=False)
    oil_level = Column(SAEnum(Level), nullable=False)
    sensitivity = Column(SAEnum(Level), nullable=False)
    description = Column(Text)

    profiles = relationship("SkinProfile", back_populates="skin_type")


class SkinProfile(Base):
    """Score-range thresholds that classify a set of skin scores into a SkinType.

    NULL on any bound means "no constraint on that side".
    Higher priority rows are evaluated first; first match wins.
    """
    __tablename__ = "skin_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    skin_type_id = Column(String, ForeignKey("skin_types.id"), nullable=False)
    priority = Column(Integer, default=0, nullable=False)

    # moisture_score (0–100, higher = more moist)
    moisture_min = Column(Float)
    moisture_max = Column(Float)

    # redness_score (0–100, higher = more red)
    redness_min = Column(Float)
    redness_max = Column(Float)

    # trouble_score (0–100, higher = more troubled)
    trouble_min = Column(Float)
    trouble_max = Column(Float)

    # brightness_score (0–100, higher = brighter)
    brightness_min = Column(Float)
    brightness_max = Column(Float)

    # tone_score (0–100, higher = more uniform)
    tone_min = Column(Float)
    tone_max = Column(Float)

    skin_type = relationship("SkinType", back_populates="profiles")


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    google_id = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    name = Column(String)
    profile_image = Column(String)
    created_at = Column(DateTime, default=datetime.now)

    analysis_history = relationship("AnalysisHistory", back_populates="user")


class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    skin_scores = Column(JSON)
    skin_type = Column(String)
    image_filename = Column(String)
    landmarks = Column(JSON)
    image_size = Column(JSON)
    analyzed_at = Column(DateTime, default=datetime.now)

    user = relationship("User", back_populates="analysis_history")


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    brand = Column(String)
    category = Column(String)
    ingredients = Column(JSON)                  # ingredient list
    avoid_conditions = Column(JSON)             # skin conditions to avoid
    image_url = Column(String)
    suitable_skin_types = Column(JSON)          # suitable skin type ID list
