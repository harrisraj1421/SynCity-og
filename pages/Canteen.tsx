
import React, { useState, useEffect, useRef } from 'react';
import * as api from '../services/mockApi';
import { CanteenItem, CanteenOrder, OrderItem, OrderStatus } from '../types';
import Spinner from '../components/common/Spinner';
import { StarIcon, PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/solid';

const MenuItemCard: React.FC<{ item: CanteenItem; onAddToCart: (item: CanteenItem) => void }> = ({ item, onAddToCart }) => (
    <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden group">
        <div className="relative">
            <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover" />
            <div className="absolute top-2 right-2 flex items-center bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{item.rating}</span>
            </div>
        </div>
        <div className="p-4">
            <h3 className="font-bold text-lg text-dark-text-primary">{item.name}</h3>
            <p className="text-sm text-dark-text-secondary">{item.category}</p>
            <div className="mt-4 flex justify-between items-center">
                <p className="text-xl font-semibold text-brand-secondary">${item.price.toFixed(2)}</p>
                <button onClick={() => onAddToCart(item)} className="bg-brand-primary p-2 rounded-full text-white transform group-hover:scale-110 transition-transform">
                    <PlusIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    </div>
);

const Canteen: React.FC = () => {
    const [menu, setMenu] = useState<CanteenItem[]>([]);
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [orders, setOrders] = useState<CanteenOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const toastTimeoutRef = useRef<number | null>(null);

    const fetchOrders = () => {
        api.getMyOrders('u1').then(setOrders);
    };

    useEffect(() => {
        api.getCanteenMenu().then(data => {
            setMenu(data);
            setIsLoading(false);
        });
        fetchOrders();

        return () => {
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    const addToCart = (item: CanteenItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(orderItem => orderItem.item.id === item.id);
            if (existingItem) {
                return prevCart.map(orderItem =>
                    orderItem.item.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem
                );
            }
            return [...prevCart, { item, quantity: 1 }];
        });

        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToastMessage(`${item.name} added to cart!`);
        toastTimeoutRef.current = window.setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };
    
    const updateQuantity = (itemId: string, delta: number) => {
        setCart(prevCart => {
            return prevCart.map(orderItem =>
                orderItem.item.id === itemId
                    ? { ...orderItem, quantity: Math.max(0, orderItem.quantity + delta) }
                    : orderItem
            ).filter(orderItem => orderItem.quantity > 0);
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, { item, quantity }) => total + item.price * quantity, 0);

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        setIsPlacingOrder(true);
        await api.placeCanteenOrder('u1', cart);
        setCart([]);
        fetchOrders();
        setIsPlacingOrder(false);
    };

    const statusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.READY: return 'text-green-400';
            case OrderStatus.PREPARING: return 'text-yellow-400';
            case OrderStatus.PENDING: return 'text-blue-400';
            case OrderStatus.COMPLETED: return 'text-gray-400';
            case OrderStatus.CANCELLED: return 'text-red-400';
            default: return 'text-dark-text-secondary';
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-6">Canteen Menu</h2>
                    {isLoading ? <Spinner /> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {menu.map(item => <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />)}
                        </div>
                    )}
                     <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">My Recent Orders</h2>
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.id} className="bg-dark-card p-4 rounded-lg border border-dark-border flex justify-between items-center">
                                   <div>
                                        <p className="font-semibold text-dark-text-primary">Order #{order.token}</p>
                                        <p className="text-sm text-dark-text-secondary">{order.items.length} items - ${order.total.toFixed(2)}</p>
                                   </div>
                                   <div>
                                        <p className={`font-bold text-lg ${statusColor(order.status)}`}>{order.status}</p>
                                   </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-8 bg-dark-card border border-dark-border rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">My Order</h2>
                            {cart.length > 0 && (
                                <button
                                    onClick={clearCart}
                                    className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                                    aria-label="Clear cart"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                    <span>Clear Cart</span>
                                </button>
                            )}
                        </div>
                        {cart.length === 0 ? (
                            <p className="text-dark-text-secondary text-center py-8">Your cart is empty.</p>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(({ item, quantity }) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover"/>
                                            <div>
                                                <p className="font-semibold text-dark-text-primary text-sm">{item.name}</p>
                                                <p className="text-xs text-dark-text-secondary">${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-gray-700/50 rounded-full">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1"><MinusIcon className="h-4 w-4"/></button>
                                            <span className="font-bold w-4 text-center">{quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1"><PlusIcon className="h-4 w-4"/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {cart.length > 0 && (
                            <>
                                <div className="border-t border-dark-border my-6"></div>
                                <div className="flex justify-between font-semibold text-lg">
                                    <span className="text-dark-text-secondary">Total</span>
                                    <span className="text-dark-text-primary">${cartTotal.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isPlacingOrder}
                                    className="w-full bg-brand-secondary text-white font-bold py-3 rounded-lg mt-6 hover:bg-emerald-600 transition-colors disabled:bg-gray-500 flex items-center justify-center"
                                >
                                    {isPlacingOrder && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>}
                                    {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {toastMessage && (
                <div role="status" aria-live="polite" className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-brand-secondary text-white px-6 py-3 rounded-full shadow-lg animate-fade-in z-50">
                    {toastMessage}
                </div>
            )}
        </>
    );
};

export default Canteen;