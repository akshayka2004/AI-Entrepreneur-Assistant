# Agentic AI Marketing Platform - Technical Documentation

## Database Schema (Entity-Relationship Diagram)

```mermaid
erDiagram
    PROJECT ||--o{ RESEARCH_REPORT : has
    PROJECT ||--o{ CONTENT_CALENDAR : has
    CONTENT_CALENDAR ||--o{ CONTENT_VERSION : has

    PROJECT {
        int id PK
        string niche
        string audience
        string tone
        string goals
    }

    RESEARCH_REPORT {
        int id PK
        int project_id FK
        text summary
        json keyword_clusters
        json competitors
    }

    CONTENT_CALENDAR {
        int id PK
        int project_id FK
        string platform
        string date
        string content_type
        string topic
    }

    CONTENT_VERSION {
        int id PK
        int calendar_id FK
        string title
        text body
        int seo_score
        int readability_score
        int brand_score
        int version_number
    }
```

---

## Table Descriptions

| Table | Description |
|-------|-------------|
| **projects** | Stores brand/project information including niche, target audience, tone, and goals |
| **research_reports** | Stores AI-generated market research including summary, keywords, and competitor analysis |
| **content_calendar** | 14-day content schedule with platform, date, content type, and topic |
| **content_versions** | Generated content drafts with SEO, readability, and brand scores |

---

## Data Flow Diagram (DFD) - Level 0 (Context)

```mermaid
flowchart LR
    User((User)) --> |Project Details| System[Agentic AI Marketing Platform]
    System --> |Content + Reports| User
    System <--> |API Calls| OpenAI[(OpenAI API)]
    System <--> |Store/Retrieve| DB[(SQLite DB)]
```

---

## Data Flow Diagram (DFD) - Level 1

```mermaid
flowchart TB
    subgraph External
        User((User))
        OpenAI[(OpenAI API)]
        DB[(SQLite Database)]
    end

    subgraph "1.0 Project Management"
        P1[1.1 Create Project]
        P2[1.2 Store Project]
    end

    subgraph "2.0 Market Research"
        R1[2.1 Analyze Niche]
        R2[2.2 Generate Keywords]
        R3[2.3 Identify Competitors]
    end

    subgraph "3.0 Content Strategy"
        S1[3.1 Generate Calendar]
        S2[3.2 Schedule Posts]
    end

    subgraph "4.0 Content Generation"
        C1[4.1 Draft Content]
        C2[4.2 SEO Analysis]
        C3[4.3 Feedback Loop]
        C4[4.4 Final Scoring]
    end

    User -->|Niche, Audience, Tone| P1
    P1 --> P2
    P2 -->|Project Data| DB

    P2 --> R1
    R1 <-->|AI Research| OpenAI
    R1 --> R2
    R2 --> R3
    R3 -->|Research Report| DB

    R3 --> S1
    S1 <-->|AI Calendar| OpenAI
    S1 --> S2
    S2 -->|Calendar Items| DB

    S2 --> C1
    C1 <-->|AI Writing| OpenAI
    C1 --> C2
    C2 -->|Score < 70| C3
    C3 --> C1
    C2 -->|Score >= 70| C4
    C4 -->|Content Version| DB
    C4 -->|Generated Content| User
```

---

## Agent Workflow Diagram

```mermaid
flowchart LR
    subgraph Orchestrator
        direction TB
        O[Orchestrator]
    end

    subgraph Agents
        MR[MarketResearchAgent]
        CS[ContentStrategyAgent]
        WR[WriterAgent]
        SEO[SEOAgent]
        SC[ScoringAgent]
    end

    O --> MR
    MR --> CS
    CS --> WR
    WR --> SEO
    SEO -->|Score <= 70| WR
    SEO -->|Score > 70| SC
    SC --> O
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/projects/` | Create new project |
| GET | `/projects/{id}` | Get project details |
| POST | `/projects/{id}/research` | Run market research |
| GET | `/projects/{id}/calendar` | Get content calendar |
| POST | `/generate/{calendar_id}` | Generate content with AI |
| GET | `/content/{calendar_id}/versions` | Get content versions |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | SQLite with SQLAlchemy ORM |
| AI | OpenAI GPT-3.5-turbo |
| SEO Analysis | textstat library |
