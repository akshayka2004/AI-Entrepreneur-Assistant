from .base_agent import BaseAgent

class ScoringAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="ScoringAgent")

    def run(self, seo_analysis: dict, brand_tone: str, content: str):
        print(f"[{self.name}] Calculating final content score...")
        
        # Base it largely on SEO for now, but in future could use LLM to check tone match
        seo_score = seo_analysis.get("score", 0)
        
        # Mock brand check
        brand_score = 85 # Assuming it matches for now
        
        # Weighted Average: 70% SEO, 30% Brand
        final_weighted_score = (seo_score * 0.7) + (brand_score * 0.3)
        
        return {
            "final_score": int(final_weighted_score),
            "seo_score": seo_score,
            "brand_score": brand_score
        }
