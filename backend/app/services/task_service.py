from sqlalchemy.orm import Session
from models.task import Task

def create_task(db: Session, title: str, description: str, project_id: int):
    task = Task(
        title=title,
        description=description,
        project_id=project_id
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_tasks_by_project(db: Session, project_id: int):
    return db.query(Task).filter(Task.project_id == project_id).all()