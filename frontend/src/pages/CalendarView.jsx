import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar as CalendarIcon, Loader2, FileEdit, Sparkles, Clock, ArrowRight, CheckCircle2, Twitter, Linkedin, FileText, Instagram } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const platformIcons = {
    'Twitter': Twitter,
    'LinkedIn': Linkedin,
    'Blog': FileText,
    'Instagram': Instagram,
};

const platformColors = {
    'Twitter': 'bg-sky-500/10 text-sky-400',
    'LinkedIn': 'bg-blue-500/10 text-blue-400',
    'Blog': 'bg-green-500/10 text-green-400',
    'Instagram': 'bg-pink-500/10 text-pink-400',
};

const CalendarView = () => {
    const [calendar, setCalendar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generatingId, setGeneratingId] = useState(null);
    const projectId = localStorage.getItem('currentProjectId');
    const navigate = useNavigate();

    useEffect(() => {
        if (projectId) {
            fetchCalendar();
        }
    }, [projectId]);

    const fetchCalendar = async () => {
        try {
            const res = await api.get(`/projects/${projectId}/calendar`);
            setCalendar(res.data);
        } catch (error) {
            console.error("Failed to fetch calendar", error);
        } finally {
            setLoading(false);
        }
    };

    const generateContent = async (item) => {
        setGeneratingId(item.id);
        try {
            await api.post(`/generate/${item.id}`);
            navigate(`/editor/${item.id}`);
        } catch (error) {
            console.error(error);
            alert("Generation failed. Check backend.");
        } finally {
            setGeneratingId(null);
        }
    };

    // Group by date
    const groupedCalendar = calendar.reduce((acc, item) => {
        if (!acc[item.date]) acc[item.date] = [];
        acc[item.date].push(item);
        return acc;
    }, {});

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            {/* Header */}
            <div className="mb-10 animate-fade-in">
                <p className="text-accent font-medium mb-2 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" /> Content Strategy
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-dark-50 mb-2">
                    14-Day Content Calendar
                </h1>
                <p className="text-dark-400">
                    AI-generated content schedule optimized for engagement
                </p>
            </div>

            {/* Empty State */}
            {calendar.length === 0 && (
                <div className="glass-card p-12 text-center animate-fade-in">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-accent-dark/20 flex items-center justify-center">
                        <CalendarIcon className="w-10 h-10 text-accent" />
                    </div>
                    <h3 className="text-2xl font-semibold text-dark-100 mb-3">No Calendar Yet</h3>
                    <p className="text-dark-400 max-w-md mx-auto mb-6">
                        Run the Market Research first to generate your content calendar.
                    </p>
                    <button
                        onClick={() => navigate('/research')}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        Go to Research <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Calendar Timeline */}
            {calendar.length > 0 && (
                <div className="space-y-8 animate-slide-up">
                    {Object.entries(groupedCalendar).map(([date, items]) => (
                        <div key={date} className="relative">
                            {/* Date Header */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-700">
                                    <Clock className="w-4 h-4 text-accent" />
                                    <span className="text-sm font-medium text-dark-200">{formatDate(date)}</span>
                                </div>
                                <div className="flex-1 h-px bg-dark-800" />
                            </div>

                            {/* Posts */}
                            <div className="space-y-4 pl-4 border-l-2 border-dark-800 ml-4">
                                {items.map((item) => {
                                    const PlatformIcon = platformIcons[item.platform] || FileText;
                                    const colorClass = platformColors[item.platform] || 'bg-dark-700 text-dark-300';

                                    return (
                                        <div key={item.id} className="glass-card p-5 ml-4 relative group">
                                            {/* Connector dot */}
                                            <div className="absolute -left-[1.65rem] top-6 w-3 h-3 rounded-full bg-dark-700 border-2 border-dark-900" />

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    {/* Platform Badge */}
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                                                            <PlatformIcon className="w-3.5 h-3.5" />
                                                            {item.platform}
                                                        </span>
                                                        <span className="text-xs text-dark-500 px-2 py-1 rounded-full bg-dark-800">
                                                            {item.content_type}
                                                        </span>
                                                    </div>

                                                    {/* Topic */}
                                                    <p className="text-dark-100 font-medium leading-relaxed">
                                                        {item.topic}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => generateContent(item)}
                                                        disabled={generatingId === item.id}
                                                        className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                                                    >
                                                        {generatingId === item.id ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                Generating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Sparkles className="w-4 h-4" />
                                                                Auto-Write
                                                            </>
                                                        )}
                                                    </button>
                                                    <Link
                                                        to={`/editor/${item.id}`}
                                                        className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
                                                    >
                                                        <FileEdit className="w-4 h-4" />
                                                        Editor
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CalendarView;
