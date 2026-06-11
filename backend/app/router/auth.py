from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from db.database import get_db
from sqlalchemy.orm import Session
from schemas.auth import RegisterUser, LoginUser
from services.auth_service import register_user, login_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register")
def register(payload: RegisterUser, db: Session = Depends(get_db)):
    user = register_user(
        db,
        payload.email,
        payload.password
    )

    return {"message": "User Created",
            "user_id": user.id
            }

@router.post("/login")
def login(payload: LoginUser, db: Session = Depends(get_db)):
    token = login_user(
            db,
            payload.email,
            payload.password
    )
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    return {
        "access_token": token,
        "token_type": "bearer"
    }