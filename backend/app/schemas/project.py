from pydantic import BaseModel

class ProjectCreate(BaseModel):
    name: str
    description: str | None = None
    workspace_id: int

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    workspace_id: int

    class Config:
        from_attributes = True