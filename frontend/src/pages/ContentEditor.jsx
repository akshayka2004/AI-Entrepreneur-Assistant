import React, { useState, useEffect } from 'react';
import api from '../api';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, BarChart3, Type, Heart, RefreshCw, Copy, Check, Sparkles, Hash, Repeat, ChevronDown } from 'lucide-react';

const ContentEditor = () => {
    const { calendarId } = useParams();
    const [versions, setVersions] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [regenerating, setRegenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    // New feature states
    const [hashtags, setHashtags] = useState([]);
    const [loadingHashtags, setLoadingHashtags] = useState(false);
    const [showRepurpose, setShowRepurpose] = useState(false);
    const [repurposedContent, setRepurposedContent] = useState(null);
    const [repurposing, setRepurposing] = useState(false);
    const [copiedHashtags, setCopiedHashtags] = useState(false);

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

    const handleRegenerate = async () => {
        setRegenerating(true);
        try {
            await api.post(`/content/${calendarId}/write`);
            await fetchVersions();
        } catch (error) {
            console.error("Failed to regenerate content", error);
            alert("Failed to regenerate content. Please try again.");
        } finally {
            setRegenerating(false);
        }
    };

    const generateHashtags = async () => {
        setLoadingHashtags(true);
        try {
            const res = await api.post(`/content/${calendarId}/hashtags`);
            setHashtags(res.data.hashtags);
        } catch (error) {
            console.error("Failed to generate hashtags", error);
        } finally {
            setLoadingHashtags(false);
        }
    };

    const repurposeContent = async (targetPlatform) => {
        setRepurposing(true);
        setShowRepurpose(false);
        try {
            const res = await api.post(`/content/${calendarId}/repurpose`, {
                target_platform: targetPlatform
            });
            setRepurposedContent(res.data);
        } catch (error) {
            console.error("Failed to repurpose content", error);
            alert("Failed to repurpose content. Please try again.");
        } finally {
            setRepurposing(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text || selectedVersion.body);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyHashtags = () => {
        navigator.clipboard.writeText(hashtags.join(' '));
        setCopiedHashtags(true);
        setTimeout(() => setCopiedHashtags(false), 2000);
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

    const platforms = ['Twitter', 'Instagram', 'LinkedIn', 'Blog', 'Facebook'];

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
                        <div className="px-6 py-4 border-b border-dark-700 flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h3 className="text-xl font-semibold text-dark-50">
                                    {selectedVersion.title || "Generated Content"}
                                </h3>
                                <p className="text-dark-500 text-sm">Version {selectedVersion.version_number}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Regenerate Button */}
                                <button
                                    onClick={handleRegenerate}
                                    disabled={regenerating}
                                    className="btn-primary py-2 px-4 flex items-center gap-2 text-sm"
                                >
                                    {regenerating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Regenerating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Regenerate
                                        </>
                                    )}
                                </button>

                                {/* Repurpose Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowRepurpose(!showRepurpose)}
                                        disabled={repurposing}
                                        className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm"
                                    >
                                        {repurposing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                                                Converting...
                                            </>
                                        ) : (
                                            <>
                                                <Repeat className="w-4 h-4" />
                                                Repurpose
                                                <ChevronDown className="w-3 h-3" />
                                            </>
                                        )}
                                    </button>
                                    {showRepurpose && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-dark-800 border border-dark-600 rounded-xl shadow-xl z-10 overflow-hidden">
                                            {platforms.map((platform) => (
                                                <button
                                                    key={platform}
                                                    onClick={() => repurposeContent(platform)}
                                                    className="w-full text-left px-4 py-2.5 hover:bg-dark-700 text-dark-200 text-sm transition-colors"
                                                >
                                                    Convert to {platform}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Copy Button */}
                                <button
                                    onClick={() => copyToClipboard()}
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
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-dark-200 leading-relaxed">
                                {selectedVersion.body}
                            </div>
                        </div>
                    </div>

                    {/* Repurposed Content */}
                    {repurposedContent && (
                        <div className="glass-card overflow-hidden border-accent/30">
                            <div className="px-6 py-4 border-b border-dark-700 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Repeat className="w-5 h-5 text-accent" />
                                    <h3 className="font-semibold text-dark-100">
                                        Repurposed for {repurposedContent.platform}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(repurposedContent.content)}
                                    className="btn-secondary py-1.5 px-3 flex items-center gap-2 text-sm"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="prose prose-invert max-w-none whitespace-pre-wrap text-dark-200 leading-relaxed">
                                    {repurposedContent.content}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Hashtag Generator */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-dark-100 flex items-center gap-2">
                                <Hash className="w-5 h-5 text-accent" />
                                Hashtags
                            </h3>
                            <button
                                onClick={generateHashtags}
                                disabled={loadingHashtags}
                                className="text-sm text-accent hover:text-accent-light flex items-center gap-1"
                            >
                                {loadingHashtags ? (
                                    <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Generate
                                    </>
                                )}
                            </button>
                        </div>

                        {hashtags.length > 0 ? (
                            <>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {hashtags.map((tag, i) => (
                                        <span key={i} className="px-2 py-1 text-sm bg-accent/10 text-accent rounded-lg">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={copyHashtags}
                                    className="w-full btn-secondary py-2 text-sm flex items-center justify-center gap-2"
                                >
                                    {copiedHashtags ? (
                                        <>
                                            <Check className="w-4 h-4 text-green-400" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy All Hashtags
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <p className="text-dark-500 text-sm">Click Generate to create relevant hashtags for this content.</p>
                        )}
                    </div>

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
                                        Content meets quality thresholds.
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
                                        Try regenerating for better quality.
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
