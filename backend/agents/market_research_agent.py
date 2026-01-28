import os
from dotenv import load_dotenv
from openai import OpenAI
from .base_agent import BaseAgent

load_dotenv()

class MarketResearchAgent(BaseAgent):
    """
    Market Research Agent that analyzes trends, competitors, and keywords
    for a given niche and target audience using AI.
    """
    
    def __init__(self):
        super().__init__(name="MarketResearchAgent")
        api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=api_key) if api_key else None

    def run(self, niche: str, audience: str):
        print(f"[{self.name}] Researching niche: {niche} for audience: {audience}")
        
        if self.client:
            return self._ai_research(niche, audience)
        else:
            return self._mock_research(niche, audience)
    
    def _ai_research(self, niche: str, audience: str) -> dict:
        """Use OpenAI to generate realistic market research."""
        try:
            prompt = f"""You are a market research analyst specializing in digital marketing for Indian brands.

Analyze the following:
- Niche/Industry: {niche}
- Target Audience: {audience}

Provide a comprehensive market research report in the following JSON format:
{{
    "summary": "A 2-3 sentence executive summary of the market opportunity",
    "competitors": ["List of 5 real competitors in this space in India"],
    "trends": ["List of 5 current market trends relevant to this niche"],
    "keyword_clusters": {{
        "primary": ["5 high-volume primary keywords"],
        "secondary": ["5 long-tail secondary keywords"],
        "trending": ["3 trending hashtags or phrases"]
    }},
    "content_opportunities": ["3 content gaps or opportunities to explore"],
    "audience_insights": {{
        "pain_points": ["3 key pain points of the target audience"],
        "preferences": ["3 content preferences"],
        "platforms": ["Top 3 social platforms for this audience"]
    }}
}}

Return ONLY valid JSON, no markdown formatting."""

            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a market research expert. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            print(f"[{self.name}] AI research completed successfully")
            return result
            
        except Exception as e:
            print(f"[{self.name}] AI research failed: {e}, falling back to mock")
            return self._mock_research(niche, audience)
    
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
