
import React, { useState, useEffect } from 'react';
import * as api from '../services/mockApi';
import { AdminStat, ChartData } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const StatCard: React.FC<{ stat: AdminStat }> = ({ stat }) => (
    <div className="bg-dark-card p-6 rounded-xl border border-dark-border">
        <p className="text-sm text-dark-text-secondary">{stat.label}</p>
        <p className="text-3xl font-bold text-dark-text-primary mt-2">{stat.value}</p>
        <div className={`flex items-center text-sm mt-2 ${stat.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stat.change > 0 ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
            <span>{Math.abs(stat.change)}% vs last period</span>
        </div>
    </div>
);

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const AdminAnalytics: React.FC = () => {
    const [stats, setStats] = useState<AdminStat[]>([]);
    const [libraryData, setLibraryData] = useState<ChartData[]>([]);
    const [canteenData, setCanteenData] = useState<ChartData[]>([]);

    useEffect(() => {
        api.getAdminStats().then(setStats);
        api.getLibraryActivity().then(setLibraryData);
        api.getCanteenSales().then(setCanteenData);
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => <StatCard key={stat.label} stat={stat} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-dark-card p-6 rounded-xl border border-dark-border">
                    <h2 className="text-xl font-bold mb-4">Library Activity (Last 7 Days)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={libraryData}>
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                            <Bar dataKey="value" name="Books Issued" fill="#4F46E5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-dark-card p-6 rounded-xl border border-dark-border">
                    <h2 className="text-xl font-bold mb-4">Canteen Sales by Category</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={canteenData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {canteenData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
