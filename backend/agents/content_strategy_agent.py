import os
from dotenv import load_dotenv
from openai import OpenAI
from .base_agent import BaseAgent
from jinja2 import Template
from datetime import datetime, timedelta
import json

load_dotenv()

class ContentStrategyAgent(BaseAgent):
    """
    Content Strategy Agent that creates a comprehensive 14-day content calendar
    based on market research and brand requirements.
    """
    
    def __init__(self):
        super().__init__(name="ContentStrategyAgent")
        api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=api_key) if api_key else None

    def run(self, niche: str, audience: str, tone: str, research_data: dict = None):
        print(f"[{self.name}] Creating content calendar for niche: {niche}")
        
        if self.client and research_data:
            return self._ai_strategy(niche, audience, tone, research_data)
        else:
            return self._template_strategy(niche, audience, tone, research_data)
    
    def _ai_strategy(self, niche: str, audience: str, tone: str, research_data: dict) -> list:
        """Use AI to create a strategic content calendar."""
        try:
            # Extract trends and keywords from research
            trends = research_data.get("trends", [])
            keywords = research_data.get("keyword_clusters", {}).get("primary", [])
            opportunities = research_data.get("content_opportunities", [])
            platforms = research_data.get("audience_insights", {}).get("platforms", ["Instagram", "LinkedIn", "Blog"])
            
            prompt = f"""You are a content strategist for Indian brands. Create a 14-day content calendar.

BRAND INFO:
- Niche: {niche}
- Target Audience: {audience}
- Brand Tone: {tone}

RESEARCH INSIGHTS:
- Trending Topics: {', '.join(trends[:3])}
- Target Keywords: {', '.join(keywords[:3])}
- Content Opportunities: {', '.join(opportunities[:2])}
- Priority Platforms: {', '.join(platforms[:3])}

Create a JSON array of 14 content entries (one per day for 2 weeks). Each entry should have:
{{
    "day": 1,
    "platform": "Instagram/LinkedIn/Twitter/Blog",
    "content_type": "Carousel/Reel/Post/Article/Story/Thread",
    "topic": "Specific, actionable topic title",
    "objective": "Awareness/Engagement/Conversion/Education"
}}

Guidelines:
- Mix platforms and content types for variety
- Include 2-3 educational posts, 2-3 engagement posts, and 1-2 promotional posts per week
- Make topics specific and actionable, not generic
- Consider Indian festivals/events coming up
- Include user-generated content prompts

Return ONLY a valid JSON array, no markdown."""

            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a content strategist. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            calendar_items = json.loads(response.choices[0].message.content)
            
            # Add dates
            start_date = datetime.now()
            result = []
            for item in calendar_items:
                day_offset = item.get("day", 1) - 1
                date = (start_date + timedelta(days=day_offset)).strftime("%Y-%m-%d")
                result.append({
                    "date": date,
                    "platform": item.get("platform", "Blog"),
                    "content_type": item.get("content_type", "Post"),
                    "topic": item.get("topic", "Content Topic"),
                    "objective": item.get("objective", "Engagement")
                })
            
            print(f"[{self.name}] AI calendar created with {len(result)} items")
            return result
            
        except Exception as e:
            print(f"[{self.name}] AI strategy failed: {e}, falling back to template")
            return self._template_strategy(niche, audience, tone, research_data)
    
    def _template_strategy(self, niche: str, audience: str, tone: str, research_data: dict = None) -> list:
        """Template-based content calendar when API is unavailable."""
        
        # Extract some context from research if available
        trends = []
        if research_data:
            trends = research_data.get("trends", [])
        
        # Varied content calendar template
        calendar_template = [
            # Week 1
            {"day": 0, "platform": "Instagram", "content_type": "Carousel", "topic": f"5 Things Every {audience} Should Know About {niche}"},
            {"day": 1, "platform": "LinkedIn", "content_type": "Article", "topic": f"How {niche} is Transforming in 2024: An Industry Analysis"},
            {"day": 2, "platform": "Twitter", "content_type": "Thread", "topic": f"The Ultimate Guide to {niche} for Beginners 🧵"},
            {"day": 3, "platform": "Instagram", "content_type": "Reel", "topic": f"Day in the Life: Behind the Scenes at Our {niche} Brand"},
            {"day": 4, "platform": "Blog", "content_type": "How-To", "topic": f"Step-by-Step: Getting Started with {niche}"},
            {"day": 5, "platform": "LinkedIn", "content_type": "Post", "topic": f"3 Myths About {niche} That Are Holding You Back"},
            {"day": 6, "platform": "Instagram", "content_type": "Story", "topic": f"Weekend Poll: What's Your Biggest {niche} Challenge?"},
            # Week 2
            {"day": 7, "platform": "Twitter", "content_type": "Thread", "topic": f"Case Study: How We Helped a Client Transform Their {niche} Strategy"},
            {"day": 8, "platform": "Instagram", "content_type": "Carousel", "topic": f"Before vs After: {niche} Transformation Stories"},
            {"day": 9, "platform": "Blog", "content_type": "Listicle", "topic": f"Top 10 {niche} Trends to Watch in India"},
            {"day": 10, "platform": "LinkedIn", "content_type": "Post", "topic": f"Why {audience} Are Choosing Quality Over Quantity in {niche}"},
            {"day": 11, "platform": "Instagram", "content_type": "Reel", "topic": f"Quick Tips: 60-Second {niche} Hacks That Actually Work"},
            {"day": 12, "platform": "Twitter", "content_type": "Poll", "topic": f"Community Question: What Feature Do You Want Next?"},
            {"day": 13, "platform": "Blog", "content_type": "Deep-Dive", "topic": f"The Complete {niche} Playbook for {audience}"},
        ]
        
        # Add trending topics if available
        if trends and len(trends) > 0:
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
