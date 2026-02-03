import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Mail,
    Lock,
    ArrowRight,
    Zap,
    Sparkles,
    Eye,
    EyeOff,
    User
} from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulated auth - store in localStorage
        setTimeout(() => {
            const user = {
                name: formData.name || formData.email.split('@')[0],
                email: formData.email,
                isLoggedIn: true
            };
            localStorage.setItem('user', JSON.stringify(user));
            setLoading(false);
            navigate('/setup');
        }, 1000);
    };

    const handleDemoMode = () => {
        const demoUser = {
            name: 'Demo User',
            email: 'demo@example.com',
            isLoggedIn: true,
            isDemo: true
        };
        localStorage.setItem('user', JSON.stringify(demoUser));
        navigate('/setup');
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
                        <Zap className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-dark-400">
                        {isLogin
                            ? 'Sign in to continue to your dashboard'
                            : 'Start your AI marketing journey'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="glass-card p-8 animate-slide-up">
                    <div className="space-y-5">
                        {/* Name field - only for register */}
                        {!isLogin && (
                            <div>
                                <label className="label-text">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                    <input
                                        type="text"
                                        required={!isLogin}
                                        className="input-field pl-12"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="label-text">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                <input
                                    type="email"
                                    required
                                    className="input-field pl-12"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="label-text">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="input-field pl-12 pr-12"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password - only for login */}
                        {isLogin && (
                            <div className="text-right">
                                <button type="button" className="text-sm text-accent hover:text-accent-light transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {isLogin ? 'Signing in...' : 'Creating account...'}
                            </>
                        ) : (
                            <>
                                {isLogin ? 'Sign In' : 'Create Account'}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-dark-700" />
                        <span className="text-dark-500 text-sm">or</span>
                        <div className="flex-1 h-px bg-dark-700" />
                    </div>

                    {/* Demo Mode Button */}
                    <button
                        type="button"
                        onClick={handleDemoMode}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Continue with Demo Mode
                    </button>

                    {/* Toggle Login/Register */}
                    <p className="text-center text-dark-400 mt-6">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-accent hover:text-accent-light font-medium transition-colors"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </form>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="text-dark-500 hover:text-dark-300 text-sm transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
