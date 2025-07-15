from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, DateTime, Text
from sqlalchemy.orm import relationship
from .db import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    strategies = relationship("Strategy", back_populates="owner")
    trades = relationship("Trade", back_populates="user")
    broker_connections = relationship("BrokerConnection", back_populates="user")

class Strategy(Base):
    __tablename__ = "strategies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    parameters = Column(Text, nullable=True)  # JSON string
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="strategies")
    trades = relationship("Trade", back_populates="strategy")

class Trade(Base):
    __tablename__ = "trades"
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False)
    volume = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    side = Column(String, nullable=False)  # buy/sell
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="trades")
    strategy_id = Column(Integer, ForeignKey("strategies.id"))
    strategy = relationship("Strategy", back_populates="trades")

class BrokerConnection(Base):
    __tablename__ = "broker_connections"
    id = Column(Integer, primary_key=True, index=True)
    broker_name = Column(String, nullable=False)
    api_key = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="broker_connections")