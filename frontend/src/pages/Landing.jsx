import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles,
    Search,
    Calendar,
    PenTool,
    BarChart3,
    ArrowRight,
    Zap,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Search,
            title: 'AI Market Research',
            description: 'Analyze competitors, trends, and keywords with AI-powered insights tailored for Indian markets.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Calendar,
            title: 'Smart Content Calendar',
            description: 'Generate a 14-day content strategy optimized for your audience and platforms.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: PenTool,
            title: 'AI Content Writer',
            description: 'Create engaging posts, blogs, and tweets with platform-specific optimization.',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: BarChart3,
            title: 'SEO & Performance',
            description: 'Get SEO scores, keyword suggestions, and content improvements in real-time.',
            color: 'from-orange-500 to-yellow-500'
        }
    ];

    const stats = [
        { value: '5+', label: 'AI Models' },
        { value: '14', label: 'Day Calendar' },
        { value: '100%', label: 'Customizable' },
        { value: '24/7', label: 'Available' }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative px-6 pt-20 pb-32 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-6xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8 animate-fade-in">
                        <Sparkles className="w-4 h-4" />
                        Powered by Multiple AI Models
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                        Your AI-Powered
                        <br />
                        <span className="gradient-text">Marketing Assistant</span>
                    </h1>

                    <p className="text-xl text-dark-400 max-w-2xl mx-auto mb-10 animate-fade-in">
                        Research markets, plan content, and create compelling copy for your brand —
                        all powered by cutting-edge AI tailored for Indian entrepreneurs.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
                        >
                            <Zap className="w-5 h-5" />
                            Get Started Free
                        </button>
                        <button
                            onClick={() => navigate('/setup')}
                            className="btn-secondary flex items-center justify-center gap-2 text-lg px-8 py-4"
                        >
                            Try Demo
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="px-6 py-16 border-y border-dark-800">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                                <div className="text-dark-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-6 py-24">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Everything You Need to <span className="gradient-text">Grow Your Brand</span>
                        </h2>
                        <p className="text-dark-400 text-lg max-w-2xl mx-auto">
                            From market research to content creation, our AI agents handle it all.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="glass-card p-8 hover:border-accent/50 transition-all duration-300 group"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-dark-100 mb-3">{feature.title}</h3>
                                <p className="text-dark-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="px-6 py-24 bg-dark-900/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            How It <span className="gradient-text">Works</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', icon: Target, title: 'Define Your Brand', desc: 'Tell us about your niche, audience, and goals' },
                            { step: '02', icon: TrendingUp, title: 'AI Research', desc: 'Our agents analyze markets and competitors' },
                            { step: '03', icon: PenTool, title: 'Get Content', desc: 'Receive a complete content calendar and copy' }
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="text-6xl font-bold text-dark-800 mb-4">{item.step}</div>
                                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-dark-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="glass-card p-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to <span className="gradient-text">Transform</span> Your Marketing?
                        </h2>
                        <p className="text-dark-400 text-lg mb-8">
                            Join entrepreneurs using AI to create better content, faster.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary flex items-center justify-center gap-2 text-lg px-10 py-4 mx-auto"
                        >
                            <Sparkles className="w-5 h-5" />
                            Start for Free
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-8 border-t border-dark-800">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-6 h-6 text-accent" />
                        <span className="font-semibold">AI Entrepreneur Assistant</span>
                    </div>
                    <p className="text-dark-500 text-sm">
                        © 2024-2026 All rights reserved. Built with ❤️ for Indian entrepreneurs.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
