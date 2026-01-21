import React, { useState } from 'react';
import { Reseller, CartItem, Product, Sale } from '../../types';
import { Plus, Trash2, X } from 'lucide-react';

interface ResellerSalesProps {
    currentUser: Reseller;
    onUpdateReseller: (updated: Reseller) => void;
}

const ResellerSales: React.FC<ResellerSalesProps> = ({ currentUser, onUpdateReseller }) => {
    const [isMakingSale, setIsMakingSale] = useState(false);
    const [saleCart, setSaleCart] = useState<CartItem[]>([]);
    const [selectedClientForSale, setSelectedClientForSale] = useState('');

    // --- SALES LOGIC ---
    const addToSaleCart = (product: Product) => {
        if (product.stock <= 0) return;
        setSaleCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev;
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromSaleCart = (id: string) => {
        setSaleCart(prev => prev.filter(p => p.id !== id));
    };

    const confirmSale = () => {
        if (!selectedClientForSale || saleCart.length === 0) return;
        
        const totalAmount = saleCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const client = currentUser.clients.find(c => c.id === selectedClientForSale);

        // 1. Create Sale Record
        const newSale: Sale = {
            id: `V-${Date.now()}`,
            clientId: selectedClientForSale,
            clientName: client?.name || 'Cliente',
            date: new Date().toLocaleDateString(),
            items: [...saleCart],
            total: totalAmount,
            paymentMethod: client?.paymentMethod || 'Efectivo'
        };

        // 2. Update Stock (Reduce local stock)
        const updatedStock = currentUser.stock.map(prod => {
            const cartItem = saleCart.find(c => c.id === prod.id);
            if (cartItem) {
                return { ...prod, stock: prod.stock - cartItem.quantity };
            }
            return prod;
        });

        // 3. Update Points (Example: 1 point per $1000)
        const newPoints = (currentUser.points || 0) + Math.floor(totalAmount / 1000);

        // 4. Update Global State
        onUpdateReseller({
            ...currentUser,
            sales: [newSale, ...currentUser.sales],
            stock: updatedStock,
            points: newPoints
        });

        // Reset
        setIsMakingSale(false);
        setSaleCart([]);
        setSelectedClientForSale('');
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Registro de Ventas</h1>
                <button onClick={() => setIsMakingSale(true)} className="bg-[#ccff00] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#b3e600] flex items-center gap-2 transition-transform hover:scale-105">
                    <Plus className="w-5 h-5" /> Nueva Venta
                </button>
            </div>
            
            {/* Sales History Table */}
            <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-black/40 text-zinc-400 text-sm">
                        <tr>
                            <th className="px-6 py-4">ID Venta</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Items</th>
                            <th className="px-6 py-4">Método</th>
                            <th className="px-6 py-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {currentUser.sales.map(sale => (
                            <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono text-zinc-500 text-xs">{sale.id}</td>
                                <td className="px-6 py-4 font-bold text-white">{sale.clientName}</td>
                                <td className="px-6 py-4 text-zinc-400">{sale.date}</td>
                                <td className="px-6 py-4 text-zinc-300 text-sm">{sale.items.length} productos</td>
                                <td className="px-6 py-4 text-zinc-400 text-sm">{sale.paymentMethod}</td>
                                <td className="px-6 py-4 text-right font-bold text-[#ccff00]">${sale.total.toLocaleString()}</td>
                            </tr>
                        ))}
                        {currentUser.sales.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                                    No hay ventas registradas aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* NEW SALE MODAL */}
            {isMakingSale && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-4xl h-[85vh] flex overflow-hidden animate-scale-in shadow-2xl">
                        {/* Left: Product Selection */}
                        <div className="w-2/3 border-r border-white/10 flex flex-col">
                            <div className="p-4 border-b border-white/10 bg-black/20">
                                <h3 className="text-white font-bold mb-2">Seleccionar Productos del Stock</h3>
                                <input type="text" placeholder="Buscar producto..." className="w-full bg-black/50 border border-white/10 p-2 rounded-lg text-white outline-none focus:border-[#ccff00]" />
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
                                {currentUser.stock.map(product => (
                                    <button 
                                        key={product.id} 
                                        onClick={() => addToSaleCart(product)}
                                        disabled={product.stock === 0}
                                        className={`text-left p-3 rounded-xl border transition-all flex gap-3 group ${
                                            product.stock === 0 
                                            ? 'opacity-50 border-white/5 bg-black/20' 
                                            : 'border-white/10 bg-black/40 hover:border-[#ccff00]/50 hover:bg-white/5'
                                        }`}
                                    >
                                        <img src={product.image} className="w-12 h-12 rounded bg-zinc-800 object-cover" alt={product.name} />
                                        <div>
                                            <p className="text-white font-bold text-sm line-clamp-1 group-hover:text-[#ccff00] transition-colors">{product.name}</p>
                                            <p className="text-zinc-400 text-xs font-mono">${product.price.toLocaleString()}</p>
                                            <p className={`text-[10px] ${product.stock < 5 ? 'text-red-400' : 'text-zinc-500'}`}>Stock: {product.stock}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Cart & Checkout */}
                        <div className="w-1/3 flex flex-col bg-black/40">
                            <div className="p-4 border-b border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-white font-bold">Nueva Venta</h3>
                                    <button onClick={() => setIsMakingSale(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
                                </div>
                                <select 
                                    value={selectedClientForSale}
                                    onChange={(e) => setSelectedClientForSale(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 p-2 rounded text-white mb-2 outline-none focus:border-[#ccff00]"
                                >
                                    <option value="">Seleccionar Cliente</option>
                                    {currentUser.clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {saleCart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm bg-white/5 p-2 rounded border border-white/5">
                                        <div>
                                            <p className="text-white font-medium">{item.name}</p>
                                            <p className="text-zinc-500 text-xs">x{item.quantity} · <span className="text-[#ccff00]">${(item.price * item.quantity).toLocaleString()}</span></p>
                                        </div>
                                        <button onClick={() => removeFromSaleCart(item.id)} className="text-red-400 hover:text-red-300 p-1 hover:bg-white/10 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                {saleCart.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-40 text-zinc-600">
                                        <p>Carrito vacío</p>
                                        <p className="text-xs">Selecciona productos de la izquierda</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-white/10 bg-black/60">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-zinc-400">Total</span>
                                    <span className="text-2xl font-bold text-[#ccff00]">${saleCart.reduce((acc, i) => acc + (i.price * i.quantity), 0).toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => setIsMakingSale(false)} className="py-3 rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5 font-medium">Cancelar</button>
                                    <button 
                                        onClick={confirmSale}
                                        disabled={!selectedClientForSale || saleCart.length === 0}
                                        className="py-3 rounded-lg bg-[#ccff00] text-black font-bold hover:bg-[#b3e600] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        Confirmar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResellerSales;