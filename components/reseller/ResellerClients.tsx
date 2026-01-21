import React from 'react';
import { Reseller, Client } from '../../types';
import { Plus } from 'lucide-react';

interface ResellerClientsProps {
    currentUser: Reseller;
    onUpdateReseller: (updated: Reseller) => void;
}

const ResellerClients: React.FC<ResellerClientsProps> = ({ currentUser, onUpdateReseller }) => {

    const handleAddClient = () => {
        // En una implementación completa esto sería un Modal, por ahora usamos prompt para mantener la funcionalidad existente simple
        const name = prompt("Nombre del Cliente:");
        if (!name) return;
        
        const newClient: Client = {
            id: `C-${Date.now()}`,
            name,
            phone: '',
            address: '',
            paymentMethod: 'Efectivo',
            currentAccountBalance: 0
        };
        
        onUpdateReseller({ 
            ...currentUser, 
            clients: [...currentUser.clients, newClient] 
        });
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Clientes</h1>
                <button onClick={handleAddClient} className="bg-[#ccff00] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#b3e600] transition-transform hover:scale-105">
                    <Plus className="w-4 h-4"/> Nuevo
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentUser.clients.map(client => (
                    <div key={client.id} className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-[#ccff00]/30 transition-colors shadow-lg group">
                        <h3 className="text-white font-bold text-lg group-hover:text-[#ccff00] transition-colors">{client.name}</h3>
                        <p className="text-zinc-500 text-sm mb-2">{client.phone || 'Sin teléfono'}</p>
                        <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-2">
                            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Saldo Cta.</span>
                            <span className={`font-mono font-bold ${client.currentAccountBalance < 0 ? 'text-red-500' : 'text-green-400'}`}>
                                ${client.currentAccountBalance.toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
                
                {currentUser.clients.length === 0 && (
                    <div className="col-span-full py-12 text-center text-zinc-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                        <p>No tienes clientes registrados.</p>
                        <button onClick={handleAddClient} className="mt-4 text-[#ccff00] text-sm hover:underline">
                            Agregar el primero
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResellerClients;