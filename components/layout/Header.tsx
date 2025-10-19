
import React, { useState } from 'react';
import { User, Wallet } from '../../types';
import { BellIcon, ChevronDownIcon, WalletIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface HeaderProps {
    user: User;
    wallet: Wallet | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, wallet, onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogoutClick = () => {
        setDropdownOpen(false);
        onLogout();
    };
    
    const handleLinkClick = () => {
        setDropdownOpen(false);
    };

    return (
        <header className="bg-dark-card border-b border-dark-border p-4 flex items-center justify-between flex-shrink-0">
            <div>
                <h2 className="text-xl font-semibold text-dark-text-primary">Welcome back, {user.name.split(' ')[0]}!</h2>
                <p className="text-sm text-dark-text-secondary">Here's your overview for today.</p>
            </div>

            <div className="flex items-center space-x-6">
                <Link to="/payments" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-700 transition-colors">
                    <WalletIcon className="h-6 w-6 text-dark-text-secondary"/>
                    <span className="font-semibold text-dark-text-primary">${wallet?.balance.toFixed(2) ?? '0.00'}</span>
                </Link>

                <div className="relative">
                    <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <BellIcon className="h-6 w-6 text-dark-text-secondary" />
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-dark-card"></span>
                    </button>
                </div>

                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                        <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover border-2 border-dark-border" />
                        <div className="text-left hidden md:block">
                            <p className="font-semibold text-sm text-dark-text-primary">{user.name}</p>
                            <p className="text-xs text-dark-text-secondary">{user.campus}</p>
                        </div>
                        <ChevronDownIcon className={`h-5 w-5 text-dark-text-secondary transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-lg py-1 z-10">
                            <Link to="/profile" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-dark-text-secondary hover:bg-gray-700 transition-colors">Profile</Link>
                            <Link to="/settings" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-dark-text-secondary hover:bg-gray-700 transition-colors">Settings</Link>
                            <button onClick={handleLogoutClick} className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;