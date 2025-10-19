import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Canteen from './pages/Canteen';
import Academics from './pages/Academics';
import Payments from './pages/Payments';
import StudyBuddy from './pages/StudyBuddy';
import AdminAnalytics from './pages/AdminAnalytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { User } from './types';
import * as api from './services/mockApi';

const App: React.FC = () => {
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchUser = () => {
        setIsLoading(true);
        api.getCurrentUser().then(userData => {
            setUser(userData);
            setIsLoading(false);
        }).catch(() => setIsLoading(false));
    };

    React.useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = () => {
        setUser(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-dark-bg">
                <div className="text-xl text-dark-text-secondary">Loading CampusSphere...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-dark-bg">
                <div className="text-center">
                    <svg className="w-16 h-16 text-brand-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                    <h1 className="text-3xl font-bold text-dark-text-primary mb-2">CampusSphere</h1>
                    <p className="text-dark-text-secondary mb-8">You have been logged out.</p>
                    <button 
                        onClick={fetchUser} 
                        className="bg-brand-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Log In Again
                    </button>
                </div>
            </div>
        )
    }
    
    return (
        <HashRouter>
            <div className="flex h-screen bg-dark-bg font-sans">
                <Sidebar userRole={user.role} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header user={user} onLogout={handleLogout} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark-bg p-6 lg:p-8">
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/library" element={<Library />} />
                            <Route path="/canteen" element={<Canteen />} />
                            <Route path="/academics" element={<Academics />} />
                            <Route path="/study-buddy" element={<StudyBuddy />} />
                            <Route path="/payments" element={<Payments />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                            {user.role === 'admin' && <Route path="/admin" element={<AdminAnalytics />} />}
                        </Routes>
                    </main>
                </div>
            </div>
        </HashRouter>
    );
};

export default App;
