
import React, { useState, useEffect } from 'react';
import * as api from '../services/apiService';
import { User } from '../types';
import Spinner from '../components/common/Spinner';
import { UserCircleIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface ProfileProps {
    userId: string;
}

const Profile: React.FC<ProfileProps> = ({ userId }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        api.getProfile(userId).then(setUser);
    }, [userId]);

    if (!user) {
        return <Spinner />;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-dark-text-primary">My Profile</h1>
            <div className="bg-dark-card border border-dark-border rounded-xl p-8">
                <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
                    <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-32 w-32 rounded-full object-cover border-4 border-brand-primary"
                    />
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-dark-text-primary">{user.name}</h2>
                        <p className="text-lg text-brand-secondary capitalize">{user.role}</p>
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center text-dark-text-secondary">
                                <UserCircleIcon className="w-6 h-6 mr-3" />
                                <span>User ID: {user.id}</span>
                            </div>
                            <div className="flex items-center text-dark-text-secondary">
                                <MapPinIcon className="w-6 h-6 mr-3" />
                                <span>Campus: {user.campus}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;