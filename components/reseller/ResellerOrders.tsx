import React from 'react';
import { Reseller } from '../../types';

interface ResellerOrdersProps {
    currentUser: Reseller;
}

const ResellerOrders: React.FC<ResellerOrdersProps> = ({ currentUser }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-white">Pedidos de Reposición</h1>
            <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-8 text-center min-h-[300px]">
                {currentUser.orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full pt-10">
                        <p className="text-zinc-500 mb-2">No has realizado pedidos de reposición aún.</p>
                        <p className="text-xs text-zinc-600">Contacta al administrador para reponer stock.</p>
                    </div>
                ) : (
                    <div className="space-y-3 text-left">
                        {currentUser.orders.map(o => (
                            <div key={o.id} className="bg-black/40 p-4 rounded-xl flex justify-between items-center border border-white/5">
                                <div>
                                    <span className="text-white font-bold block">{o.id}</span>
                                    <span className="text-zinc-500 text-xs">{o.date}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[#ccff00] font-mono block">${o.total.toLocaleString()}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                        o.status === 'Pendiente' ? 'bg-yellow-500/20 text-yellow-500' :
                                        o.status === 'En Camino' ? 'bg-blue-500/20 text-blue-500' :
                                        o.status === 'Entregado' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                    }`}>{o.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResellerOrders;