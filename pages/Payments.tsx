
import React, { useState, useEffect } from 'react';
import * as api from '../services/mockApi';
import { Fine } from '../types';
import Spinner from '../components/common/Spinner';

const Payments: React.FC = () => {
    const [fines, setFines] = useState<Fine[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.getMyFines('u1').then(data => {
            setFines(data);
            setIsLoading(false);
        });
    }, []);

    const unpaidFines = fines.filter(f => !f.isPaid);
    const paidFines = fines.filter(f => f.isPaid);
    const totalDue = unpaidFines.reduce((sum, f) => sum + f.amount, 0);

    return (
        <div className="space-y-8">
            <div className="bg-dark-card border border-dark-border p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">Outstanding Dues</h2>
                {isLoading ? <Spinner /> : (
                    <>
                        {unpaidFines.length > 0 ? (
                            <div className="space-y-4">
                                {unpaidFines.map(fine => (
                                    <div key={fine.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-700/50 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-dark-text-primary">{fine.reason}</p>
                                            <p className="text-sm text-dark-text-secondary">Dated: {new Date(fine.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                                            <p className="text-xl font-bold text-red-400">${fine.amount.toFixed(2)}</p>
                                            <button className="bg-brand-secondary text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-emerald-600 transition-colors">Pay Now</button>
                                        </div>
                                    </div>
                                ))}
                                <div className="border-t border-dark-border pt-4 mt-4 flex justify-end items-center">
                                    <span className="text-lg font-semibold mr-4">Total Due:</span>
                                    <span className="text-2xl font-bold text-red-400">${totalDue.toFixed(2)}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-dark-text-secondary">No outstanding dues. All clear!</p>
                        )}
                    </>
                )}
            </div>

            <div className="bg-dark-card border border-dark-border p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">Payment History</h2>
                {isLoading ? <Spinner /> : (
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-dark-border">
                                <tr>
                                    <th className="p-2 text-sm font-semibold text-dark-text-secondary">Date</th>
                                    <th className="p-2 text-sm font-semibold text-dark-text-secondary">Description</th>
                                    <th className="p-2 text-sm font-semibold text-dark-text-secondary text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paidFines.length > 0 ? paidFines.map(fine => (
                                    <tr key={fine.id} className="border-b border-dark-border">
                                        <td className="p-2 text-sm">{new Date(fine.date).toLocaleDateString()}</td>
                                        <td className="p-2 text-sm">{fine.reason}</td>
                                        <td className="p-2 text-sm font-semibold text-green-400 text-right">${fine.amount.toFixed(2)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="text-center p-4 text-dark-text-secondary">No payment history found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payments;
