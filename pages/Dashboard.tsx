
import React, { useState, useEffect } from 'react';
import * as api from '../services/apiService';
import { Book, CanteenOrder, Fine, LibraryTransaction, OrderStatus } from '../types';
import { BookOpenIcon, ClockIcon, CurrencyDollarIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface DashboardProps {
    userId: string;
}

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string | number, color: string }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-dark-card p-6 rounded-xl flex items-center space-x-4 border border-dark-border">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
            <p className="text-sm text-dark-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-dark-text-primary">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
    const [myBooks, setMyBooks] = useState<{ book: Book; transaction: LibraryTransaction }[]>([]);
    const [myOrders, setMyOrders] = useState<CanteenOrder[]>([]);
    const [myFines, setMyFines] = useState<Fine[]>([]);

    useEffect(() => {
        api.getIssuedBooks(userId).then(setMyBooks);
        api.getUserOrders(userId).then(setMyOrders);
        api.getUserFines(userId).then(setMyFines);
    }, [userId]);

    const overdueBooks = myBooks.filter(item => new Date(item.transaction.dueDate) < new Date());
    const activeOrders = myOrders.filter(o => o.status === OrderStatus.PREPARING || o.status === OrderStatus.READY);
    const unpaidFines = myFines.filter(f => !f.isPaid);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={BookOpenIcon} title="Books Issued" value={myBooks.length} color="bg-blue-500" />
                <StatCard icon={ClockIcon} title="Overdue Books" value={overdueBooks.length} color="bg-red-500" />
                <StatCard icon={ShoppingCartIcon} title="Active Orders" value={activeOrders.length} color="bg-green-500" />
                <StatCard icon={CurrencyDollarIcon} title="Unpaid Fines" value={`$${unpaidFines.reduce((sum, f) => sum + f.amount, 0).toFixed(2)}`} color="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-dark-card p-6 rounded-xl border border-dark-border">
                    <h3 className="text-lg font-semibold mb-4 text-dark-text-primary">Due This Week</h3>
                    {overdueBooks.length > 0 ? (
                        <ul className="space-y-3">
                            {overdueBooks.map(({ book, transaction }) => (
                                <li key={transaction.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-dark-text-primary">{book.title}</p>
                                        <p className="text-sm text-red-400">Due: {new Date(transaction.dueDate).toLocaleDateString()}</p>
                                    </div>
                                    <Link to="/library" className="text-sm text-brand-primary hover:underline">View</Link>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-dark-text-secondary">No books are overdue. Great job!</p>}
                </div>

                <div className="bg-dark-card p-6 rounded-xl border border-dark-border">
                    <h3 className="text-lg font-semibold mb-4 text-dark-text-primary">Canteen Order Status</h3>
                    {activeOrders.length > 0 ? (
                        <ul className="space-y-3">
                            {activeOrders.map(order => (
                                <li key={order.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-dark-text-primary">Order #{order.token}</p>
                                        <p className={`text-sm ${order.status === OrderStatus.READY ? 'text-green-400' : 'text-yellow-400'}`}>{order.status}</p>
                                    </div>
                                    <Link to="/canteen" className="text-sm text-brand-primary hover:underline">Track</Link>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-dark-text-secondary">You have no active canteen orders.</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;