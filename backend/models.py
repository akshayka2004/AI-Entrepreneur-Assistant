from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .db import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    niche = Column(String, index=True)
    audience = Column(String)
    tone = Column(String)
    goals = Column(String)

    research_reports = relationship("ResearchReport", back_populates="project")
    content_calendars = relationship("ContentCalendar", back_populates="project")

class ResearchReport(Base):
    __tablename__ = "research_reports"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    summary = Column(Text)
    keyword_clusters = Column(JSON)  # Stores list of strings or dicts
    competitors = Column(JSON)       # Stores list of strings or dicts

    project = relationship("Project", back_populates="research_reports")

class ContentCalendar(Base):
    __tablename__ = "content_calendar"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    platform = Column(String)
    date = Column(String)
    content_type = Column(String)
    topic = Column(String)

    project = relationship("Project", back_populates="content_calendars")
    versions = relationship("ContentVersion", back_populates="calendar_item")

class ContentVersion(Base):
    __tablename__ = "content_versions"

    id = Column(Integer, primary_key=True, index=True)
    calendar_id = Column(Integer, ForeignKey("content_calendar.id"))
    title = Column(String, default="")
    body = Column(Text, default="")
    seo_score = Column(Integer, default=0)
    readability_score = Column(Integer, default=0)
    brand_score = Column(Integer, default=0)
    version_number = Column(Integer, default=1)

    calendar_item = relationship("ContentCalendar", back_populates="versions")
