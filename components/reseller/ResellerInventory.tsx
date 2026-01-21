import React, { useState } from 'react';
import { Reseller } from '../../types';
import { Search } from 'lucide-react';

interface ResellerInventoryProps {
    currentUser: Reseller;
}

const ResellerInventory: React.FC<ResellerInventoryProps> = ({ currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStock = currentUser.stock.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mi Stock Disponible</h1>
                    <p className="text-zinc-400 text-sm">Productos listos para vender a tus clientes.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Buscar..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#ccff00] w-64"
                    />
                </div>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-black/40 text-zinc-400 text-sm">
                        <tr>
                            <th className="px-6 py-4">Producto</th>
                            <th className="px-6 py-4">Stock Local</th>
                            <th className="px-6 py-4">Precio Sug.</th>
                            <th className="px-6 py-4 text-right">Valor Total Stock</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredStock.map(product => {
                            const hasStock = product.stock > 0;
                            return (
                                <tr key={product.id} className={`transition-colors ${hasStock ? 'hover:bg-white/5' : 'opacity-50 grayscale bg-red-900/5'}`}>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <img src={product.image} className="w-8 h-8 rounded bg-zinc-800 object-cover" alt={product.name} />
                                        <div>
                                            <span className="font-bold text-white block">{product.name}</span>
                                            {!hasStock && <span className="text-[10px] text-red-400 font-bold uppercase">Sin Stock</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-mono font-bold px-2 py-1 rounded ${
                                            hasStock 
                                            ? (product.stock < 5 ? 'text-yellow-500 bg-yellow-500/10' : 'text-[#ccff00] bg-[#ccff00]/10')
                                            : 'text-red-500 bg-red-500/10'
                                        }`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400">${product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-mono text-zinc-500">${(product.price * product.stock).toLocaleString()}</td>
                                </tr>
                            );
                        })}
                        {filteredStock.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                    No se encontraron productos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResellerInventory;