
import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../services/apiService';
import { Fine, Wallet, WalletTransaction } from '../types';
import Spinner from '../components/common/Spinner';
import { CreditCardIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/react/24/outline';


interface PaymentsProps {
    userId: string;
    onBalanceChange: (wallet: Wallet) => void;
}

const Payments: React.FC<PaymentsProps> = ({ userId, onBalanceChange }) => {
    const [fines, setFines] = useState<Fine[]>([]);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaying, setIsPaying] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [finesData, walletData, transactionsData] = await Promise.all([
                api.getUserFines(userId),
                api.getWalletBalance(userId),
                api.getWalletTransactions(userId)
            ]);
            setFines(finesData);
            setWallet(walletData);
            setTransactions(transactionsData);
        } catch (error) {
            console.error("Failed to fetch payment data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePayFine = async (fineId: string) => {
        setIsPaying(fineId);
        try {
            await api.payFineWithWallet(userId, fineId);
            // Refresh all data after payment
            const newWalletState = await api.getWalletBalance(userId);
            onBalanceChange(newWalletState);
            fetchData();
        } catch (error) {
            console.error("Failed to pay fine:", error);
            // Add user-facing error feedback here
        } finally {
            setIsPaying(null);
        }
    }

    const handleTopUp = async () => {
        // This is a mock top-up. In a real app, this would open a payment gateway.
        const updatedWallet = await api.topupWallet(userId, 50); // Top up $50
        setWallet(updatedWallet);
        onBalanceChange(updatedWallet);
        fetchData(); // Refresh transactions
    }

    const unpaidFines = fines.filter(f => !f.isPaid);
    const totalDue = unpaidFines.reduce((sum, f) => sum + f.amount, 0);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Outstanding Dues */}
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
                                                    <button 
                                                        onClick={() => handlePayFine(fine.id)}
                                                        disabled={isPaying !== null}
                                                        className="bg-brand-secondary text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-emerald-600 transition-colors disabled:bg-gray-600 disabled:cursor-wait w-32 h-10 flex justify-center items-center"
                                                    >
                                                        {isPaying === fine.id ? (
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        ) : 'Pay with Wallet'}
                                                    </button>
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
                </div>

                {/* Wallet Balance */}
                <div className="bg-dark-card border border-dark-border p-6 rounded-xl flex flex-col items-center justify-center text-center">
                     <CreditCardIcon className="w-12 h-12 text-brand-primary mb-4"/>
                     <h3 className="text-lg font-semibold text-dark-text-secondary">Wallet Balance</h3>
                     <p className="text-5xl font-bold text-dark-text-primary my-2">${wallet?.balance.toFixed(2) ?? '0.00'}</p>
                     <button 
                        onClick={handleTopUp}
                        className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg mt-6 hover:bg-indigo-700 transition-colors"
                     >
                        Top Up Wallet
                     </button>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-dark-card border border-dark-border p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
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
                            {isLoading ? (
                                <tr><td colSpan={3}><Spinner/></td></tr>
                            ) : transactions.length > 0 ? transactions.map(t => (
                                <tr key={t.id} className="border-b border-dark-border last:border-b-0">
                                    <td className="p-3 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="p-3 text-sm flex items-center">
                                        {t.type === 'credit' 
                                            ? <ArrowUpCircleIcon className="w-5 h-5 mr-2 text-green-400"/> 
                                            : <ArrowDownCircleIcon className="w-5 h-5 mr-2 text-red-400"/>
                                        }
                                        {t.description}
                                    </td>
                                    <td className={`p-3 text-sm font-semibold text-right ${t.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                        {t.type === 'credit' ? '+' : '-'}${t.amount.toFixed(2)}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="text-center p-4 text-dark-text-secondary">No transaction history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
