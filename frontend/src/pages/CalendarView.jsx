import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar as CalendarIcon, Loader2, FileEdit, Sparkles, Clock, ArrowRight, CheckCircle2, Twitter, Linkedin, FileText, Instagram, Download, FileDown, LayoutTemplate, X, Plus, Check } from 'lucide-react';
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

// Content Templates with platform suggestions
const contentTemplates = [
    { id: 1, name: 'Product Launch', emoji: '🚀', platform: 'LinkedIn', topics: ['Announcement: Launching our new product!', 'Key features that make us different', 'Behind-the-scenes of our development journey', 'Early customer testimonial and results'] },
    { id: 2, name: 'How-To Guide', emoji: '📚', platform: 'Blog', topics: ['Step-by-step tutorial for beginners', 'Quick tips and tricks for efficiency', 'Common mistakes to avoid', 'Pro tips from industry experts'] },
    { id: 3, name: 'Brand Story', emoji: '✨', platform: 'Instagram', topics: ['Our journey: From idea to reality', 'Meet the team behind the magic', 'Our core values and what we stand for', 'Customer success story spotlight'] },
    { id: 4, name: 'Engagement Boost', emoji: '💬', platform: 'Twitter', topics: ['Poll: What matters most to you?', 'This or That: Help us decide!', 'Caption this photo challenge', 'Unpopular opinion in our industry'] },
    { id: 5, name: 'Educational', emoji: '🎓', platform: 'LinkedIn', topics: ['Industry insights and analysis', 'Myth vs Reality: Common misconceptions', 'Did you know? Surprising facts', 'Trend analysis for 2026'] },
    { id: 6, name: 'Promotional', emoji: '🎁', platform: 'Instagram', topics: ['Limited time offer - Act now!', 'Exclusive discount for our community', 'Bundle deal announcement', 'Flash sale: 24 hours only'] },
];

const CalendarView = () => {
    const [calendar, setCalendar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generatingId, setGeneratingId] = useState(null);
    const [showTemplates, setShowTemplates] = useState(false);
    const [applyingTemplate, setApplyingTemplate] = useState(null);
    const [appliedTemplates, setAppliedTemplates] = useState([]);
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

    // Apply template - add topics to calendar
    const applyTemplate = async (template) => {
        setApplyingTemplate(template.id);
        try {
            await api.post(`/projects/${projectId}/apply-template`, {
                topics: template.topics,
                platform: template.platform
            });

            // Mark as applied
            setAppliedTemplates([...appliedTemplates, template.id]);

            // Refresh calendar
            await fetchCalendar();

            // Show success feedback briefly then close
            setTimeout(() => {
                setShowTemplates(false);
            }, 1500);
        } catch (error) {
            console.error("Failed to apply template", error);
            alert("Failed to apply template. Please try again.");
        } finally {
            setApplyingTemplate(null);
        }
    };

    // Export as CSV
    const exportCSV = () => {
        const headers = ['Day', 'Date', 'Platform', 'Content Type', 'Topic'];
        const rows = calendar.map((item, index) => [
            index + 1,
            item.date,
            item.platform,
            item.content_type,
            `"${item.topic.replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `content-calendar-${projectId}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Export as printable PDF
    const exportPDF = () => {
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Content Calendar</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
                    h1 { color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px; }
                    .day { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
                    .date { font-size: 12px; color: #6b7280; margin-bottom: 5px; }
                    .platform { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-right: 8px; }
                    .Twitter { background: #dbeafe; color: #1d4ed8; }
                    .LinkedIn { background: #dbeafe; color: #1d4ed8; }
                    .Instagram { background: #fce7f3; color: #be185d; }
                    .Blog { background: #d1fae5; color: #065f46; }
                    .topic { font-weight: 500; margin-top: 8px; }
                    .type { font-size: 12px; color: #9ca3af; }
                </style>
            </head>
            <body>
                <h1>📅 Content Calendar</h1>
                <p>Generated on ${new Date().toLocaleDateString('en-IN')}</p>
                ${calendar.map((item, i) => `
                    <div class="day">
                        <div class="date">Day ${i + 1} - ${new Date(item.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                        <span class="platform ${item.platform}">${item.platform}</span>
                        <span class="type">${item.content_type}</span>
                        <div class="topic">${item.topic}</div>
                    </div>
                `).join('')}
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                        <p className="text-accent font-medium mb-2 flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" /> Content Strategy
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-dark-50">
                            Content Calendar
                        </h1>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={() => setShowTemplates(true)}
                            className="btn-primary py-2 px-4 flex items-center gap-2 text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Template
                        </button>
                        {calendar.length > 0 && (
                            <>
                                <button
                                    onClick={exportCSV}
                                    className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm"
                                >
                                    <FileDown className="w-4 h-4" />
                                    CSV
                                </button>
                                <button
                                    onClick={exportPDF}
                                    className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    PDF
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <p className="text-dark-400">
                    AI-generated content schedule optimized for engagement
                </p>
            </div>

            {/* Templates Modal */}
            {showTemplates && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="glass-card max-w-2xl w-full max-h-[80vh] overflow-auto">
                        <div className="p-6 border-b border-dark-700 flex items-center justify-between sticky top-0 bg-dark-900/95 backdrop-blur">
                            <h2 className="text-xl font-semibold text-dark-100 flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-accent" />
                                Add Content Template
                            </h2>
                            <button
                                onClick={() => setShowTemplates(false)}
                                className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-dark-400" />
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {contentTemplates.map((template) => {
                                const isApplied = appliedTemplates.includes(template.id);
                                const isApplying = applyingTemplate === template.id;

                                return (
                                    <div key={template.id} className={`p-4 bg-dark-800/50 rounded-xl border transition-colors ${isApplied ? 'border-green-500/50' : 'border-dark-700 hover:border-accent/50'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{template.emoji}</span>
                                                <div>
                                                    <h3 className="font-semibold text-dark-100">{template.name}</h3>
                                                    <span className="text-xs text-dark-500">{template.platform}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => applyTemplate(template)}
                                                disabled={isApplying || isApplied}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${isApplied
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-accent/20 text-accent hover:bg-accent/30'
                                                    }`}
                                            >
                                                {isApplying ? (
                                                    <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                                                ) : isApplied ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        Added
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-4 h-4" />
                                                        Apply
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <ul className="space-y-1">
                                            {template.topics.map((topic, i) => (
                                                <li key={i} className="text-sm text-dark-400 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                                                    {topic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-4 border-t border-dark-700 text-center text-sm text-dark-500">
                            💡 Click Apply to add template topics to your calendar!
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {calendar.length === 0 && (
                <div className="glass-card p-12 text-center animate-fade-in">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-accent-dark/20 flex items-center justify-center">
                        <CalendarIcon className="w-10 h-10 text-accent" />
                    </div>
                    <h3 className="text-2xl font-semibold text-dark-100 mb-3">No Calendar Yet</h3>
                    <p className="text-dark-400 max-w-md mx-auto mb-6">
                        Run Market Research to generate your calendar, or add content using templates.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate('/research')}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            Go to Research <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setShowTemplates(true)}
                            className="btn-secondary inline-flex items-center gap-2"
                        >
                            <LayoutTemplate className="w-4 h-4" />
                            Use Templates
                        </button>
                    </div>
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
