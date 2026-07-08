from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
import auth

router = APIRouter()

@router.get("", response_model=List[schemas.CartResponse])
def get_cart(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch all cart items of current user
    cart_items = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).all()
    return cart_items

@router.post("/{game_id}", response_model=schemas.CartResponse)
def add_to_cart(
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
    
    # Check duplicate
    existing_item = db.query(models.Cart).filter(
        models.Cart.user_id == current_user.id,
        models.Cart.game_id == game_id
    ).first()
    if existing_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Game is already in your cart"
        )
    
    new_item = models.Cart(user_id=current_user.id, game_id=game_id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/{game_id}", response_model=schemas.MessageResponse)
def remove_from_cart(
    game_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(models.Cart).filter(
        models.Cart.user_id == current_user.id,
        models.Cart.game_id == game_id
    ).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found in cart"
        )
    
    db.delete(item)
    db.commit()
    return {"message": "Successfully removed game from cart."}
