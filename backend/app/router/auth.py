from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from db.database import get_db
from sqlalchemy.orm import Session
from schemas.auth import RegisterUser, LoginUser, TokenResponse
from services.auth_service import register_user, login_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register")
def register(payload: RegisterUser, db: Session = Depends(get_db)):
    try:
        user = register_user(
            db,
            payload.email,
            payload.password
        )
        return {"message": "User Created",
                "user_id": user.id
                }
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginUser, db: Session = Depends(get_db)):
    try:
        # Validate email and password are provided
        if not payload.email or not payload.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email and password are required"
            )
        
        token = login_user(
            db,
            payload.email,
            payload.password
        )
        
        if not token:
            logger.warning(f"Login failed for email: {payload.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return TokenResponse(
            access_token=token,
            token_type="bearer"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service error"
        )