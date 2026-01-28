import os
from dotenv import load_dotenv
from openai import OpenAI
from .base_agent import BaseAgent
import time

load_dotenv()

class WriterAgent(BaseAgent):
    """
    Writer Agent that generates high-quality marketing content
    using AI with support for different tones and platforms.
    """
    
    def __init__(self):
        super().__init__(name="WriterAgent")
        api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=api_key) if api_key else None

    def run(self, topic: str, tone: str, platform: str = "Blog", feedback: str = None, research_context: dict = None):
        print(f"[{self.name}] Writing content for topic: '{topic}'")
        print(f"[{self.name}] Tone: {tone}, Platform: {platform}")
        if feedback:
            print(f"[{self.name}] Incorporating feedback: {feedback[:100]}...")

        if self.client:
            return self._ai_write(topic, tone, platform, feedback, research_context)
        else:
            return self._mock_write(topic, tone, feedback)
    
    def _ai_write(self, topic: str, tone: str, platform: str, feedback: str, research_context: dict) -> str:
        """Use OpenAI to generate realistic marketing content."""
        try:
            # Build context from research if available
            context_info = ""
            if research_context:
                keywords = research_context.get("keyword_clusters", {}).get("primary", [])
                if keywords:
                    context_info = f"\n\nIncorporate these keywords naturally: {', '.join(keywords[:3])}"
            
            # Platform-specific instructions
            platform_guides = {
                "Blog": "Write a detailed blog post (400-600 words) with clear headings, bullet points, and a strong call-to-action.",
                "Twitter": "Write a punchy tweet thread (5-7 tweets) with engaging hooks and relevant hashtags.",
                "LinkedIn": "Write a professional LinkedIn post (200-300 words) that provides value and encourages discussion.",
                "Instagram": "Write an Instagram caption (150-200 words) with emojis, a hook, and relevant hashtags at the end."
            }
            
            platform_guide = platform_guides.get(platform, platform_guides["Blog"])
            
            # Build the prompt
            feedback_instruction = ""
            if feedback:
                feedback_instruction = f"\n\nIMPORTANT - Previous version had these issues to fix:\n{feedback}"
            
            prompt = f"""You are a professional content writer for Indian brands. Write engaging marketing content.

TOPIC: {topic}
TONE: {tone}
PLATFORM: {platform}

{platform_guide}
{context_info}
{feedback_instruction}

Guidelines:
- Write in a {tone.lower()} tone that resonates with Indian audiences
- Use culturally relevant examples and references
- Include a compelling hook at the beginning
- Add a clear call-to-action at the end
- Make it shareable and engaging

Write the complete content now:"""

            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": f"You are an expert {platform} content writer with deep understanding of Indian digital marketing. Write in a {tone} tone."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=1500
            )
            
            content = response.choices[0].message.content
            print(f"[{self.name}] AI content generation completed ({len(content)} chars)")
            return content
            
        except Exception as e:
            print(f"[{self.name}] AI writing failed: {e}, falling back to mock")
            return self._mock_write(topic, tone, feedback)
    
    def _mock_write(self, topic: str, tone: str, feedback: str = None) -> str:
        """Fallback mock content when API is unavailable."""
        time.sleep(0.5)  # Simulate processing
        
        content = f"""# {topic}

## Introduction
In today's fast-paced digital world, {topic.lower()} has become more important than ever. Whether you're a startup founder in Bangalore or a small business owner in Jaipur, understanding this topic can transform your marketing game.

## Why This Matters
The Indian market is unique. With over 700 million internet users and growing, the opportunity is massive. Here's what you need to know:

### Key Insight 1: Understanding Your Audience
Your target audience is looking for authenticity. They can spot generic content from a mile away. Focus on:
- **Relatable stories** that connect emotionally
- **Local references** that show you understand their world
- **Value-first content** that educates before it sells

### Key Insight 2: Timing is Everything
According to recent studies, Indian users are most active:
- Morning: 7-9 AM (commute time)
- Lunch: 12-2 PM (break time)
- Evening: 8-11 PM (relaxation time)

### Key Insight 3: Platform Matters
Not all platforms are created equal. Choose wisely based on your audience demographics and content type.

## Action Steps
1. Start by understanding your audience deeply
2. Create a content calendar (consistency is key!)
3. Measure, learn, and iterate

## Conclusion
The journey of a thousand miles begins with a single step. Start implementing these strategies today, and watch your engagement soar! 🚀

---
*Ready to transform your marketing? Drop a comment below or reach out to learn more!*
"""
        
        if feedback and "keyword" in feedback.lower():
            content += "\n\n**Bonus Tip:** Remember to naturally incorporate your target keywords throughout your content for better SEO performance!"
            
        return content
