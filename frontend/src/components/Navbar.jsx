import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Calendar, FileEdit, Sparkles, LogIn, LogOut, User, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(true);

    // Check for logged in user and theme preference
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'light') {
            setDarkMode(false);
            document.documentElement.classList.add('light-mode');
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');

        if (newMode) {
            document.documentElement.classList.remove('light-mode');
        } else {
            document.documentElement.classList.add('light-mode');
        }
    };

    const appNavItems = [
        { path: '/setup', label: 'Setup', icon: LayoutDashboard },
        { path: '/research', label: 'Research', icon: Search },
        { path: '/calendar', label: 'Calendar', icon: Calendar },
    ];

    const isActive = (path) => location.pathname === path;
    const isPublicPage = location.pathname === '/' || location.pathname === '/login';

    return (
        <nav className="sticky top-0 z-50 glass-card border-t-0 border-x-0 rounded-none">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center
                          group-hover:shadow-lg group-hover:shadow-accent/30 transition-all duration-300">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold gradient-text">AgentFlow</span>
                            <span className="block text-[10px] text-dark-500 uppercase tracking-widest">AI Marketing</span>
                        </div>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-2">
                        {user && !isPublicPage && appNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                    ${isActive(item.path)
                                            ? 'bg-accent/10 text-accent border border-accent/30'
                                            : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800/50'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl text-dark-400 hover:text-dark-100 hover:bg-dark-800/50 transition-all duration-300"
                            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Auth buttons */}
                        {user ? (
                            <div className="flex items-center gap-3 ml-2">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800/50">
                                    <User className="w-4 h-4 text-accent" />
                                    <span className="text-sm text-dark-300">{user.name}</span>
                                    {user.isDemo && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent">Demo</span>
                                    )}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-dark-400 hover:text-dark-100 hover:bg-dark-800/50 transition-all duration-300"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 transition-all duration-300 ml-2"
                            >
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
