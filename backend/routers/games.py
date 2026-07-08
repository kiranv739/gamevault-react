import os
import random
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
import httpx
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter()

@router.get("/featured", response_model=List[schemas.GameResponse])
def get_featured(db: Session = Depends(get_db)):
    # Return 8 games for carousel ordered by rating descending
    games = db.query(models.Game).order_by(models.Game.rating.desc()).limit(8).all()
    return games

@router.get("/{id}", response_model=schemas.GameResponse)
def get_game(id: int, db: Session = Depends(get_db)):
    game = db.query(models.Game).filter(models.Game.id == id).first()
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    return game

@router.get("", response_model=List[schemas.GameResponse])
def get_games(
    search: Optional[str] = None,
    genre: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(models.Game)
    
    if search:
        query = query.filter(models.Game.title.ilike(f"%{search}%"))
        
    if genre:
        query = query.filter(models.Game.genre.ilike(f"%{genre}%"))
        
    # Apply pagination
    offset = (page - 1) * limit
    games = query.offset(offset).limit(limit).all()
    return games

@router.post("/seed", response_model=schemas.MessageResponse)
def seed_games(db: Session = Depends(get_db)):
    api_key = os.getenv("RAWG_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="RAWG_API_KEY environment variable is not configured."
        )
    
    total_seeded = 0
    seeded_slugs = set()
    
    # We need to fetch 100 games. We'll make requests to RAWG:
    # Page 1: 40 games, Page 2: 40 games, Page 3: 20 games
    with httpx.Client() as client:
        for page in [1, 2, 3]:
            page_size = 40 if page < 3 else 20
            url = f"https://api.rawg.io/api/games?key={api_key}&page_size={page_size}&page={page}"
            try:
                response = client.get(url, timeout=10.0)
                response.raise_for_status()
                data = response.json()
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Failed to fetch games from RAWG API: {str(e)}"
                )
                
            results = data.get("results", [])
            for game_data in results:
                rawg_id = game_data.get("slug")
                if not rawg_id or rawg_id in seeded_slugs:
                    continue
                
                seeded_slugs.add(rawg_id)
                title = game_data.get("name")
                
                # genres[0].name -> genre
                genres = game_data.get("genres", [])
                genre = genres[0].get("name") if genres else None
                
                rating = game_data.get("rating", 0.0)
                image_url = game_data.get("background_image")
                
                # Check duplicate
                existing_game = db.query(models.Game).filter(models.Game.rawg_id == rawg_id).first()
                if existing_game:
                    # Update fields
                    existing_game.title = title
                    existing_game.genre = genre
                    existing_game.rating = rating
                    existing_game.image_url = image_url
                    existing_game.cached_at = datetime.utcnow()
                else:
                    # Generate price: random between 299 and 6999
                    price = float(random.randint(299, 6999))
                    # Generate discount: random 0, 10, 15, 20, 25, 30
                    discount = random.choice([0, 10, 15, 20, 25, 30])
                    
                    new_game = models.Game(
                        rawg_id=rawg_id,
                        title=title,
                        genre=genre,
                        rating=rating,
                        price=price,
                        discount=discount,
                        image_url=image_url,
                        description=None,
                        cached_at=datetime.utcnow()
                    )
                    db.add(new_game)
                total_seeded += 1
                
        db.commit()
        
    return {"message": f"Successfully seeded {total_seeded} games from RAWG API."}
