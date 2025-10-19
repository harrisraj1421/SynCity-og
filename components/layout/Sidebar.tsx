
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, ShoppingCartIcon, AcademicCapIcon, CurrencyDollarIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
    userRole: 'student' | 'admin';
}

const navLinks = [
    { to: '/dashboard', icon: HomeIcon, text: 'Dashboard' },
    { to: '/library', icon: BookOpenIcon, text: 'Library' },
    { to: '/canteen', icon: ShoppingCartIcon, text: 'Canteen' },
    { to: '/academics', icon: AcademicCapIcon, text: 'Academics' },
    { to: '/study-buddy', icon: SparklesIcon, text: 'Study Buddy' },
    { to: '/payments', icon: CurrencyDollarIcon, text: 'Payments' },
];

const adminLink = { to: '/admin', icon: ChartBarIcon, text: 'Admin Analytics' };

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
    const allLinks = userRole === 'admin' ? [...navLinks, adminLink] : navLinks;

    const linkClasses = "flex items-center px-4 py-3 text-dark-text-secondary rounded-lg hover:bg-dark-card hover:text-dark-text-primary transition-colors duration-200";
    const activeLinkClasses = "bg-brand-primary text-white";

    return (
        <aside className="w-64 bg-dark-card flex-shrink-0 p-4 border-r border-dark-border flex flex-col">
            <div className="flex items-center mb-10">
                <svg className="w-8 h-8 text-brand-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <h1 className="text-2xl font-bold text-dark-text-primary">CampusSphere</h1>
            </div>
            <nav className="flex-1">
                <ul>
                    {allLinks.map(({ to, icon: Icon, text }) => (
                        <li key={to} className="mb-2">
                            <NavLink
                                to={to}
                                className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                            >
                                <Icon className="w-6 h-6 mr-3" />
                                <span className="font-medium">{text}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto">
                 <div className="p-4 bg-gray-700/50 rounded-lg text-center">
                    <p className="text-sm text-dark-text-secondary">© 2024 CampusSphere</p>
                    <p className="text-xs text-gray-500 mt-1">All-in-one Campus Hub</p>
                 </div>
            </div>
        </aside>
    );
};

export default Sidebar;
