import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Rocket, Target, Users, MessageSquare, Zap, ArrowRight, Sparkles } from 'lucide-react';

const ProjectSetup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        niche: '',
        audience: '',
        tone: 'Professional',
        goals: ''
    });
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/projects/', formData);
            localStorage.setItem('currentProjectId', response.data.id);
            navigate('/research');
        } catch (error) {
            console.error("Error creating project:", error);
            alert("Failed to create project. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const toneOptions = [
        { value: 'Professional', icon: '💼', desc: 'Corporate & formal' },
        { value: 'Witty', icon: '😎', desc: 'Fun & engaging' },
        { value: 'Inspirational', icon: '✨', desc: 'Motivating & uplifting' },
        { value: 'Casual', icon: '🎯', desc: 'Friendly & relaxed' },
    ];

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        AI-Powered Marketing
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Launch Your <span className="gradient-text">Marketing Campaign</span>
                    </h1>
                    <p className="text-dark-400 text-lg max-w-lg mx-auto">
                        Let our AI agents research, strategize, and create compelling content for your brand
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                ${step >= s ? 'bg-accent text-white' : 'bg-dark-800 text-dark-500'}`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-accent' : 'bg-dark-700'}`} />}
                        </div>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="glass-card p-8 animate-slide-up">
                    {/* Step 1 - Business Info */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <Target className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-dark-100">Your Business</h2>
                                    <p className="text-dark-500 text-sm">Tell us about your niche</p>
                                </div>
                            </div>

                            <div>
                                <label className="label-text">Industry / Niche</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.niche}
                                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                                    placeholder="e.g. Sustainable Fashion, EdTech, D2C Food"
                                />
                            </div>

                            <div>
                                <label className="label-text">Target Audience</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.audience}
                                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                                    placeholder="e.g. Gen Z in metros, Working professionals, Small business owners"
                                />
                            </div>

                            <button type="button" onClick={nextStep} className="btn-primary w-full flex items-center justify-center gap-2">
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Step 2 - Tone */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-dark-100">Brand Voice</h2>
                                    <p className="text-dark-500 text-sm">How should your content sound?</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {toneOptions.map((tone) => (
                                    <button
                                        key={tone.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, tone: tone.value })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300
                      ${formData.tone === tone.value
                                                ? 'border-accent bg-accent/10'
                                                : 'border-dark-700 hover:border-dark-500 bg-dark-800/30'}`}
                                    >
                                        <span className="text-2xl">{tone.icon}</span>
                                        <p className="font-semibold text-dark-100 mt-2">{tone.value}</p>
                                        <p className="text-dark-500 text-sm">{tone.desc}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button type="button" onClick={prevStep} className="btn-secondary flex-1">
                                    Back
                                </button>
                                <button type="button" onClick={nextStep} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3 - Goals */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <Rocket className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-dark-100">Marketing Goals</h2>
                                    <p className="text-dark-500 text-sm">What do you want to achieve?</p>
                                </div>
                            </div>

                            <div>
                                <label className="label-text">Your Goals</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="input-field resize-none"
                                    value={formData.goals}
                                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                                    placeholder="e.g. Increase Instagram followers by 50%, Drive traffic to Shopify store, Launch festive campaign for Diwali"
                                />
                            </div>

                            {/* Summary */}
                            <div className="p-4 rounded-xl bg-dark-800/50 border border-dark-700">
                                <p className="text-sm text-dark-400 mb-2">Campaign Summary</p>
                                <p className="text-dark-200">
                                    <span className="text-accent font-medium">{formData.niche || 'Your Niche'}</span> targeting{' '}
                                    <span className="text-accent font-medium">{formData.audience || 'Your Audience'}</span> with a{' '}
                                    <span className="text-accent font-medium">{formData.tone}</span> tone.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button type="button" onClick={prevStep} className="btn-secondary flex-1">
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4" /> Launch Project
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ProjectSetup;
