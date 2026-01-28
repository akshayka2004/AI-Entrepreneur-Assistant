import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, Calendar, FileEdit, Sparkles } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Setup', icon: LayoutDashboard },
        { path: '/research', label: 'Research', icon: Search },
        { path: '/calendar', label: 'Calendar', icon: Calendar },
    ];

    const isActive = (path) => location.pathname === path;

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
                        {navItems.map((item) => {
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
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
