import React, { useState } from 'react';
import { Reseller, ResellerOrder } from '../../types';
import { Truck, CheckCircle, Clock, Trash2, Package } from 'lucide-react';

interface OrdersTabProps {
    resellers: Reseller[];
    setResellers: (resellers: Reseller[]) => void;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ resellers, setResellers }) => {
    const [filterStatus, setFilterStatus] = useState<'Todos' | 'Pendiente' | 'En Camino' | 'Entregado'>('Todos');

    // Función para actualizar el estado de un pedido específico
    const updateOrderStatus = (resellerId: string, orderId: string, newStatus: ResellerOrder['status']) => {
        const updatedResellers = resellers.map(r => {
            if (r.id === resellerId) {
                return {
                    ...r,
                    orders: r.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
                };
            }
            return r;
        });
        setResellers(updatedResellers);
    };

    // Función para eliminar un pedido (Solo si está entregado)
    const deleteOrder = (resellerId: string, orderId: string) => {
        if (!window.confirm('¿Estás seguro de eliminar este pedido del historial? Esta acción no se puede deshacer.')) return;
        
        const updatedResellers = resellers.map(r => {
            if (r.id === resellerId) {
                return {
                    ...r,
                    orders: r.orders.filter(o => o.id !== orderId)
                };
            }
            return r;
        });
        setResellers(updatedResellers);
    };

    // Aplanar y ordenar todos los pedidos de todos los revendedores
    const allOrders = resellers.flatMap(r => 
        r.orders.map(o => ({ ...o, resellerId: r.id, resellerName: r.name }))
    ).filter(o => {
        if (filterStatus !== 'Todos' && o.status !== filterStatus) return false;
        return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Más recientes primero

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pendiente': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'En Camino': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'Entregado': return 'text-green-500 bg-green-500/10 border-green-500/20';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic">GESTIÓN DE <span className="text-[#ccff00]">PEDIDOS</span></h1>
                    <p className="text-zinc-400 text-sm">Controla los envíos a tus revendedores.</p>
                </div>
                
                {/* Filtros */}
                <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                    {['Todos', 'Pendiente', 'En Camino', 'Entregado'].map(status => (
                            <button
                            key={status}
                            onClick={() => setFilterStatus(status as any)}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${
                                filterStatus === status 
                                ? 'bg-zinc-700 text-white shadow' 
                                : 'text-zinc-500 hover:text-white'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista de Pedidos */}
            <div className="grid gap-4">
                {allOrders.map(order => (
                    <div key={order.id} className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-[#ccff00]/20 transition-colors">
                        
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className={`p-4 rounded-xl border ${getStatusColor(order.status)}`}>
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-white font-bold text-lg">{order.resellerName}</h3>
                                    <span className="text-zinc-500 text-xs bg-black/30 px-2 py-0.5 rounded font-mono">{order.id}</span>
                                </div>
                                <p className="text-zinc-400 text-sm flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> {order.date} 
                                    <span className="text-zinc-600">|</span> 
                                    {order.items.length} items
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-zinc-500 uppercase tracking-wider">Total Pedido</span>
                            <span className="text-2xl font-black text-[#ccff00]">${order.total.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            {/* Acciones según Estado */}
                            {order.status === 'Pendiente' && (
                                <button 
                                    onClick={() => updateOrderStatus(order.resellerId, order.id, 'En Camino')}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
                                >
                                    <Truck className="w-4 h-4" /> Despachar
                                </button>
                            )}
                            
                            {order.status === 'En Camino' && (
                                <button 
                                    onClick={() => updateOrderStatus(order.resellerId, order.id, 'Entregado')}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold transition-colors"
                                >
                                    <CheckCircle className="w-4 h-4" /> Entregado
                                </button>
                            )}

                            {/* Botón de Eliminar (Solo si está entregado) */}
                            {order.status === 'Entregado' && (
                                <button 
                                    onClick={() => deleteOrder(order.resellerId, order.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-900/10 hover:bg-red-900/30 text-red-400 border border-red-900/30 rounded-lg text-xs font-bold transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" /> Eliminar
                                </button>
                            )}
                            
                            {/* Etiqueta de Estado */}
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                    </div>
                ))}

                {allOrders.length === 0 && (
                    <div className="text-center py-20 text-zinc-500 bg-zinc-900/20 rounded-2xl border border-white/5">
                        <p>No hay pedidos en esta categoría.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersTab;