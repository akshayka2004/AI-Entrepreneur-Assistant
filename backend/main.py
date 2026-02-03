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

@app.get("/projects/{project_id}/research")
def get_research(project_id: int, db: Session = Depends(get_db)):
    """Fetch existing research report for a project."""
    report = db.query(ResearchReport).filter(ResearchReport.project_id == project_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="No research found. Please run research first.")
    return {
        "summary": report.summary,
        "keyword_clusters": report.keyword_clusters or {},
        "competitors": report.competitors or [],
        "trends": report.trends or [],
        "audience_insights": report.audience_insights or {}
    }

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

@app.post("/content/{calendar_id}/write")
def write_content(calendar_id: int):
    """Generate/regenerate content for a calendar item."""
    try:
        result = orchestrator.generate_content(calendar_id)
        return {"status": "completed", "version_id": result.id, "score": result.seo_score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/content/{calendar_id}/hashtags")
def generate_hashtags(calendar_id: int, db: Session = Depends(get_db)):
    """Generate hashtags for a content piece."""
    from .agents.ai_client import get_ai_client
    
    # Get the calendar item and latest content
    calendar_item = db.query(ContentCalendar).filter(ContentCalendar.id == calendar_id).first()
    if not calendar_item:
        raise HTTPException(status_code=404, detail="Calendar item not found")
    
    latest_version = db.query(ContentVersion).filter(
        ContentVersion.calendar_id == calendar_id
    ).order_by(ContentVersion.version_number.desc()).first()
    
    content_text = latest_version.body if latest_version else calendar_item.topic
    
    ai_client = get_ai_client()
    prompt = f"""Generate 15 trending and relevant hashtags for this social media content.
    
Platform: {calendar_item.platform}
Topic: {calendar_item.topic}
Content: {content_text[:500]}

Return ONLY the hashtags, one per line, starting with #. Make them relevant for Indian audience.
Mix popular hashtags with niche-specific ones."""
    
    result = ai_client.generate(prompt, max_tokens=200)
    
    if result:
        hashtags = [tag.strip() for tag in result.split('\n') if tag.strip().startswith('#')]
        return {"hashtags": hashtags[:15]}
    
    return {"hashtags": ["#Marketing", "#Business", "#India", "#Growth", "#Content"]}

class RepurposeRequest(BaseModel):
    target_platform: str

@app.post("/content/{calendar_id}/repurpose")
def repurpose_content(calendar_id: int, request: RepurposeRequest, db: Session = Depends(get_db)):
    """Repurpose content for a different platform."""
    from .agents.ai_client import get_ai_client
    
    calendar_item = db.query(ContentCalendar).filter(ContentCalendar.id == calendar_id).first()
    if not calendar_item:
        raise HTTPException(status_code=404, detail="Calendar item not found")
    
    latest_version = db.query(ContentVersion).filter(
        ContentVersion.calendar_id == calendar_id
    ).order_by(ContentVersion.version_number.desc()).first()
    
    if not latest_version:
        raise HTTPException(status_code=404, detail="No content found to repurpose")
    
    platform_guides = {
        "Twitter": "Convert to a punchy tweet thread (max 280 chars per tweet, use emoji, make it viral)",
        "Instagram": "Convert to an engaging Instagram caption with emojis and line breaks",
        "LinkedIn": "Convert to a professional LinkedIn post with insights and a call-to-action",
        "Blog": "Expand into a detailed blog post with headers and sections",
        "Facebook": "Convert to a conversational Facebook post that encourages comments"
    }
    
    guide = platform_guides.get(request.target_platform, "Adapt appropriately")
    
    ai_client = get_ai_client()
    prompt = f"""Repurpose this content for {request.target_platform}.

ORIGINAL PLATFORM: {calendar_item.platform}
ORIGINAL CONTENT:
{latest_version.body}

TASK: {guide}

Return ONLY the repurposed content, ready to post."""
    
    result = ai_client.generate(prompt, max_tokens=1000)
    
    if result:
        return {"platform": request.target_platform, "content": result}
    
    raise HTTPException(status_code=500, detail="Failed to repurpose content")

class TemplateRequest(BaseModel):
    topics: list[str]
    platform: str = "Blog"

@app.post("/projects/{project_id}/apply-template")
def apply_template(project_id: int, request: TemplateRequest, db: Session = Depends(get_db)):
    """Add template topics to the content calendar."""
    from datetime import datetime, timedelta
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get the last date in calendar or start from today
    last_calendar = db.query(ContentCalendar).filter(
        ContentCalendar.project_id == project_id
    ).order_by(ContentCalendar.date.desc()).first()
    
    if last_calendar and last_calendar.date:
        start_date = datetime.strptime(last_calendar.date, "%Y-%m-%d") + timedelta(days=1)
    else:
        start_date = datetime.now()
    
    # Add each topic as a new calendar item
    added_items = []
    for i, topic in enumerate(request.topics):
        calendar_entry = ContentCalendar(
            project_id=project_id,
            platform=request.platform,
            date=(start_date + timedelta(days=i)).strftime("%Y-%m-%d"),
            content_type="Post",
            topic=topic
        )
        db.add(calendar_entry)
        added_items.append({
            "topic": topic,
            "date": calendar_entry.date,
            "platform": request.platform
        })
    
    db.commit()
    
    return {
        "status": "success",
        "added": len(added_items),
        "items": added_items
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to the Agentic AI Marketing Platform API"}

