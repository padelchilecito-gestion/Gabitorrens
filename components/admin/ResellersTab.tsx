import React, { useState } from 'react';
import { Reseller, Product } from '../../types';
import { 
    Plus, Edit2, Trash2
} from 'lucide-react';

interface ResellersTabProps {
    resellers: Reseller[];
    setResellers: (resellers: Reseller[]) => void;
    products: Product[]; // Necesario para asignar stock inicial a nuevos revendedores
}

const ResellersTab: React.FC<ResellersTabProps> = ({ resellers, setResellers, products }) => {
    // Modal State
    const [isEditing, setIsEditing] = useState(false);
    const [currentReseller, setCurrentReseller] = useState<Partial<Reseller>>({});

    // --- HANDLERS ---
    const handleSaveReseller = () => {
        if (!currentReseller.name || !currentReseller.email || !currentReseller.password) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        // LIMPIEZA DE DATOS: Quitamos espacios y normalizamos email
        const cleanName = currentReseller.name.trim();
        const cleanEmail = currentReseller.email.trim().toLowerCase();
        const cleanPassword = currentReseller.password.trim();
        const cleanRegion = currentReseller.region?.trim() || 'General';

        // VALIDACIÓN: Evitar correos duplicados al crear uno nuevo
        if (!currentReseller.id) {
            const exists = resellers.some(r => r.email.toLowerCase() === cleanEmail);
            if (exists) {
                alert("Este correo electrónico ya está registrado.");
                return;
            }
        }
        
        const resellerToSave: Reseller = {
            id: currentReseller.id || `R-${Date.now()}`,
            name: cleanName,
            email: cleanEmail,
            password: cleanPassword,
            region: cleanRegion,
            active: currentReseller.active ?? true,
            // Si es nuevo, inicializamos su stock en 0 para todos los productos
            stock: currentReseller.stock || products.map(p => ({ ...p, stock: 0 })),
            clients: currentReseller.clients || [],
            orders: currentReseller.orders || [],
            messages: currentReseller.messages || [],
            sales: currentReseller.sales || [],
            points: currentReseller.points || 0
        };

        if (currentReseller.id) {
            setResellers(resellers.map(r => r.id === resellerToSave.id ? resellerToSave : r));
        } else {
            setResellers([...resellers, resellerToSave]);
        }
        setIsEditing(false);
        setCurrentReseller({});
    };

    const handleDeleteReseller = (id: string) => {
        if (window.confirm('¿Eliminar este revendedor?')) {
            setResellers(resellers.filter(r => r.id !== id));
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-white italic">RED DE <span className="text-[#ccff00]">REVENDEDORES</span></h1>
                <button 
                    onClick={() => { setCurrentReseller({ active: true, region: 'Norte', points: 0 }); setIsEditing(true); }}
                    className="bg-[#ccff00] text-black px-6 py-2 rounded-lg hover:bg-[#b3e600] flex items-center gap-2 font-bold"
                >
                    <Plus className="w-5 h-5" /> Nuevo Partner
                </button>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-black/40 text-zinc-400 text-sm">
                        <tr>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Región</th>
                            <th className="px-6 py-4">Ventas</th>
                            <th className="px-6 py-4">Puntos</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {resellers.map(reseller => (
                            <tr key={reseller.id} className="hover:bg-white/5">
                                <td className="px-6 py-4 font-bold text-white">{reseller.name}</td>
                                <td className="px-6 py-4 text-zinc-400">{reseller.email}</td>
                                <td className="px-6 py-4"><span className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-xs uppercase">{reseller.region}</span></td>
                                <td className="px-6 py-4 font-mono text-zinc-300">${reseller.sales.reduce((acc, s) => acc + s.total, 0).toLocaleString()}</td>
                                <td className="px-6 py-4 text-[#ccff00] font-bold">{reseller.points || 0}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => { setCurrentReseller(reseller); setIsEditing(true); }} className="text-blue-400 p-2 hover:bg-white/5 rounded"><Edit2 className="w-4 h-4"/></button>
                                        <button onClick={() => handleDeleteReseller(reseller.id)} className="text-red-400 p-2 hover:bg-white/5 rounded"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* RESELLER MODAL */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl animate-scale-in">
                        <h3 className="text-xl font-bold text-white mb-4">Editar Revendedor</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Nombre</label>
                                <input type="text" placeholder="Nombre" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white outline-none focus:border-[#ccff00]" value={currentReseller.name || ''} onChange={e => setCurrentReseller({...currentReseller, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Email</label>
                                <input type="email" placeholder="Email" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white outline-none focus:border-[#ccff00]" value={currentReseller.email || ''} onChange={e => setCurrentReseller({...currentReseller, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Contraseña</label>
                                <input type="text" placeholder="Contraseña" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white outline-none focus:border-[#ccff00]" value={currentReseller.password || ''} onChange={e => setCurrentReseller({...currentReseller, password: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Región</label>
                                <input type="text" placeholder="Región" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white outline-none focus:border-[#ccff00]" value={currentReseller.region || ''} onChange={e => setCurrentReseller({...currentReseller, region: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setIsEditing(false)} className="text-zinc-400 px-4 py-2 hover:bg-white/5 rounded-lg">Cancelar</button>
                            <button onClick={handleSaveReseller} className="bg-[#ccff00] text-black px-6 py-2 rounded-lg font-bold">Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResellersTab;