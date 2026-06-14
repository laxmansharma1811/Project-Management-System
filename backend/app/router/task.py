from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.task_service import create_task, get_tasks_by_project
from schemas.task import TaskCreate
from models.task import Task
from core.dependencies import get_current_user


router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)

@router.post("/")
def create_new_task(payload: TaskCreate, db: Session = Depends(get_db)):
    return create_task(
        db, 
        payload.title,
        payload.description,
        payload.project_id
    )

@router.get("/project/{project_id}")
def get_tasks(project_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    return get_tasks_by_project(db, project_id)