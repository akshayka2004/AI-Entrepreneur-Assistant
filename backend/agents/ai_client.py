"""
Unified AI Client with Multi-Provider Support

Supports multiple AI providers with automatic fallback:
1. Google Gemini (FREE tier)
2. Groq (FREE tier - very fast)
3. Cohere (FREE trial tier)
4. OpenAI GPT (paid)
5. Anthropic Claude (paid)

Falls back to next provider if one fails.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
import json

# Load .env from the backend directory
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(env_path)


class AIClient:
    """
    Unified AI client that tries multiple providers with fallback.
    Priority: Gemini -> Groq -> Cohere -> OpenAI -> Anthropic -> Mock
    """
    
    def __init__(self):
        self.providers = []
        self._init_providers()
        
    def _init_providers(self):
        """Initialize available AI providers based on API keys."""
        
        # 1. Google Gemini (FREE tier available)
        gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if gemini_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=gemini_key)
                self.providers.append({
                    "name": "Gemini",
                    "client": genai,
                    "generate": self._gemini_generate
                })
                print("[AIClient] ✓ Gemini API configured")
            except ImportError:
                print("[AIClient] ✗ Gemini SDK not installed (pip install google-generativeai)")
        
        # 2. Groq (FREE tier - super fast)
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key:
            try:
                from groq import Groq
                client = Groq(api_key=groq_key)
                self.providers.append({
                    "name": "Groq",
                    "client": client,
                    "generate": self._groq_generate
                })
                print("[AIClient] ✓ Groq API configured")
            except ImportError:
                print("[AIClient] ✗ Groq SDK not installed (pip install groq)")
        
        # 3. Cohere (FREE trial tier)
        cohere_key = os.getenv("COHERE_API_KEY")
        if cohere_key:
            try:
                import cohere
                client = cohere.Client(api_key=cohere_key)
                self.providers.append({
                    "name": "Cohere",
                    "client": client,
                    "generate": self._cohere_generate
                })
                print("[AIClient] ✓ Cohere API configured")
            except ImportError:
                print("[AIClient] ✗ Cohere SDK not installed (pip install cohere)")
        
        # 4. OpenAI (paid)
        openai_key = os.getenv("OPENAI_API_KEY")
        if openai_key:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=openai_key)
                self.providers.append({
                    "name": "OpenAI",
                    "client": client,
                    "generate": self._openai_generate
                })
                print("[AIClient] ✓ OpenAI API configured")
            except ImportError:
                print("[AIClient] ✗ OpenAI SDK not installed")
        
        # 5. Anthropic Claude (paid)
        anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        if anthropic_key:
            try:
                import anthropic
                client = anthropic.Anthropic(api_key=anthropic_key)
                self.providers.append({
                    "name": "Anthropic",
                    "client": client,
                    "generate": self._anthropic_generate
                })
                print("[AIClient] ✓ Anthropic API configured")
            except ImportError:
                print("[AIClient] ✗ Anthropic SDK not installed")
        
        if not self.providers:
            print("[AIClient] ⚠ No AI providers configured! Add API keys to .env")
    
    def generate(self, prompt: str, system_prompt: str = None, temperature: float = 0.7, max_tokens: int = 2000) -> str:
        """
        Generate text using available AI providers with automatic fallback.
        """
        for provider in self.providers:
            try:
                print(f"[AIClient] Trying {provider['name']}...")
                result = provider["generate"](
                    provider["client"],
                    prompt,
                    system_prompt,
                    temperature,
                    max_tokens
                )
                print(f"[AIClient] ✓ {provider['name']} succeeded")
                return result
            except Exception as e:
                print(f"[AIClient] ✗ {provider['name']} failed: {e}")
                continue
        
        print("[AIClient] ⚠ All providers failed!")
        return None
    
    def generate_json(self, prompt: str, system_prompt: str = None, temperature: float = 0.7, max_tokens: int = 2000) -> dict:
        """Generate and parse JSON response."""
        json_prompt = prompt + "\n\nIMPORTANT: Return ONLY valid JSON, no markdown or explanation."
        json_system = (system_prompt or "") + " Always respond with valid JSON only."
        
        result = self.generate(json_prompt, json_system, temperature, max_tokens)
        if result:
            try:
                # Clean up markdown if present
                cleaned = result.strip()
                if cleaned.startswith("```json"):
                    cleaned = cleaned[7:]
                if cleaned.startswith("```"):
                    cleaned = cleaned[3:]
                if cleaned.endswith("```"):
                    cleaned = cleaned[:-3]
                return json.loads(cleaned.strip())
            except json.JSONDecodeError as e:
                print(f"[AIClient] JSON parse error: {e}")
                print(f"[AIClient] Raw response: {result[:200]}...")
        return None
    
    def _gemini_generate(self, client, prompt: str, system_prompt: str, temperature: float, max_tokens: int) -> str:
        """Generate using Google Gemini."""
        model = client.GenerativeModel(
            'gemini-1.5-flash',
            system_instruction=system_prompt if system_prompt else None
        )
        
        generation_config = {
            "temperature": temperature,
            "max_output_tokens": max_tokens,
        }
        
        response = model.generate_content(prompt, generation_config=generation_config)
        return response.text
    
    def _groq_generate(self, client, prompt: str, system_prompt: str, temperature: float, max_tokens: int) -> str:
        """Generate using Groq (Llama/Mixtral - super fast)."""
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Current free model (3.1 is decommissioned)
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content
    
    def _cohere_generate(self, client, prompt: str, system_prompt: str, temperature: float, max_tokens: int) -> str:
        """Generate using Cohere."""
        full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
        
        response = client.generate(
            model="command",
            prompt=full_prompt,
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.generations[0].text
    
    def _openai_generate(self, client, prompt: str, system_prompt: str, temperature: float, max_tokens: int) -> str:
        """Generate using OpenAI."""
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content
    
    def _anthropic_generate(self, client, prompt: str, system_prompt: str, temperature: float, max_tokens: int) -> str:
        """Generate using Anthropic Claude."""
        message = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=max_tokens,
            system=system_prompt if system_prompt else "You are a helpful assistant.",
            messages=[{"role": "user", "content": prompt}]
        )
        return message.content[0].text


# Singleton instance
_ai_client = None

def get_ai_client() -> AIClient:
    """Get the singleton AI client instance."""
    global _ai_client
    if _ai_client is None:
        _ai_client = AIClient()
    return _ai_client
