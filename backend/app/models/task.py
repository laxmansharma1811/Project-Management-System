from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from db.database import Base

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default='TODO')
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)