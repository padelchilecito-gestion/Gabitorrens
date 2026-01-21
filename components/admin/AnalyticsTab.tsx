import React from 'react';
import { Product, Reseller } from '../../types';
import { 
    DollarSign, Users, Package, BarChart3, TrendingUp 
} from 'lucide-react';

interface AnalyticsTabProps {
    products: Product[];
    resellers: Reseller[];
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ products, resellers }) => {
    return (
        <div className="animate-fade-in space-y-8">
            <h1 className="text-3xl font-black text-white italic">ESTADÍSTICAS <span className="text-[#ccff00]">GLOBALES</span></h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                    <div className="flex gap-4 items-center">
                        <div className="p-3 bg-green-500/20 text-green-500 rounded-lg"><DollarSign className="w-8 h-8" /></div>
                        <div>
                            <p className="text-zinc-500 text-sm">Valor Inventario</p>
                            <h3 className="text-2xl font-bold text-white">${products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                    <div className="flex gap-4 items-center">
                        <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg"><Users className="w-8 h-8" /></div>
                        <div>
                            <p className="text-zinc-500 text-sm">Total Revendedores</p>
                            <h3 className="text-2xl font-bold text-white">{resellers.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                    <div className="flex gap-4 items-center">
                        <div className="p-3 bg-purple-500/20 text-purple-500 rounded-lg"><Package className="w-8 h-8" /></div>
                        <div>
                            <p className="text-zinc-500 text-sm">Productos Activos</p>
                            <h3 className="text-2xl font-bold text-white">{products.filter(p => p.active).length}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 h-64 flex flex-col justify-center items-center">
                        <BarChart3 className="w-16 h-16 text-zinc-700 mb-2" />
                        <p className="text-zinc-500">Gráfico de Ventas (Próximamente)</p>
                    </div>
                    <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 h-64 flex flex-col justify-center items-center">
                        <TrendingUp className="w-16 h-16 text-zinc-700 mb-2" />
                        <p className="text-zinc-500">Rendimiento por Región (Próximamente)</p>
                    </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;