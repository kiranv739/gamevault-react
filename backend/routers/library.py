from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
import auth

router = APIRouter()

@router.get("", response_model=List[schemas.LibraryResponse])
def get_library(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch all library items of current user
    library_items = db.query(models.Library).filter(models.Library.user_id == current_user.id).all()
    return library_items

@router.post("/{game_id}", response_model=schemas.LibraryResponse)
def add_to_library(
    game_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Verify game exists
    game = db.query(models.Game).filter(models.Game.id == game_id).first()
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    
    # Check for duplicate
    existing_item = db.query(models.Library).filter(
        models.Library.user_id == current_user.id,
        models.Library.game_id == game_id
    ).first()
    if existing_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Game is already in your library"
        )
    
    new_item = models.Library(user_id=current_user.id, game_id=game_id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/{game_id}", response_model=schemas.MessageResponse)
def remove_from_library(
    game_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(models.Library).filter(
        models.Library.user_id == current_user.id,
        models.Library.game_id == game_id
    ).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found in library"
        )
    
    db.delete(item)
    db.commit()
    return {"message": "Successfully removed game from library."}
