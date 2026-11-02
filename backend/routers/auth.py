from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import auth

router = APIRouter()

@router.post("/register", response_model=schemas.Token)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    username = user_data.username.strip()
    email = user_data.email.strip().lower()
    if not username or not email:
        raise HTTPException(status_code=400, detail="Username and email are required")

    # Check if username already exists
    existing_username = db.query(models.User).filter(
        func.lower(models.User.username) == username.lower()
    ).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = db.query(models.User).filter(
        func.lower(models.User.email) == email.lower()
    ).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create new user
    hashed_pwd = auth.hash_password(user_data.password)
    new_user = models.User(
        username=username,
        email=email,
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Username or email is already registered")
    db.refresh(new_user)
    
    # Generate token
    token = auth.create_jwt_token(new_user.id)
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    # Accept either username or email, without case sensitivity.
    identifier = (user_data.identifier or user_data.email or "").strip()
    user = None
    if identifier:
        user = db.query(models.User).filter(
            or_(
                func.lower(models.User.email) == identifier.lower(),
                func.lower(models.User.username) == identifier.lower(),
            )
        ).first()
    if not user or not auth.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Generate token
    token = auth.create_jwt_token(user.id)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


@router.patch("/me", response_model=schemas.UserResponse)
def update_me(
    profile: schemas.UserProfileUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    username = profile.username.strip()
    email = profile.email.strip().lower()
    if not username:
        raise HTTPException(status_code=400, detail="Username cannot be empty")
    if "@" not in email or "." not in email.rsplit("@", 1)[-1]:
        raise HTTPException(status_code=400, detail="Enter a valid email address")

    username_taken = db.query(models.User).filter(
        models.User.id != current_user.id,
        func.lower(models.User.username) == username.lower(),
    ).first()
    if username_taken:
        raise HTTPException(status_code=409, detail="That username is already in use")

    email_taken = db.query(models.User).filter(
        models.User.id != current_user.id,
        func.lower(models.User.email) == email.lower(),
    ).first()
    if email_taken:
        raise HTTPException(status_code=409, detail="That email address is already in use")

    current_user.username = username
    current_user.email = email
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Username or email is already in use")
    db.refresh(current_user)
    return current_user


@router.put("/me/password", response_model=schemas.MessageResponse)
def change_password(
    password_change: schemas.PasswordChange,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    if not auth.verify_password(password_change.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(password_change.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters")
    if auth.verify_password(password_change.new_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="New password must differ from your current password")

    current_user.hashed_password = auth.hash_password(password_change.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.delete("/me", response_model=schemas.MessageResponse)
def delete_me(
    request: schemas.AccountDelete,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    if not auth.verify_password(request.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Password is incorrect")

    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted successfully"}
