from sqlalchemy.orm import Session
from models.workspace import Workspace

def create_workspace(db: Session, name: str, owner_id: int):
    workspace = Workspace(
        name=name,
        owner_id=owner_id
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    return workspace


def get_workspace(db: Session, user_id: int):
    return db.query(Workspace).filter(Workspace.owner_id==user_id).all()