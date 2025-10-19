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
import LoginPage from './pages/LoginPage';
import { User, Wallet } from './types';
import * as api from './services/apiService';

const App: React.FC = () => {
    const [user, setUser] = React.useState<User | null>(null);
    const [wallet, setWallet] = React.useState<Wallet | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const fetchUserData = (userId: string) => {
        setIsLoading(true);
        Promise.all([
            api.getProfile(userId),
            api.getWalletBalance(userId)
        ]).then(([userData, walletData]) => {
            setUser(userData);
            setWallet(walletData);
            setIsLoading(false);
        }).catch(() => setIsLoading(false));
    };

    const handleLogout = () => {
        setUser(null);
        setWallet(null);
    };

    const handleLogin = (userId: string) => {
        fetchUserData(userId);
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-dark-bg">
                <div className="text-xl text-dark-text-secondary">Loading CampusSphere...</div>
            </div>
        );
    }

    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }
    
    return (
        <HashRouter>
            <div className="flex h-screen bg-dark-bg font-sans">
                <Sidebar userRole={user.role} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header user={user} wallet={wallet} onLogout={handleLogout} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark-bg p-6 lg:p-8">
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                            <Route path="/dashboard" element={<Dashboard userId={user.id} />} />
                            <Route path="/library" element={<Library userId={user.id} />} />
                            <Route path="/canteen" element={<Canteen userId={user.id} />} />
                            <Route path="/academics" element={<Academics />} />
                            <Route path="/study-buddy" element={<StudyBuddy />} />
                            <Route path="/payments" element={<Payments userId={user.id} onBalanceChange={setWallet} />} />
                            <Route path="/profile" element={<Profile userId={user.id} />} />
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