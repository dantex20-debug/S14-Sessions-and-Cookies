from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from passlib.context import CryptContext
from jose import JWTError, jwt
from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from db import get_db
from models import User as DBUser
import models
import db as _db
import json

# Secret key for JWT (in production, use a secure method to store this)
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

app = FastAPI()

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class UserCreate(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    full_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user_by_username(db, username: str):
    result = await db.execute(select(DBUser).where(DBUser.username == username))
    return result.scalars().first()

async def authenticate_user(db, username: str, password: str):
    user = await get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await get_user_by_username(db, username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/register", response_model=User)
async def register(user: UserCreate, db=Depends(get_db)):
    db_user = await get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    new_user = DBUser(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
    )
    db.add(new_user)
    try:
        await db.commit()
        await db.refresh(new_user)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Username or email already registered")
    return User(
        username=new_user.username,
        email=new_user.email,
        full_name=new_user.full_name,
        disabled=not new_user.is_active,
    )

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: DBUser = Depends(get_current_user)):
    return User(
        username=current_user.username,
        email=current_user.email,
        full_name=current_user.full_name,
        disabled=not current_user.is_active,
    )

@app.get("/protected")
async def protected_route(current_user: DBUser = Depends(get_current_user)):
    return {"message": f"Hello, {current_user.username}! This is a protected route."}

# Pydantic models for trading features
class StrategyBase(BaseModel):
    name: str
    description: Optional[str] = None
    parameters: Optional[dict] = None

class StrategyCreate(StrategyBase):
    pass

class StrategyOut(StrategyBase):
    id: int
    class Config:
        orm_mode = True

class TradeBase(BaseModel):
    symbol: str
    volume: float
    price: float
    side: str
    strategy_id: int

class TradeCreate(TradeBase):
    pass

class TradeOut(TradeBase):
    id: int
    timestamp: datetime
    class Config:
        orm_mode = True

class BrokerConnectionBase(BaseModel):
    broker_name: str
    api_key: str

class BrokerConnectionCreate(BrokerConnectionBase):
    pass

class BrokerConnectionOut(BrokerConnectionBase):
    id: int
    class Config:
        orm_mode = True

# --- Strategy Endpoints ---
@app.post("/strategies/", response_model=StrategyOut)
async def create_strategy(strategy: StrategyCreate, current_user: DBUser = Depends(get_current_user), db=Depends(get_db)):
    db_strategy = models.Strategy(
        name=strategy.name,
        description=strategy.description,
        parameters=json.dumps(strategy.parameters) if strategy.parameters else None,
        owner_id=current_user.id,
    )
    db.add(db_strategy)
    await db.commit()
    await db.refresh(db_strategy)
    return StrategyOut(
        id=db_strategy.id,
        name=db_strategy.name,
        description=db_strategy.description,
        parameters=json.loads(db_strategy.parameters) if db_strategy.parameters else None,
    )

@app.get("/strategies/", response_model=List[StrategyOut])
async def list_strategies(current_user: DBUser = Depends(get_current_user), db=Depends(get_db)):
    result = await db.execute(select(models.Strategy).where(models.Strategy.owner_id == current_user.id))
    strategies = result.scalars().all()
    return [StrategyOut(
        id=s.id,
        name=s.name,
        description=s.description,
        parameters=json.loads(s.parameters) if s.parameters else None,
    ) for s in strategies]

@app.delete("/strategies/{strategy_id}")
async def delete_strategy(strategy_id: int, current_user: DBUser = Depends(get_current_user), db=Depends(get_db)):
    result = await db.execute(select(models.Strategy).where(models.Strategy.id == strategy_id, models.Strategy.owner_id == current_user.id))
    strategy = result.scalars().first()
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    await db.delete(strategy)
    await db.commit()
    return {"ok": True}

# --- Trade Endpoints ---
@app.post("/trades/", response_model=TradeOut)
async def create_trade(trade: TradeCreate, current_user: DBUser = Depends(get_current_user), db=Depends(get_db)):
    db_trade = models.Trade(
        symbol=trade.symbol,
        volume=trade.volume,
        price=trade.price,
        side=trade.side,
        user_id=current_user.id,
        strategy_id=trade.strategy_id,
    )
    db.add(db_trade)
    await db.commit()
    await db.refresh(db_trade)
    return TradeOut.from_orm(db_trade)

@app.get("/trades/", response_model=List[TradeOut])
async def list_trades(current_user: DBUser = Depends(get_current_user), db=Depends(get_db)):
    result = await db.execute(select(models.Trade).where(models.Trade.user_id == current_user.id))
    trades = result.scalars().all()
    return [TradeOut.from_orm(t) for t in trades]

# --- Broker Connection Endpoints ---
@app.post("/brokers/", response_model=BrokerConnectionOut)
async def create_broker(broker: BrokerConnectionCreate, current_user: DBUser = Depends(get_current_user), db=Depends(get_db)):
    db_broker = models.BrokerConnection(
        broker_name=broker.broker_name,
        api_key=broker.api_key,
        user_id=current_user.id,
    )
    db.add(db_broker)
    await db.commit()
    await db.refresh(db_broker)
    return BrokerConnectionOut.from_orm(db_broker)

@app.get("/brokers/", response_model=List[BrokerConnectionOut])
async def list_brokers(current_user: DBUser = Depends(get_current_user), db=Depends(get_db)):
    result = await db.execute(select(models.BrokerConnection).where(models.BrokerConnection.user_id == current_user.id))
    brokers = result.scalars().all()
    return [BrokerConnectionOut.from_orm(b) for b in brokers]

@app.delete("/brokers/{broker_id}")
async def delete_broker(broker_id: int, current_user: DBUser = Depends(get_current_user), db=Depends(get_db)):
    result = await db.execute(select(models.BrokerConnection).where(models.BrokerConnection.id == broker_id, models.BrokerConnection.user_id == current_user.id))
    broker = result.scalars().first()
    if not broker:
        raise HTTPException(status_code=404, detail="Broker not found")
    await db.delete(broker)
    await db.commit()
    return {"ok": True}