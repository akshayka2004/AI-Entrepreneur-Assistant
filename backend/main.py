from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from .db import engine, Base, get_db
from .models import Project, ResearchReport, ContentCalendar, ContentVersion
from .orchestrator import Orchestrator

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agentic AI Marketing Platform")

# CORS Setup
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = Orchestrator()

# Pydantic Schemas
class ProjectCreate(BaseModel):
    niche: str
    audience: str
    tone: str
    goals: str

class ProjectResponse(ProjectCreate):
    id: int
    class Config:
        from_attributes = True

# Routes

@app.post("/projects/", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(
        niche=project.niche,
        audience=project.audience,
        tone=project.tone,
        goals=project.goals
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.post("/projects/{project_id}/research")
def start_research(project_id: int, background_tasks: BackgroundTasks):
    # We run this in background or synchronously based on preference. 
    # For a demo, synchronous is often easier to debug, but let's do synchronous for simplicity of "Viva" showing it happening.
    # Actually, the user might want a spinner, but let's keep it simple.
    try:
        result = orchestrator.start_project(project_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/projects/{project_id}/calendar")
def get_calendar(project_id: int, db: Session = Depends(get_db)):
    calendar = db.query(ContentCalendar).filter(ContentCalendar.project_id == project_id).all()
    return calendar

@app.post("/generate/{calendar_id}")
def generate_content(calendar_id: int):
    try:
        # This runs the loop
        result = orchestrator.generate_content(calendar_id)
        return {"status": "completed", "version_id": result.id, "score": result.seo_score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/content/{calendar_id}/versions")
def get_content_versions(calendar_id: int, db: Session = Depends(get_db)):
    versions = db.query(ContentVersion).filter(ContentVersion.calendar_id == calendar_id).all()
    return versions

@app.get("/")
def read_root():
    return {"message": "Welcome to the Agentic AI Marketing Platform API"}
