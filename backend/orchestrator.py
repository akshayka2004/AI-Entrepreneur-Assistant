from sqlalchemy.orm import Session
from .db import SessionLocal
from .models import Project, ResearchReport, ContentCalendar, ContentVersion
from .agents.market_research_agent import MarketResearchAgent
from .agents.content_strategy_agent import ContentStrategyAgent
from .agents.writer_agent import WriterAgent
from .agents.seo_agent import SEOAgent
from .agents.scoring_agent import ScoringAgent
import json

class Orchestrator:
    def __init__(self):
        self.market_research_agent = MarketResearchAgent()
        self.content_strategy_agent = ContentStrategyAgent()
        self.writer_agent = WriterAgent()
        self.seo_agent = SEOAgent()
        self.scoring_agent = ScoringAgent()

    def get_db(self):
        return SessionLocal()

    def start_project(self, project_id: int):
        """
        Initialize a project with market research and content calendar.
        This is the main orchestration entry point.
        """
        print(f"[Orchestrator] Starting project {project_id}")
        db = self.get_db()
        try:
            project = db.query(Project).filter(Project.id == project_id).first()
            if not project:
                raise ValueError("Project not found")

            # 1. Market Research - deeply analyze niche and audience
            print(f"[Orchestrator] Step 1: Running Market Research Agent")
            research_data = self.market_research_agent.run(project.niche, project.audience)
            
            # Save Research Report
            report = ResearchReport(
                project_id=project.id,
                summary=research_data.get("summary", ""),
                keyword_clusters=research_data.get("keyword_clusters", {}),
                competitors=research_data.get("competitors", [])
            )
            db.add(report)
            db.commit()
            db.refresh(report)
            
            # Store full research data for content strategy
            project_research = {
                "summary": research_data.get("summary", ""),
                "trends": research_data.get("trends", []),
                "keyword_clusters": research_data.get("keyword_clusters", {}),
                "content_opportunities": research_data.get("content_opportunities", []),
                "audience_insights": research_data.get("audience_insights", {})
            }
            
            # 2. Content Strategy - create 14-day calendar with AI
            print(f"[Orchestrator] Step 2: Running Content Strategy Agent")
            calendar_data = self.content_strategy_agent.run(
                niche=project.niche,
                audience=project.audience,
                tone=project.tone,
                research_data=project_research
            )
            
            # Save Calendar Items
            for item in calendar_data:
                calendar_entry = ContentCalendar(
                    project_id=project.id,
                    platform=item.get("platform", "Blog"),
                    date=item.get("date"),
                    content_type=item.get("content_type", "Post"),
                    topic=item.get("topic", "")
                )
                db.add(calendar_entry)
            
            db.commit()
            print(f"[Orchestrator] Project initialized successfully!")
            print(f"[Orchestrator] - Research Report ID: {report.id}")
            print(f"[Orchestrator] - Calendar Items: {len(calendar_data)}")
            
            return {
                "status": "started", 
                "research_id": report.id, 
                "calendar_size": len(calendar_data)
            }

        finally:
            db.close()

    def generate_content(self, calendar_id: int):
        """
        Generate content with SEO feedback loop.
        This implements the core agentic behavior where the WriterAgent
        iteratively improves content based on SEOAgent feedback.
        """
        print(f"[Orchestrator] Generating content for Calendar ID {calendar_id}")
        db = self.get_db()
        try:
            calendar_item = db.query(ContentCalendar).filter(ContentCalendar.id == calendar_id).first()
            if not calendar_item:
                raise ValueError("Calendar item not found")
                
            project = calendar_item.project
            
            # Fetch research context for better content
            research_report = db.query(ResearchReport).filter(
                ResearchReport.project_id == project.id
            ).first()
            
            research_context = None
            if research_report:
                research_context = {
                    "keyword_clusters": research_report.keyword_clusters or {},
                    "summary": research_report.summary
                }
            
            # Initial Draft with full context
            topic = calendar_item.topic
            tone = project.tone
            platform = calendar_item.platform
            
            print(f"[Orchestrator] Creating initial draft...")
            print(f"[Orchestrator] Topic: {topic}")
            print(f"[Orchestrator] Platform: {platform}, Tone: {tone}")
            
            current_draft = self.writer_agent.run(
                topic=topic, 
                tone=tone, 
                platform=platform,
                research_context=research_context
            )
            
            # Feedback Loop (Max 3 iterations)
            max_iterations = 3
            iteration = 0
            best_draft = current_draft
            best_score = 0
            
            while iteration < max_iterations:
                print(f"[Orchestrator] ─── Iteration {iteration + 1}/{max_iterations} ───")
                
                # Analyze current draft
                seo_analysis = self.seo_agent.run(current_draft)
                score = seo_analysis["score"]
                
                print(f"[Orchestrator] SEO Score: {score}")
                
                # Track best version
                if score > best_score:
                    best_score = score
                    best_draft = current_draft
                
                # Check if quality threshold is met
                if score > 70:
                    print(f"[Orchestrator] ✓ Score {score} > 70. Quality approved!")
                    break
                
                # Generate feedback for improvement
                print(f"[Orchestrator] ✗ Score {score} <= 70. Requesting improvements...")
                feedback_points = seo_analysis.get('feedback', [])
                feedback = f"Current SEO score: {score}/100. Please improve: {'; '.join(feedback_points)}"
                
                # Request rewrite with feedback
                current_draft = self.writer_agent.run(
                    topic=topic, 
                    tone=tone,
                    platform=platform,
                    feedback=feedback,
                    research_context=research_context
                )
                iteration += 1
            
            # Use best performing draft
            if best_score > seo_analysis["score"]:
                current_draft = best_draft
                seo_analysis = self.seo_agent.run(current_draft)
            
            # Final scoring
            final_scores = self.scoring_agent.run(seo_analysis, tone, current_draft)
            
            print(f"[Orchestrator] Final Scores:")
            print(f"[Orchestrator] - SEO: {final_scores['seo_score']}")
            print(f"[Orchestrator] - Brand: {final_scores['brand_score']}")
            print(f"[Orchestrator] - Readability: {seo_analysis['readability']:.1f}")
            
            # Count existing versions
            existing_versions = db.query(ContentVersion).filter(
                ContentVersion.calendar_id == calendar_item.id
            ).count()
            
            # Save Version
            version = ContentVersion(
                calendar_id=calendar_item.id,
                title=f"{calendar_item.topic[:50]}...",
                body=current_draft,
                seo_score=final_scores["seo_score"],
                readability_score=seo_analysis["readability"],
                brand_score=final_scores["brand_score"],
                version_number=existing_versions + 1
            )
            db.add(version)
            db.commit()
            db.refresh(version)
            
            print(f"[Orchestrator] ✓ Content saved as Version {version.version_number}")
            return version

        finally:
            db.close()
