import React, { useState } from 'react';
import { Client } from '../../types';
import { 
    Plus, Edit2, Trash2
} from 'lucide-react';

interface ClientsTabProps {
    adminClients: Client[];
    setAdminClients: (clients: Client[]) => void;
}

const ClientsTab: React.FC<ClientsTabProps> = ({ adminClients, setAdminClients }) => {
    // Modal State
    const [isEditing, setIsEditing] = useState(false);
    const [currentClient, setCurrentClient] = useState<Partial<Client>>({});

    // --- HANDLERS ---
    const handleSaveClient = () => {
        if (!currentClient.name) return;
        
        const clientToSave: Client = {
            id: currentClient.id || `C-${Date.now()}`,
            name: currentClient.name,
            phone: currentClient.phone || '',
            address: currentClient.address || '',
            paymentMethod: currentClient.paymentMethod || 'Efectivo',
            currentAccountBalance: Number(currentClient.currentAccountBalance) || 0,
            lastOrderDate: currentClient.lastOrderDate || new Date().toLocaleDateString()
        };

        if (currentClient.id) {
            setAdminClients(adminClients.map(c => c.id === clientToSave.id ? clientToSave : c));
        } else {
            setAdminClients([...adminClients, clientToSave]);
        }
        setIsEditing(false);
        setCurrentClient({});
    };

    const handleDeleteClient = (id: string) => {
        if (window.confirm('¿Eliminar este cliente?')) {
            setAdminClients(adminClients.filter(c => c.id !== id));
        }
    };

    return (
        <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-white italic">CLIENTES <span className="text-[#ccff00]">ADMINISTRADOS</span></h1>
                <button 
                    onClick={() => { setCurrentClient({ paymentMethod: 'Efectivo', currentAccountBalance: 0 }); setIsEditing(true); }}
                    className="bg-[#ccff00] text-black px-6 py-2 rounded-lg hover:bg-[#b3e600] flex items-center gap-2 font-bold"
                >
                    <Plus className="w-5 h-5" /> Nuevo Cliente
                </button>
            </div>

             <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-black/40 text-zinc-400 text-sm">
                        <tr>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Teléfono</th>
                            <th className="px-6 py-4">Pago Pref.</th>
                            <th className="px-6 py-4">Saldo Cta. Cte.</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                     <tbody className="divide-y divide-white/5">
                        {adminClients.map(client => (
                            <tr key={client.id} className="hover:bg-white/5">
                                <td className="px-6 py-4 font-bold text-white">{client.name}</td>
                                <td className="px-6 py-4 text-zinc-400">{client.phone}</td>
                                <td className="px-6 py-4 text-zinc-400">{client.paymentMethod}</td>
                                <td className={`px-6 py-4 font-bold ${client.currentAccountBalance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    ${client.currentAccountBalance.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                     <div className="flex justify-end gap-2">
                                        <button onClick={() => { setCurrentClient(client); setIsEditing(true); }} className="text-blue-400 p-2 hover:bg-white/5 rounded"><Edit2 className="w-4 h-4"/></button>
                                        <button onClick={() => handleDeleteClient(client.id)} className="text-red-400 p-2 hover:bg-white/5 rounded"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                     </tbody>
                </table>
             </div>

            {/* CLIENT MODAL */}
            {isEditing && (
                 <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                     <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl animate-scale-in">
                         <h3 className="text-xl font-bold text-white mb-4">Editar Cliente</h3>
                         <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Nombre</label>
                                <input type="text" placeholder="Nombre" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white outline-none focus:border-[#ccff00]" value={currentClient.name || ''} onChange={e => setCurrentClient({...currentClient, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Teléfono</label>
                                <input type="text" placeholder="Teléfono" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white outline-none focus:border-[#ccff00]" value={currentClient.phone || ''} onChange={e => setCurrentClient({...currentClient, phone: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Método de Pago</label>
                                <select 
                                    value={currentClient.paymentMethod}
                                    onChange={(e) => setCurrentClient({...currentClient, paymentMethod: e.target.value as any})}
                                    className="w-full bg-black/50 border border-white/10 p-3 rounded text-white outline-none focus:border-[#ccff00]"
                                >
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Transferencia">Transferencia</option>
                                    <option value="Tarjeta">Tarjeta</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Saldo Cta. Cte.</label>
                                <input type="number" placeholder="Saldo Cta Cte" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white outline-none focus:border-[#ccff00]" value={currentClient.currentAccountBalance || 0} onChange={e => setCurrentClient({...currentClient, currentAccountBalance: Number(e.target.value)})} />
                            </div>
                         </div>
                         <div className="flex justify-end gap-2 mt-6">
                             <button onClick={() => setIsEditing(false)} className="text-zinc-400 px-4 py-2 hover:bg-white/5 rounded-lg">Cancelar</button>
                             <button onClick={handleSaveClient} className="bg-[#ccff00] text-black px-6 py-2 rounded-lg font-bold">Guardar</button>
                         </div>
                     </div>
                 </div>
            )}
        </div>
    );
};

export default ClientsTab;