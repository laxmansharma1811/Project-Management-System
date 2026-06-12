from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from dependencies.auth import get_current_user
from schemas.project import ProjectCreate
from services.project_service import create_project, get_projects

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("/")
def create_project(payload: ProjectCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    return create_project(
        db,
        payload.name,
        payload.description,
        payload.workspace_id
    )

@router.get("/{workspace_id}")
def list_projects(workspace_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    return get_projects(db, workspace_id)