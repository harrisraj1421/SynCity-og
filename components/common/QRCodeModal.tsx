
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import * as api from '../../services/apiService';
import Spinner from './Spinner';

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    title: string;
    description: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, amount, title, description }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            const upiData = `upi://pay?pa=campus.sphere@okbank&pn=CampusSphere&am=${amount.toFixed(2)}&tn=${encodeURIComponent(description)}`;
            api.generateQrCode(upiData)
                .then(url => {
                    setQrCodeUrl(url);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Failed to generate QR code", err);
                    setIsLoading(false);
                });
        }
    }, [isOpen, amount, description]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" role="dialog" aria-modal="true">
            <div className="bg-dark-card border border-dark-border rounded-xl p-8 max-w-sm w-full text-center relative transform transition-all">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-dark-text-secondary hover:text-dark-text-primary"
                    aria-label="Close payment modal"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <h2 className="text-2xl font-bold text-dark-text-primary mb-2">{title}</h2>
                <p className="text-dark-text-secondary mb-6">Scan with any UPI-enabled payment app.</p>

                <div className="bg-white p-4 rounded-lg inline-block h-[282px] w-[282px] flex items-center justify-center">
                    {isLoading && <Spinner/>}
                    {qrCodeUrl && !isLoading && <img src={qrCodeUrl} alt="Payment QR Code" width="250" height="250" />}
                </div>

                <div className="mt-6 text-left">
                    <div className="flex justify-between items-center border-b border-dark-border py-3">
                        <span className="text-dark-text-secondary">Amount Due</span>
                        <span className="font-bold text-2xl text-brand-secondary">${amount.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between items-start pt-3">
                        <span className="text-dark-text-secondary">For</span>
                        <span className="font-semibold text-dark-text-primary text-right max-w-[70%]">{description}</span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg mt-8 hover:bg-indigo-700 transition-colors"
                >
                    Payment Complete
                </button>
            </div>
        </div>
    );
};

export default QRCodeModal;