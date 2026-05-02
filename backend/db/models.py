from sqlalchemy import Column, String, Float, JSON, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    brand = Column(String)
    category = Column(String)
    ingredients = Column(JSON)        # 성분 리스트
    avoid_conditions = Column(JSON)   # 회피 피부 컨디션
    image_url = Column(String)