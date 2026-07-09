from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class GameResponse(BaseModel):
    id: int
    rawg_id: str
    title: str
    genre: Optional[str] = None
    rating: float
    price: float
    discount: int
    image_url: Optional[str] = None
    description: Optional[str] = None
    publisher: Optional[str] = None
    developer: Optional[str] = None
    release_date: Optional[str] = None
    esrb_rating: Optional[str] = None
    platforms: Optional[str] = None
    min_requirements: Optional[str] = None
    recommended_requirements: Optional[str] = None
    cached_at: datetime

    class Config:
        from_attributes = True

class LibraryResponse(BaseModel):
    id: int
    user_id: int
    game_id: int
    added_at: datetime
    is_purchased: bool
    game: GameResponse

    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    id: int
    user_id: int
    game_id: int
    added_at: datetime
    game: GameResponse

    class Config:
        from_attributes = True

class MessageResponse(BaseModel):
    message: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
