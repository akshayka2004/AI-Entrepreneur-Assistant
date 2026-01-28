import React, { useState, useEffect } from 'react';
import api from '../api';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, BarChart3, Type, Heart, RefreshCw, Copy, Check } from 'lucide-react';

const ContentEditor = () => {
    const { calendarId } = useParams();
    const [versions, setVersions] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchVersions();
    }, [calendarId]);

    const fetchVersions = async () => {
        try {
            const res = await api.get(`/content/${calendarId}/versions`);
            setVersions(res.data);
            if (res.data.length > 0) {
                setSelectedVersion(res.data[res.data.length - 1]);
            }
        } catch (error) {
            console.error("Failed to fetch versions", error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(selectedVersion.body);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBarColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    if (!versions.length) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6">
                <Link to="/calendar" className="text-accent hover:text-accent-light flex items-center gap-2 mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Calendar
                </Link>
                <div className="glass-card p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-dark-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-dark-100 mb-2">No Content Yet</h3>
                    <p className="text-dark-400">Go back to the Calendar and click "Auto-Write" to generate content.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            {/* Back Button */}
            <Link to="/calendar" className="inline-flex items-center gap-2 text-accent hover:text-accent-light mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Calendar
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                {/* Main Content Preview */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-dark-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-dark-50">
                                    {selectedVersion.title || "Generated Content"}
                                </h3>
                                <p className="text-dark-500 text-sm">Version {selectedVersion.version_number}</p>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-green-400" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-dark-200 leading-relaxed">
                                {selectedVersion.body}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Scores */}
                <div className="space-y-6">
                    {/* Quality Scores */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-dark-100 mb-6 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-accent" />
                            Quality Analysis
                        </h3>

                        <div className="space-y-6">
                            {/* SEO Score */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-dark-400 text-sm font-medium">SEO Score</span>
                                    <span className={`text-lg font-bold ${getScoreColor(selectedVersion.seo_score)}`}>
                                        {selectedVersion.seo_score}
                                    </span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className={`progress-fill ${getScoreBarColor(selectedVersion.seo_score)}`}
                                        style={{ width: `${selectedVersion.seo_score}%` }}
                                    />
                                </div>
                            </div>

                            {/* Readability */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-dark-400 text-sm font-medium flex items-center gap-1.5">
                                        <Type className="w-4 h-4" /> Readability
                                    </span>
                                    <span className={`text-lg font-bold ${getScoreColor(selectedVersion.readability_score)}`}>
                                        {selectedVersion.readability_score}
                                    </span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className={`progress-fill ${getScoreBarColor(selectedVersion.readability_score)}`}
                                        style={{ width: `${Math.min(100, selectedVersion.readability_score)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Brand Score */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-dark-400 text-sm font-medium flex items-center gap-1.5">
                                        <Heart className="w-4 h-4" /> Brand Fit
                                    </span>
                                    <span className={`text-lg font-bold ${getScoreColor(selectedVersion.brand_score)}`}>
                                        {selectedVersion.brand_score}
                                    </span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className={`progress-fill ${getScoreBarColor(selectedVersion.brand_score)}`}
                                        style={{ width: `${selectedVersion.brand_score}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className={`glass-card p-6 ${selectedVersion.seo_score > 70 ? 'border-green-500/30' : 'border-yellow-500/30'}`}>
                        {selectedVersion.seo_score > 70 ? (
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-green-400 mb-1">Ready to Publish</h4>
                                    <p className="text-dark-400 text-sm">
                                        This content meets all quality thresholds and is optimized for engagement.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-yellow-400 mb-1">Needs Improvement</h4>
                                    <p className="text-dark-400 text-sm">
                                        Consider running the Auto-Write again for a higher quality output.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Versions */}
                    {versions.length > 1 && (
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-semibold text-dark-300 mb-4 flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" /> Version History
                            </h3>
                            <div className="space-y-2">
                                {versions.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVersion(v)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${selectedVersion?.id === v.id
                                                ? 'bg-accent/10 border border-accent/30'
                                                : 'bg-dark-800/50 hover:bg-dark-800'
                                            }`}
                                    >
                                        <p className="text-dark-200 font-medium">Version {v.version_number}</p>
                                        <p className="text-dark-500 text-sm">SEO: {v.seo_score}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentEditor;
