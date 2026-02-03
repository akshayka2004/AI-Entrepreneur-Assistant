"""
Market Research Agent

Uses the unified AI client to analyze market trends, competitors, and keywords
for a given niche and target audience.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from .base_agent import BaseAgent
from .ai_client import get_ai_client

# Load .env from the backend directory
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(env_path)


class MarketResearchAgent(BaseAgent):
    """
    Market Research Agent that analyzes trends, competitors, and keywords
    for a given niche and target audience using AI.
    """
    
    def __init__(self):
        super().__init__(name="MarketResearchAgent")
        self.ai_client = get_ai_client()

    def run(self, niche: str, audience: str):
        print(f"[{self.name}] Researching niche: {niche} for audience: {audience}")
        
        if self.ai_client.providers:
            result = self._ai_research(niche, audience)
            if result:
                return result
        
        print(f"[{self.name}] Using fallback mock data...")
        return self._mock_research(niche, audience)
    
    def _ai_research(self, niche: str, audience: str) -> dict:
        """Use AI to generate realistic market research."""
        
        from datetime import datetime
        current_date = datetime.now().strftime("%B %Y")
        current_year = datetime.now().year
        
        # Enhanced prompt with current date context for relevance
        prompt = f"""You are a market research analyst. Today's date is {current_date}.

Analyze the market for the following business:

BUSINESS DETAILS:
- Industry/Niche: {niche}
- Target Audience: {audience}
- Market: India
- Analysis Period: {current_year - 1} to {current_year + 1}

CRITICAL INSTRUCTIONS:
1. Use ONLY REAL, EXISTING company/brand names that operate in India
2. Reference CURRENT trends as of {current_year} (not outdated information)
3. Include specific data points, percentages, or statistics where relevant
4. Consider post-pandemic digital transformation and current economic context
5. Be specific to Indian market conditions, pricing expectations, and consumer behavior

Provide your analysis in this exact JSON format:
{{
    "summary": "A 2-3 sentence executive summary highlighting the key market opportunity in {current_year}. Mention market size or growth if known.",
    "competitors": [
        "Competitor 1: Real Indian brand/company name",
        "Competitor 2: Another real competitor",
        "Competitor 3: Third real competitor",
        "Competitor 4: Fourth real competitor",
        "Competitor 5: Fifth real competitor"
    ],
    "trends": [
        "Trend 1: Specific {current_year} trend with context",
        "Trend 2: Another relevant current trend",
        "Trend 3: Technology or digital trend affecting this industry",
        "Trend 4: Consumer behavior shift",
        "Trend 5: Emerging opportunity"
    ],
    "keyword_clusters": {{
        "primary": ["5 high-volume search keywords for this niche in India"],
        "secondary": ["5 long-tail keywords that show buying intent"],
        "trending": ["3 trending hashtags or phrases on Indian social media"]
    }},
    "content_opportunities": [
        "Gap 1: Specific content opportunity based on {current_year} trends",
        "Gap 2: Underserved topic in this niche",
        "Gap 3: Seasonal or cultural opportunity for Indian market"
    ],
    "audience_insights": {{
        "pain_points": ["3 specific pain points of {audience}"],
        "preferences": ["3 content or buying preferences"],
        "platforms": ["Top 3 social/digital platforms where {audience} is active"]
    }}
}}

Remember:
- Use REAL Indian brand/company names as competitors
- Be specific about trends, not generic
- Keywords should be what people actually search for"""

        system_prompt = """You are an expert market research analyst specializing in Indian markets and digital marketing. 
Your research is always specific, actionable, and based on real market data. 
Always respond with valid JSON only, no markdown formatting."""

        result = self.ai_client.generate_json(prompt, system_prompt, temperature=0.7, max_tokens=1500)
        
        if result:
            print(f"[{self.name}] AI research completed successfully")
            return result
        
        return None
    
    def _mock_research(self, niche: str, audience: str) -> dict:
        """Fallback mock research when API is unavailable."""
        return {
            "summary": f"The {niche} market in India is experiencing significant growth, particularly among {audience}. There's strong potential for brands focusing on authenticity and sustainability.",
            "competitors": [
                f"Leading {niche} Brand A",
                f"Emerging {niche} Startup B", 
                f"Established {niche} Company C",
                f"D2C {niche} Brand D",
                f"International {niche} Player E"
            ],
            "trends": [
                f"Sustainability in {niche}",
                "Made-in-India movement gaining momentum",
                "Short-form video content driving engagement",
                "Personalization and customization demand",
                "Community-driven brand building"
            ],
            "keyword_clusters": {
                "primary": [f"{niche} online", f"best {niche}", f"{niche} India"],
                "secondary": [f"affordable {niche} for {audience}", f"{niche} reviews"],
                "trending": [f"#{niche.replace(' ', '')}", "#MadeInIndia", "#ShopLocal"]
            },
            "content_opportunities": [
                "Behind-the-scenes content showing authenticity",
                "User-generated content campaigns",
                "Educational content about industry practices"
            ],
            "audience_insights": {
                "pain_points": ["Price sensitivity", "Trust in online brands", "Quality concerns"],
                "preferences": ["Video content", "Relatable influencers", "Quick delivery"],
                "platforms": ["Instagram", "YouTube", "WhatsApp"]
            }
        }
