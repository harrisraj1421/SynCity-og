import React from 'react';
import { BellIcon, LockClosedIcon, SunIcon } from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-dark-text-primary">Settings</h1>
            <div className="space-y-8">
                {/* Notification Settings */}
                <div className="bg-dark-card border border-dark-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <BellIcon className="w-6 h-6 mr-3 text-brand-primary" />
                        Notification Settings
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-dark-text-secondary">Email Notifications</p>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-dark-text-secondary">Push Notifications</p>
                             <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-dark-text-secondary">Library Due Date Reminders</p>
                             <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="bg-dark-card border border-dark-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <LockClosedIcon className="w-6 h-6 mr-3 text-brand-primary" />
                        Account Settings
                    </h2>
                    <div className="space-y-2">
                        <button className="text-left w-full p-3 text-dark-text-secondary hover:bg-gray-700/50 rounded-md transition-colors">Change Password</button>
                        <button className="text-left w-full p-3 text-red-400 hover:bg-red-900/50 rounded-md transition-colors">Delete Account</button>
                    </div>
                </div>
                
                 {/* Appearance Settings */}
                <div className="bg-dark-card border border-dark-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <SunIcon className="w-6 h-6 mr-3 text-brand-primary" />
                        Appearance
                    </h2>
                    <div className="space-y-2">
                        <p className="text-dark-text-secondary">Theme</p>
                        <div className="flex space-x-4">
                             <button className="w-full p-3 rounded-lg bg-gray-700 border-2 border-brand-primary text-dark-text-primary">Dark Mode</button>
                             <button className="w-full p-3 rounded-lg bg-gray-900 border-2 border-transparent hover:border-dark-border text-dark-text-secondary">Light Mode</button>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #374151; transition: .4s; }
                .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; }
                input:checked + .slider { background-color: #4F46E5; }
                input:checked + .slider:before { transform: translateX(22px); }
                .slider.round { border-radius: 34px; }
                .slider.round:before { border-radius: 50%; }
            `}</style>
        </div>
    );
};

export default Settings;
