from sqlalchemy.orm import Session
from models.project import Project


def create_project(db: Session, name: str, description: str, workspace_id: int):
    project = Project(
        name=name,
        description=description,
        workspace_id=workspace_id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

def get_projects(db: Session, workspace_id: int):
    return db.query(Project).filter(Project.workspace_id==workspace_id).all()