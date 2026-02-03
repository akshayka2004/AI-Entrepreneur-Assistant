"""
Content Strategy Agent

Creates a comprehensive 14-day content calendar using a single optimized prompt
to minimize API calls and costs.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from .base_agent import BaseAgent
from .ai_client import get_ai_client
from datetime import datetime, timedelta
import json

# Load .env from the backend directory
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(env_path)


class ContentStrategyAgent(BaseAgent):
    """
    Content Strategy Agent that creates a comprehensive 14-day content calendar
    based on market research and brand requirements.
    
    Uses a single prompt to generate all 14 days at once for efficiency.
    """
    
    def __init__(self):
        super().__init__(name="ContentStrategyAgent")
        self.ai_client = get_ai_client()

    def run(self, niche: str, audience: str, tone: str, research_data: dict = None):
        print(f"[{self.name}] Creating content calendar for niche: {niche}")
        
        if self.ai_client.providers and research_data:
            result = self._ai_strategy(niche, audience, tone, research_data)
            if result:
                return result
        
        print(f"[{self.name}] Using template-based calendar...")
        return self._template_strategy(niche, audience, tone, research_data)
    
    def _ai_strategy(self, niche: str, audience: str, tone: str, research_data: dict) -> list:
        """
        Use AI to create a strategic content calendar.
        Generates all 14 days in a single API call for efficiency.
        """
        
        from datetime import datetime
        current_date = datetime.now().strftime("%B %Y")
        current_year = datetime.now().year
        
        # Extract research insights
        trends = research_data.get("trends", [])
        keywords = research_data.get("keyword_clusters", {}).get("primary", [])
        opportunities = research_data.get("content_opportunities", [])
        platforms = research_data.get("audience_insights", {}).get("platforms", ["Instagram", "LinkedIn", "Blog"])
        
        # Single comprehensive prompt for all 14 days
        prompt = f"""Create a 14-day content calendar for a brand in the {niche} industry. Current date: {current_date}.

BRAND INFO:
- Niche: {niche}
- Target Audience: {audience}
- Brand Tone: {tone}

RESEARCH INSIGHTS:
- Trending Topics: {', '.join(trends[:3]) if trends else 'General industry trends'}
- Target Keywords: {', '.join(keywords[:3]) if keywords else 'Industry keywords'}
- Content Opportunities: {', '.join(opportunities[:2]) if opportunities else 'Educational and engagement content'}
- Priority Platforms: {', '.join(platforms[:3]) if platforms else 'Instagram, LinkedIn, Blog'}

IMPORTANT:
- Consider any upcoming Indian festivals or events in the next 14 days
- Use {current_year} trends and current social media practices
- Topics should be SPECIFIC and actionable, not generic

Generate a JSON array with exactly 14 content entries. Each entry must have:
- day: number (1-14)
- platform: one of "Instagram", "LinkedIn", "Twitter", "Blog"
- content_type: appropriate for the platform (Carousel/Reel/Post/Article/Story/Thread/Poll)
- topic: specific, actionable topic title (not generic)
- objective: one of "Awareness", "Engagement", "Conversion", "Education"

GUIDELINES:
- Mix platforms for variety (don't use same platform 2 days in a row)
- Week 1: Focus on awareness and education
- Week 2: Focus on engagement and conversion
- Include 1 user-generated content prompt
- Make topics SPECIFIC to the {niche} industry, not generic
- Consider what would actually engage {audience}

Return ONLY a valid JSON array with exactly 14 items."""

        system_prompt = f"""You are an expert social media strategist for Indian brands. 
You create content calendars that drive real engagement.
Always respond with valid JSON array only, no markdown or explanation."""

        result = self.ai_client.generate_json(prompt, system_prompt, temperature=0.7, max_tokens=2000)
        
        if result and isinstance(result, list):
            # Process and add dates
            start_date = datetime.now()
            processed = []
            
            for item in result:
                day_num = item.get("day", len(processed) + 1)
                day_offset = day_num - 1
                date = (start_date + timedelta(days=day_offset)).strftime("%Y-%m-%d")
                
                processed.append({
                    "date": date,
                    "platform": item.get("platform", "Blog"),
                    "content_type": item.get("content_type", "Post"),
                    "topic": item.get("topic", "Content Topic"),
                    "objective": item.get("objective", "Engagement")
                })
            
            print(f"[{self.name}] AI calendar created with {len(processed)} items")
            return processed
        
        return None
    
    def _template_strategy(self, niche: str, audience: str, tone: str, research_data: dict = None) -> list:
        """Template-based content calendar when API is unavailable."""
        
        trends = []
        if research_data:
            trends = research_data.get("trends", [])
        
        # Varied content calendar template
        calendar_template = [
            # Week 1 - Awareness & Education
            {"day": 0, "platform": "Instagram", "content_type": "Carousel", "topic": f"5 Things Every {audience} Should Know About {niche}"},
            {"day": 1, "platform": "LinkedIn", "content_type": "Article", "topic": f"How {niche} is Transforming in 2024: An Industry Analysis"},
            {"day": 2, "platform": "Twitter", "content_type": "Thread", "topic": f"The Ultimate Guide to {niche} for Beginners 🧵"},
            {"day": 3, "platform": "Instagram", "content_type": "Reel", "topic": f"Day in the Life: Behind the Scenes at Our {niche} Brand"},
            {"day": 4, "platform": "Blog", "content_type": "How-To", "topic": f"Step-by-Step: Getting Started with {niche}"},
            {"day": 5, "platform": "LinkedIn", "content_type": "Post", "topic": f"3 Myths About {niche} That Are Holding You Back"},
            {"day": 6, "platform": "Instagram", "content_type": "Story", "topic": f"Weekend Poll: What's Your Biggest {niche} Challenge?"},
            # Week 2 - Engagement & Conversion
            {"day": 7, "platform": "Twitter", "content_type": "Thread", "topic": f"Case Study: How We Helped a Client Transform Their {niche} Strategy"},
            {"day": 8, "platform": "Instagram", "content_type": "Carousel", "topic": f"Before vs After: {niche} Transformation Stories"},
            {"day": 9, "platform": "Blog", "content_type": "Listicle", "topic": f"Top 10 {niche} Trends to Watch in India"},
            {"day": 10, "platform": "LinkedIn", "content_type": "Post", "topic": f"Why {audience} Are Choosing Quality Over Quantity in {niche}"},
            {"day": 11, "platform": "Instagram", "content_type": "Reel", "topic": f"Quick Tips: 60-Second {niche} Hacks That Actually Work"},
            {"day": 12, "platform": "Twitter", "content_type": "Poll", "topic": f"Community Question: What Feature Do You Want Next?"},
            {"day": 13, "platform": "Blog", "content_type": "Deep-Dive", "topic": f"The Complete {niche} Playbook for {audience}"},
        ]
        
        # Add trending topic if available
        if trends:
            calendar_template.append({
                "day": 14,
                "platform": "Instagram",
                "content_type": "Carousel",
                "topic": f"Trending Now: {trends[0]} - What It Means for You"
            })
        
        start_date = datetime.now()
        result = []
        
        for item in calendar_template:
            date = (start_date + timedelta(days=item["day"])).strftime("%Y-%m-%d")
            result.append({
                "date": date,
                "platform": item["platform"],
                "content_type": item["content_type"],
                "topic": item["topic"],
                "objective": "Engagement"
            })
        
        print(f"[{self.name}] Template calendar created with {len(result)} items")
        return result
