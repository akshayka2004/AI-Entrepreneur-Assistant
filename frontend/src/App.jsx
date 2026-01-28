import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProjectSetup from './pages/ProjectSetup';
import ResearchHub from './pages/ResearchHub';
import CalendarView from './pages/CalendarView';
import ContentEditor from './pages/ContentEditor';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-950">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<ProjectSetup />} />
            <Route path="/research" element={<ResearchHub />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/editor/:calendarId" element={<ContentEditor />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
