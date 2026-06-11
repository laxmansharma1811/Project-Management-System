from sqlalchemy.orm import Session
from models.users import User
from core.security import (
    hash_password,
    verify_password,
    create_access_token
)

def register_user(db: Session, email: str, password: str):
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise Exception("Email already exists.")
    
    user = User(
        email=email,
        hashed_password=hash_password(password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None
    
    if not verify_password(password, user.hashed_password):
        return None
    
    return create_access_token(user.id)

