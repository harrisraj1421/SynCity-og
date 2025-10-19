import React from 'react';

interface LoginPageProps {
    onLogin: (userId: string) => void;
}

const userProfiles = [
    { id: 'u1', name: 'Alex Johnson', role: 'Student', avatar: 'https://i.pravatar.cc/150?u=alex' },
    { id: 'f1', name: 'Dr. Ben Carter', role: 'Faculty', avatar: 'https://i.pravatar.cc/150?u=ben' },
    { id: 'a1', name: 'Dr. Evelyn Reed', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=evelyn' },
];

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-dark-bg text-dark-text-primary">
            <div className="text-center mb-10">
                <svg className="w-16 h-16 text-brand-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <h1 className="text-4xl font-bold">Welcome to CampusSphere</h1>
                <p className="text-dark-text-secondary mt-2">Select a profile to log in.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {userProfiles.map(profile => (
                    <button
                        key={profile.id}
                        onClick={() => onLogin(profile.id)}
                        className="bg-dark-card border border-dark-border rounded-lg p-6 text-center group hover:border-brand-primary transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-dark-border group-hover:border-brand-primary transition-colors" />
                        <h2 className="text-xl font-semibold text-dark-text-primary">{profile.name}</h2>
                        <p className="text-dark-text-secondary">{profile.role}</p>
                        <span className="mt-4 inline-block bg-brand-primary text-white font-bold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            Log In
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LoginPage;