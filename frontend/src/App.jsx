import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
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
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* App routes */}
            <Route path="/setup" element={<ProjectSetup />} />
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
