from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
import auth

router = APIRouter()

@router.post("/checkout", response_model=List[schemas.GameResponse])
def checkout(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch all cart items of current user
    cart_items = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your cart is empty."
        )
    
    purchased_games = []
    
    # Process each cart item
    for item in cart_items:
        # Check duplicate in library table
        existing_item = db.query(models.Library).filter(
            models.Library.user_id == current_user.id,
            models.Library.game_id == item.game_id
        ).first()
        
        if not existing_item:
            new_library_item = models.Library(
                user_id=current_user.id,
                game_id=item.game_id,
                is_purchased=True
            )
            db.add(new_library_item)
        else:
            existing_item.is_purchased = True
            
        purchased_games.append(item.game)
        
        # Delete cart item
        db.delete(item)
        
    db.commit()
    return purchased_games
