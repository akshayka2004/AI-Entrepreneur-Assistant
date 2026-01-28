# Agentic AI Marketing Platform 🚀

An AI-powered marketing content generation platform with autonomous agents that research, strategize, and create optimized content for your brand.

## ✨ Features

- **Market Research Agent**: Analyzes trends, competitors, and keywords for your niche
- **Content Strategy Agent**: Generates a 14-day content calendar
- **Writer Agent**: Creates platform-specific content (Instagram, LinkedIn, Twitter, Blog)
- **SEO Agent**: Analyzes and scores content for search optimization
- **Feedback Loop**: Automatically improves content until quality threshold is met

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | SQLite |
| AI | OpenAI GPT-3.5-turbo |

## 📦 Quick Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- OpenAI API Key (optional, works with mock data)

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd AI-Entreprenure-Assistant
```

### Step 2: Backend Setup
```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

### Step 3: Configure API Key (Optional)
```bash
# Copy the example file
cp backend/.env.example backend/.env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-key-here
```

> ⚠️ Without an API key, the app uses high-quality mock data for demonstrations.

### Step 4: Frontend Setup
```bash
cd frontend
npm install
cd ..
```

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
python -m uvicorn backend.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Open the App
Navigate to: **http://localhost:5173**

## 🎯 How to Use

1. **Create Project**: Enter your brand's niche, target audience, tone, and goals
2. **Run Research**: Click "Start Research" to analyze market trends
3. **View Calendar**: See your AI-generated 14-day content plan
4. **Auto-Write**: Click on any calendar item to generate AI content
5. **Review Scores**: View SEO, readability, and brand scores for each piece

## 📊 Database Schema

The app uses SQLite with 4 main tables:
- `projects` - Brand/project information
- `research_reports` - Market research data (trends, keywords, competitors)
- `content_calendar` - 14-day content schedule
- `content_versions` - Generated content with quality scores

See [docs/TECHNICAL_DOCS.md](docs/TECHNICAL_DOCS.md) for full schema and DFD diagrams.

## 🔑 Getting an OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up / Log in
3. Add billing (pay-as-you-go, ~$0.002 per 1000 tokens)
4. Create API key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
5. Add to `backend/.env`

## 📁 Project Structure

```
AI-Entreprenure-Assistant/
├── backend/
│   ├── agents/           # AI agent implementations
│   │   ├── market_research_agent.py
│   │   ├── content_strategy_agent.py
│   │   ├── writer_agent.py
│   │   ├── seo_agent.py
│   │   └── scoring_agent.py
│   ├── orchestrator.py   # Agent coordination & feedback loop
│   ├── models.py         # SQLAlchemy database models
│   ├── main.py           # FastAPI application
│   └── db.py             # Database configuration
├── frontend/
│   ├── src/
│   │   ├── pages/        # React page components
│   │   ├── components/   # Reusable components
│   │   └── api.js        # Axios API client
│   └── tailwind.config.js
├── docs/
│   └── TECHNICAL_DOCS.md # Database schema & DFD
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes.

---

Made with ❤️ using AI Agents
