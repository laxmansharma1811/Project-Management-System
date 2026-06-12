from sqlalchemy.orm import Session
from models.users import User
from core.security import (
    hash_password,
    verify_password,
    create_access_token
)
import logging

logger = logging.getLogger(__name__)

def register_user(db: Session, email: str, password: str):
    try:
        existing_user = db.query(User).filter(User.email == email).first()

        if existing_user:
            raise ValueError("Email already exists.")
        
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters.")
        
        hashed = hash_password(password)
        user = User(
            email=email,
            hashed_password=hashed
        )

        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"User registered: {email}")
        return user
    except ValueError as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        logger.error(f"Registration error: {str(e)}")
        raise Exception(f"Registration failed: {str(e)}")


def login_user(db: Session, email: str, password: str):
    try:
        user = db.query(User).filter(User.email == email).first()

        if not user:
            logger.warning(f"Login attempt for non-existent user: {email}")
            return None
        
        is_valid = verify_password(password, user.hashed_password)
        if not is_valid:
            logger.warning(f"Invalid password for user: {email}")
            return None
        
        token = create_access_token(user.id)
        logger.info(f"User logged in: {email}")
        return token
    except Exception as e:
        logger.error(f"Login error for {email}: {str(e)}")
        return None

