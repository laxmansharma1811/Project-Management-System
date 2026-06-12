from fastapi import FastAPI
from db.database import Base
from db.database import engine
from router.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from router.workspace import router as workspace_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(workspace_router)