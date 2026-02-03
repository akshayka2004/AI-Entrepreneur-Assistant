import React, { useState, useEffect } from 'react';
import api from '../api';
import { Loader2, RefreshCw, TrendingUp, Users, Target, Zap, ArrowRight, BarChart3, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResearchHub = () => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [researchComplete, setResearchComplete] = useState(false);
    const [researchData, setResearchData] = useState(null);
    const projectId = localStorage.getItem('currentProjectId');
    const navigate = useNavigate();

    useEffect(() => {
        if (!projectId) {
            navigate('/');
            return;
        }
        fetchProjectData();
    }, [projectId]);

    // Load existing research on page load
    const loadExistingResearch = async () => {
        try {
            const response = await api.get(`/projects/${projectId}/research`);
            const data = response.data;
            setResearchData({
                competitors: data.competitors || [],
                trends: data.trends || [],
                keywords: data.keyword_clusters?.primary || [],
                summary: data.summary || '',
                audience_insights: data.audience_insights || {}
            });
            setResearchComplete(true);
        } catch (error) {
            // 404 means no research yet - that's okay
            if (error.response?.status !== 404) {
                console.error("Error loading research:", error);
            }
        }
    };

    const fetchProjectData = async () => {
        try {
            const projRes = await api.get(`/projects/${projectId}`);
            setProject(projRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Separate effect to load research after project is loaded
    useEffect(() => {
        if (project && projectId) {
            loadExistingResearch();
        }
    }, [project]);

    const runResearch = async () => {
        setLoading(true);
        try {
            const response = await api.post(`/projects/${projectId}/research`);
            setResearchComplete(true);
            // Use real AI-generated data from API response
            const data = response.data.research_data;
            setResearchData({
                competitors: data.competitors || [],
                trends: data.trends || [],
                keywords: data.keyword_clusters?.primary || [],
                summary: data.summary || '',
                audience_insights: data.audience_insights || {}
            });
        } catch (error) {
            console.error(error);
            alert("Research Failed - Check if backend is running");
        } finally {
            setLoading(false);
        }
    };

    if (!project) {
        return (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 animate-fade-in">
                <div>
                    <p className="text-accent font-medium mb-2 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Market Analysis
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold text-dark-50 mb-2">
                        Research Hub
                    </h1>
                    <p className="text-dark-400">
                        Analyzing <span className="text-accent font-medium">{project.niche}</span> for{' '}
                        <span className="text-accent font-medium">{project.audience}</span>
                    </p>
                </div>

                <button
                    onClick={runResearch}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing Market...
                        </>
                    ) : (
                        <>
                            <Zap className="w-5 h-5" />
                            {researchComplete ? 'Run Again' : 'Start Research'}
                        </>
                    )}
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="glass-card p-12 text-center animate-fade-in">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    </div>
                    <h3 className="text-xl font-semibold text-dark-100 mb-2">AI Agents at Work</h3>
                    <p className="text-dark-400 max-w-md mx-auto">
                        Our MarketResearchAgent is scanning trends, competitors, and keyword opportunities for your niche...
                    </p>
                </div>
            )}

            {/* Results */}
            {researchComplete && !loading && researchData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
                    {/* Competitors */}
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-dark-100">Top Competitors</h3>
                                <p className="text-dark-500 text-sm">In your space</p>
                            </div>
                        </div>
                        <ul className="space-y-3">
                            {researchData.competitors.map((comp, i) => (
                                <li key={i} className="flex items-center gap-3 p-3 rounded-lg bg-dark-800/50">
                                    <span className="w-6 h-6 rounded-full bg-dark-700 flex items-center justify-center text-xs font-medium text-dark-300">
                                        {i + 1}
                                    </span>
                                    <span className="text-dark-200">{comp}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Trends */}
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-dark-100">Trending Topics</h3>
                                <p className="text-dark-500 text-sm">What's hot right now</p>
                            </div>
                        </div>
                        <ul className="space-y-3">
                            {researchData.trends.map((trend, i) => (
                                <li key={i} className="p-3 rounded-lg bg-dark-800/50 border-l-2 border-green-500">
                                    <span className="text-dark-200">{trend}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Keywords */}
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Hash className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-dark-100">Target Keywords</h3>
                                <p className="text-dark-500 text-sm">SEO opportunities</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {researchData.keywords.map((kw, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-300 text-sm">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* CTA */}
            {researchComplete && !loading && (
                <div className="mt-8 flex justify-center animate-slide-up">
                    <button
                        onClick={() => navigate('/calendar')}
                        className="btn-primary flex items-center gap-2"
                    >
                        Generate Content Calendar <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!researchComplete && !loading && (
                <div className="glass-card p-12 text-center animate-fade-in">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-accent-dark/20 flex items-center justify-center">
                        <Target className="w-10 h-10 text-accent" />
                    </div>
                    <h3 className="text-2xl font-semibold text-dark-100 mb-3">Ready to Analyze</h3>
                    <p className="text-dark-400 max-w-md mx-auto mb-6">
                        Click "Start Research" to let our AI agents analyze the market landscape for
                        <span className="text-accent font-medium"> {project.niche}</span>.
                    </p>
                    <p className="text-dark-500 text-sm">
                        This includes competitor analysis, trending topics, and keyword opportunities.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ResearchHub;
