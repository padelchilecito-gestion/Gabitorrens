import React, { useState } from 'react';
import { Reseller, Product, CartItem, ResellerOrder } from '../../types';
import { Plus, ShoppingCart, Trash2, X, Package } from 'lucide-react';

interface ResellerOrdersProps {
    currentUser: Reseller;
    adminProducts: Product[];
    onUpdateReseller: (updated: Reseller) => void;
}

const ResellerOrders: React.FC<ResellerOrdersProps> = ({ currentUser, adminProducts, onUpdateReseller }) => {
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderCart, setOrderCart] = useState<CartItem[]>([]);
    
    const WHOLESALE_DISCOUNT = 0.30; 

    // --- CART LOGIC ---
    const addToOrderCart = (product: Product) => {
        setOrderCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromOrderCart = (id: string) => {
        setOrderCart(prev => prev.filter(p => p.id !== id));
    };

    const confirmOrder = () => {
        if (orderCart.length === 0) return;

        const totalPublic = orderCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totalWholesale = totalPublic * (1 - WHOLESALE_DISCOUNT);

        // 1. Crear el registro del pedido con estado "Preparando"
        const newOrder: ResellerOrder = {
            id: `PED-${Date.now()}`,
            clientId: currentUser.id,
            clientName: currentUser.name,
            items: [...orderCart],
            total: totalWholesale,
            status: 'Pendiente', // Usamos 'Pendiente' para indicar 'Preparando' al Admin
            date: new Date().toLocaleDateString(),
            deliveryTimeEstimate: 'A confirmar'
        };

        // NOTA: No sumamos stock aún. El stock se suma cuando llega (Entregado) o manualmente. 
        // Por simplificación actual, lo dejaremos para ingreso manual o cuando el admin marque "Entregado" si quisieras automatizarlo más.
        // Por ahora, solo registramos el pedido.

        // 3. Guardar pedido
        onUpdateReseller({
            ...currentUser,
            orders: [newOrder, ...currentUser.orders]
        });

        setIsCreatingOrder(false);
        setOrderCart([]);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Pedidos de Reposición</h1>
                    <p className="text-zinc-400 text-sm">Compra stock al administrador con precio mayorista.</p>
                </div>
                <button 
                    onClick={() => setIsCreatingOrder(true)}
                    className="bg-[#ccff00] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#b3e600] flex items-center gap-2 transition-transform hover:scale-105"
                >
                    <Plus className="w-5 h-5" /> Nuevo Pedido
                </button>
            </div>

            {/* Historial de Pedidos */}
            <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 min-h-[300px]">
                {currentUser.orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full pt-10 text-zinc-500">
                        <Package className="w-16 h-16 mb-4 opacity-20" />
                        <p>No has realizado pedidos de reposición aún.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {currentUser.orders.map(o => (
                            <div key={o.id} className="bg-black/40 p-4 rounded-xl flex justify-between items-center border border-white/5">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-white font-bold">{o.id}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                            o.status === 'Pendiente' ? 'border-yellow-500 text-yellow-500' :
                                            o.status === 'En Camino' ? 'border-blue-500 text-blue-500' :
                                            o.status === 'Entregado' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'
                                        }`}>
                                            {o.status === 'Pendiente' ? 'Preparando' : o.status}
                                        </span>
                                    </div>
                                    <span className="text-zinc-500 text-xs">{o.date} · {o.items.length} productos</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[#ccff00] font-mono font-bold block text-lg">${o.total.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL DE NUEVO PEDIDO */}
            {isCreatingOrder && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-6xl h-[90vh] flex overflow-hidden animate-scale-in shadow-2xl">
                        
                        {/* Izquierda: Catálogo */}
                        <div className="w-2/3 border-r border-white/10 flex flex-col">
                            <div className="p-6 border-b border-white/10 bg-black/20 flex justify-between items-center">
                                <div>
                                    <h3 className="text-white font-bold text-xl">Catálogo Mayorista</h3>
                                    <p className="text-zinc-400 text-xs">Precios sugeridos al público (Tú pagas -30%)</p>
                                </div>
                                <input type="text" placeholder="Buscar producto..." className="bg-black/50 border border-white/10 p-2 rounded-lg text-white outline-none focus:border-[#ccff00] w-64" />
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {adminProducts.map(product => (
                                    <div key={product.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col hover:border-[#ccff00]/30 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                product.brand === 'informa' ? 'bg-[#ccff00] text-black' : 'bg-white text-black'
                                            }`}>{product.brand}</span>
                                            <span className="text-[#ccff00] font-mono text-sm">${product.price.toLocaleString()}</span>
                                        </div>
                                        <img src={product.image} className="w-full h-32 object-cover rounded-lg mb-3 bg-zinc-800" alt={product.name}/>
                                        <h4 className="text-white font-bold text-sm mb-1">{product.name}</h4>
                                        
                                        <div className="mt-auto pt-3">
                                            <button 
                                                onClick={() => addToOrderCart(product)}
                                                className="w-full py-2 bg-white/10 hover:bg-[#ccff00] hover:text-black text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ShoppingCart className="w-3 h-3" /> Agregar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Derecha: Carrito */}
                        <div className="w-1/3 flex flex-col bg-black/40">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-white font-bold">Tu Pedido</h3>
                                <button onClick={() => setIsCreatingOrder(false)} className="text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 space-y-3">
                                {orderCart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center bg-zinc-900/80 p-3 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <img src={item.image} className="w-10 h-10 rounded bg-zinc-800 object-cover" />
                                            <div>
                                                <p className="text-white text-sm font-bold">{item.name}</p>
                                                <p className="text-zinc-500 text-xs">x{item.quantity} un.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFromOrderCart(item.id)} className="text-red-400 hover:bg-red-500/10 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                {orderCart.length === 0 && (
                                    <p className="text-center text-zinc-600 mt-10">Selecciona productos para armar tu pack de reposición.</p>
                                )}
                            </div>

                            <div className="p-6 border-t border-white/10 bg-black/60 space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Subtotal (P. Público)</span>
                                        <span>${orderCart.reduce((acc, i) => acc + (i.price * i.quantity), 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-[#ccff00]">
                                        <span>Descuento Revendedor (30%)</span>
                                        <span>-${(orderCart.reduce((acc, i) => acc + (i.price * i.quantity), 0) * WHOLESALE_DISCOUNT).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                    <span className="text-white font-bold text-lg">Total a Pagar</span>
                                    <span className="text-2xl font-black text-white">
                                        ${(orderCart.reduce((acc, i) => acc + (i.price * i.quantity), 0) * (1 - WHOLESALE_DISCOUNT)).toLocaleString()}
                                    </span>
                                </div>
                                <button 
                                    onClick={confirmOrder}
                                    disabled={orderCart.length === 0}
                                    className="w-full py-4 rounded-xl bg-[#ccff00] text-black font-bold hover:bg-[#b3e600] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
                                >
                                    CONFIRMAR PEDIDO
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResellerOrders;