from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, UniqueConstraint, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
from pgvector.sqlalchemy import Vector

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    library_items = relationship("Library", back_populates="user", cascade="all, delete-orphan")
    cart_items = relationship("Cart", back_populates="user", cascade="all, delete-orphan")

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    rawg_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    genre = Column(String, nullable=True)
    rating = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    discount = Column(Integer, nullable=False)
    image_url = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    embedding = Column(Vector(384), nullable=True)
    publisher = Column(String, nullable=True)
    developer = Column(String, nullable=True)
    release_date = Column(String, nullable=True)
    esrb_rating = Column(String, nullable=True)
    platforms = Column(String, nullable=True)
    min_requirements = Column(Text, nullable=True)
    recommended_requirements = Column(Text, nullable=True)
    cached_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    library_items = relationship("Library", back_populates="game", cascade="all, delete-orphan")
    cart_items = relationship("Cart", back_populates="game", cascade="all, delete-orphan")

class Library(Base):
    __tablename__ = "libraries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.id", ondelete="CASCADE"), nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_purchased = Column(Boolean, default=False, nullable=False)

    # Relationships
    user = relationship("User", back_populates="library_items")
    game = relationship("Game", back_populates="library_items")

    # Constraints
    __table_args__ = (
        UniqueConstraint("user_id", "game_id", name="uq_user_library_game"),
    )

class Cart(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.id", ondelete="CASCADE"), nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="cart_items")
    game = relationship("Game", back_populates="cart_items")

    # Constraints
    __table_args__ = (
        UniqueConstraint("user_id", "game_id", name="uq_user_cart_game"),
    )
