from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    description: str = None
    project_id: int

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str = None
    status: str
    project_id: int

    class Config:
        from_attributes = True