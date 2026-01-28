from .base_agent import BaseAgent
import textstat
import re

class SEOAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="SEOAgent")

    def run(self, content: str, target_keywords: list = None):
        print(f"[{self.name}] Analyzing SEO and Readability...")
        
        # 1. Readability Score (Flesch Reading Ease)
        # 90-100 : Very Easy
        # 60-70 : Standard
        # 0-30 : Very Confusing
        try:
            readability = textstat.flesch_reading_ease(content)
        except:
            readability = 50 # Fallback
            
        # 2. Keyword Density
        keyword_score = 0
        feedback = []
        
        if target_keywords:
            found_count = 0
            for kw in target_keywords:
                # Simple case-insensitive match
                count = len(re.findall(re.escape(kw), content, re.IGNORECASE))
                if count > 0:
                    found_count += 1
                else:
                    feedback.append(f"Missing keyword: {kw}")
            
            if len(target_keywords) > 0:
                keyword_score = (found_count / len(target_keywords)) * 100
        else:
            keyword_score = 80 # Default if no keywords provided
            
        # Composite SEO Score
        # Weight: 40% Readability, 60% Keyword Presence
        # We normalize readability (aiming for 60+) to a 0-100 scale approximately
        
        normalized_readability = min(100, max(0, readability))
        final_score = (normalized_readability * 0.4) + (keyword_score * 0.6)
        
        analysis = {
            "score": int(final_score),
            "readability": readability,
            "keyword_score": keyword_score,
            "feedback": feedback
        }
        
        print(f"[{self.name}] Score: {analysis['score']}. Feedback: {analysis['feedback']}")
        return analysis
