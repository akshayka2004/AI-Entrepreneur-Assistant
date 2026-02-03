"""
Writer Agent

Generates high-quality marketing content using the unified AI client
with support for different tones and platforms.
Optimized for high SEO, readability, and brand alignment scores.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from .base_agent import BaseAgent
from .ai_client import get_ai_client
import time

# Load .env from the backend directory
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(env_path)


class WriterAgent(BaseAgent):
    """
    Writer Agent that generates high-quality marketing content
    using AI with support for different tones and platforms.
    Optimized prompts for maximum SEO and readability scores.
    """
    
    def __init__(self):
        super().__init__(name="WriterAgent")
        self.ai_client = get_ai_client()

    def run(self, topic: str, tone: str, platform: str = "Blog", feedback: str = None, 
            research_context: dict = None, previous_version: dict = None):
        print(f"[{self.name}] Writing content for topic: '{topic}'")
        print(f"[{self.name}] Tone: {tone}, Platform: {platform}")
        if feedback:
            print(f"[{self.name}] Incorporating feedback: {feedback[:100]}...")
        if previous_version:
            print(f"[{self.name}] Improving on previous version (score: {previous_version.get('score', 'N/A')})")

        if self.ai_client.providers:
            result = self._ai_write(topic, tone, platform, feedback, research_context, previous_version)
            if result:
                return result
        
        print(f"[{self.name}] Using mock content...")
        return self._mock_write(topic, tone, feedback)
    
    def _ai_write(self, topic: str, tone: str, platform: str, feedback: str, 
                  research_context: dict, previous_version: dict = None) -> str:
        """Use AI to generate highly optimized marketing content."""
        
        # Build keyword context from research
        keywords_section = ""
        keyword_list = []
        if research_context:
            keywords = research_context.get("keyword_clusters", {}).get("primary", [])
            if keywords:
                keyword_list = keywords[:5]
                keywords_section = f"""
CRITICAL - MANDATORY KEYWORDS (Must appear naturally 2-3 times each):
{chr(10).join([f'• {kw}' for kw in keyword_list])}

These keywords MUST be woven naturally into your content. Your score depends on it!"""
        
        # Platform-specific optimized instructions
        platform_guides = {
            "Blog": """Write a highly readable blog post (400-600 words) with:
- Short paragraphs (2-3 sentences max)
- Clear, simple language (avoid jargon)
- Bullet points and numbered lists
- H2 and H3 headings for structure
- Strong opening hook
- Actionable call-to-action at the end
- Use active voice, not passive""",
            "Twitter": """Write a viral tweet thread (5-7 tweets) with:
- Punchy, short sentences
- Emojis for visual appeal 🚀
- Each tweet under 250 characters
- A hook in the first tweet
- Relevant hashtags in the last tweet
- Clear call-to-action""",
            "LinkedIn": """Write an engaging LinkedIn post (200-300 words) with:
- Strong opening line (hook the reader)
- Use line breaks for readability
- Include a personal story or insight
- Bullet points for key takeaways
- Question at the end to drive comments
- Professional but conversational tone""",
            "Instagram": """Write a captivating Instagram caption (150-200 words) with:
- Attention-grabbing first line
- Emojis throughout 🔥✨💡
- Line breaks for readability
- Story-driven content
- Call-to-action (save, share, comment)
- 5-10 relevant hashtags at the very end"""
        }
        
        platform_guide = platform_guides.get(platform, platform_guides["Blog"])
        
        # Build improvement context if regenerating
        improvement_section = ""
        if previous_version:
            prev_score = previous_version.get("score", 0)
            prev_readability = previous_version.get("readability", 50)
            improvement_section = f"""
⚠️ REGENERATION REQUEST - You must IMPROVE on the previous version!

PREVIOUS VERSION ANALYSIS:
- SEO Score: {prev_score}/100 (Target: 85+)
- Readability: {prev_readability}/100 (Target: 70+)
- Issues: {previous_version.get('feedback', 'General quality improvements needed')}

IMPROVEMENT INSTRUCTIONS:
1. Use SHORTER sentences (aim for 15-20 words per sentence)
2. Use SIMPLER words (8th grade reading level)
3. Add MORE keywords naturally (target: 2-3 mentions each)
4. Use MORE bullet points and lists
5. Break up long paragraphs
6. Use active voice throughout
7. The new content MUST score higher than {prev_score}!
"""
        
        # Build the feedback instruction
        feedback_instruction = ""
        if feedback:
            feedback_instruction = f"""
CRITICAL FEEDBACK TO ADDRESS:
{feedback}

You MUST fix all these issues in your new version!"""
        
        # Main prompt optimized for high scores
        prompt = f"""You are an expert content writer creating HIGHLY OPTIMIZED content for maximum engagement and SEO.

TODAY'S DATE: February 2026

TOPIC: {topic}
TONE: {tone}
PLATFORM: {platform}
{keywords_section}
{improvement_section}
{feedback_instruction}

CONTENT REQUIREMENTS:
{platform_guide}

READABILITY OPTIMIZATION (CRITICAL FOR HIGH SCORES):
1. Use simple, everyday words (avoid complex vocabulary)
2. Keep sentences short (15-20 words max)
3. Use contractions (don't, won't, can't) for natural flow
4. Write at an 8th-grade reading level
5. Use active voice ("We help you" not "You will be helped")
6. Break text into small paragraphs (2-3 sentences)
7. Use transition words (First, Next, Also, Finally)

SEO OPTIMIZATION (CRITICAL FOR HIGH SCORES):
1. Include the main keywords 2-3 times naturally
2. Use keywords in headings if writing a blog
3. Front-load important keywords in the first paragraph
4. Use related terms and synonyms
5. Include numbers and statistics when possible

ENGAGEMENT OPTIMIZATION:
1. Start with a powerful hook (question, statistic, or bold statement)
2. Use relatable examples for Indian audience
3. Reference current trends (2025-2026)
4. End with a clear actionable CTA
5. Make it shareable and valuable

Write the complete, optimized content now. Remember: SIMPLE LANGUAGE + KEYWORDS = HIGH SCORES!"""

        system_prompt = f"""You are a world-class {platform} content strategist with expertise in SEO optimization and readability. 
Your content consistently scores 85+ on SEO and readability metrics.
Write in a {tone} tone. Create content that is:
- Easy to read (short sentences, simple words)
- Keyword-rich (naturally incorporating target keywords)
- Highly engaging (hooks, stories, CTAs)
- Culturally relevant for Indian audiences"""

        result = self.ai_client.generate(prompt, system_prompt, temperature=0.7, max_tokens=1500)
        
        if result:
            print(f"[{self.name}] AI content generation completed ({len(result)} chars)")
            return result
        
        return None
    
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
