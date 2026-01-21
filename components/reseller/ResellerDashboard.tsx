import React from 'react';
import { Reseller } from '../../types';
import { TrendingUp, ShoppingCart, Award } from 'lucide-react';

interface ResellerDashboardProps {
    currentUser: Reseller;
}

const ResellerDashboard: React.FC<ResellerDashboardProps> = ({ currentUser }) => {
    const totalRevenue = currentUser.sales.reduce((acc, s) => acc + s.total, 0);

    return (
        <div className="animate-fade-in space-y-8">
            <h1 className="text-3xl font-bold text-white">Resumen General</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-green-900/40 rounded-full text-green-400"><TrendingUp className="w-8 h-8" /></div>
                        <div>
                            <p className="text-zinc-400 text-sm">Ganancias Totales</p>
                            <h3 className="text-2xl font-black text-white">${totalRevenue.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-blue-900/40 rounded-full text-blue-400"><ShoppingCart className="w-8 h-8" /></div>
                        <div>
                            <p className="text-zinc-400 text-sm">Ventas Realizadas</p>
                            <h3 className="text-2xl font-black text-white">{currentUser.sales.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-yellow-900/40 rounded-full text-yellow-400"><Award className="w-8 h-8" /></div>
                        <div>
                            <p className="text-zinc-400 text-sm">Puntos Acumulados</p>
                            <h3 className="text-2xl font-black text-white">{currentUser.points || 0} pts</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Últimas Ventas</h3>
                {currentUser.sales.length === 0 ? (
                    <p className="text-zinc-500">Aún no has registrado ventas.</p>
                ) : (
                    <div className="space-y-2">
                        {currentUser.sales.slice(0, 5).map(sale => (
                            <div key={sale.id} className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                                <div>
                                    <p className="text-white font-bold">{sale.clientName}</p>
                                    <p className="text-xs text-zinc-400">{sale.date}</p>
                                </div>
                                <span className="text-[#ccff00] font-bold">${sale.total.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResellerDashboard;