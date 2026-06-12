from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.workspace import WorkspaceCreate
from services.workspace_service import create_workspace, get_workspace
from core.dependencies import get_current_user


router = APIRouter(
    prefix="/workspaces",
    tags=["Workspaces"]
)


@router.get("/")
def get_workspaces(db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    workspaces = get_workspace(db, user_id)
    return [{"id": w.id, "name": w.name, "owner_id": w.owner_id} for w in workspaces]


@router.post("/")
def create_new_workspace(payload: WorkspaceCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    workspace = create_workspace(
        db,
        payload.name,
        user_id
    )
    return {"id": workspace.id, "name": workspace.name, "owner_id": workspace.owner_id}