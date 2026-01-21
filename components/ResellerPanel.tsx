import React, { useState, useEffect } from 'react';
import { Reseller, Product } from '../types';
import { 
    LayoutDashboard, Package, Users, ShoppingCart, MessageSquare, 
    LogOut, DollarSign
} from 'lucide-react';

import ResellerDashboard from './reseller/ResellerDashboard';
import ResellerSales from './reseller/ResellerSales';
import ResellerInventory from './reseller/ResellerInventory';
import ResellerClients from './reseller/ResellerClients';
import ResellerMessages from './reseller/ResellerMessages';
import ResellerOrders from './reseller/ResellerOrders';

interface ResellerPanelProps {
    resellers: Reseller[];
    setResellers: (resellers: Reseller[]) => void;
    onClose: () => void;
    initialUser?: Reseller | null;
    products: Product[];
}

const ResellerPanel: React.FC<ResellerPanelProps> = ({ resellers, setResellers, onClose, initialUser, products }) => {
    const [currentUserId, setCurrentUserId] = useState<string | null>(initialUser?.id || null);
    
    // Buscamos al usuario "en vivo"
    const currentUser = resellers.find(r => r.id === currentUserId) || null;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const [activeTab, setActiveTab] = useState<'dashboard' | 'sales' | 'inventory' | 'clients' | 'orders' | 'messages'>('dashboard');

    // --- EFECTO PARA MARCAR MENSAJES COMO LEÍDOS ---
    useEffect(() => {
        if (currentUser && activeTab === 'messages') {
            const hasUnread = currentUser.messages.some(m => m.sender === 'admin' && !m.read);
            
            if (hasUnread) {
                const updatedReseller = {
                    ...currentUser,
                    messages: currentUser.messages.map(m => 
                        m.sender === 'admin' ? { ...m, read: true } : m
                    )
                };
                
                // Actualizamos el estado global
                const newResellers = resellers.map(r => r.id === currentUser.id ? updatedReseller : r);
                setResellers(newResellers);
            }
        }
    }, [activeTab, currentUser, resellers, setResellers]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const found = resellers.find(r => r.email === email && r.password === password && r.active);
        if (found) {
            setCurrentUserId(found.id);
            setError('');
        } else {
            setError('Credenciales inválidas o cuenta inactiva.');
        }
    };

    const handleLogout = () => {
        setCurrentUserId(null);
        setEmail('');
        setPassword('');
        onClose();
    };

    const updateResellerState = (updatedUser: Reseller) => {
        const newResellers = resellers.map(r => r.id === updatedUser.id ? updatedUser : r);
        setResellers(newResellers);
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen relative bg-[#0a0a0a] flex items-center justify-center p-4 overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#ccff00]/10 rounded-full blur-[100px] animate-blob"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-md animate-scale-in">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-white italic">PORTAL <span className="text-[#ccff00]">PARTNERS</span></h2>
                        <p className="text-zinc-400 mt-2">Acceso exclusivo para revendedores autorizados</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white focus:border-[#ccff00] outline-none" placeholder="Email" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white focus:border-[#ccff00] outline-none" placeholder="Contraseña" />
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <button className="w-full bg-[#ccff00] text-black font-bold py-3 rounded-xl hover:bg-[#b3e600]">INGRESAR</button>
                    </form>
                    <button onClick={onClose} className="w-full mt-6 text-zinc-500 hover:text-white text-sm">Volver a la tienda</button>
                </div>
            </div>
        );
    }

    const unreadMessages = currentUser.messages.filter(m => m.sender === 'admin' && !m.read).length;

    return (
        <div className="min-h-screen relative bg-[#0a0a0a] font-sans text-gray-200 overflow-hidden">
             
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#ccff00]/10 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 flex min-h-screen">
                <aside className="w-64 bg-black/60 backdrop-blur-xl border-r border-white/10 flex flex-col fixed inset-y-0 z-50 shadow-2xl">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white italic">HOLA, <span className="text-[#ccff00] uppercase">{currentUser.name.split(' ')[0]}</span></h2>
                        <p className="text-xs text-zinc-400 mt-1">{currentUser.region}</p>
                    </div>
                    
                    <nav className="flex-1 p-4 space-y-2">
                        {[
                            { id: 'dashboard', icon: LayoutDashboard, label: 'Inicio' },
                            { id: 'sales', icon: DollarSign, label: 'Ventas' },
                            { id: 'inventory', icon: Package, label: 'Mi Stock' },
                            { id: 'orders', icon: ShoppingCart, label: 'Reposición' },
                            { id: 'clients', icon: Users, label: 'Clientes' },
                            { id: 'messages', icon: MessageSquare, label: 'Chat Admin', badge: unreadMessages },
                        ].map(item => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                                    activeTab === item.id 
                                    ? 'bg-[#ccff00]/90 text-black font-bold shadow-[0_0_20px_rgba(204,255,0,0.3)]' 
                                    : 'hover:bg-white/10 hover:text-white text-zinc-400'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </div>
                                {item.badge && item.badge > 0 ? (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                        {item.badge}
                                    </span>
                                ) : null}
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-white/10">
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:bg-white/10 rounded-lg transition-colors">
                            <LogOut className="w-4 h-4" /> Cerrar Sesión
                        </button>
                    </div>
                </aside>

                <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">
                    {activeTab === 'dashboard' && <ResellerDashboard currentUser={currentUser} />}
                    {activeTab === 'sales' && <ResellerSales currentUser={currentUser} onUpdateReseller={updateResellerState} />}
                    {activeTab === 'inventory' && <ResellerInventory currentUser={currentUser} />}
                    {activeTab === 'clients' && <ResellerClients currentUser={currentUser} onUpdateReseller={updateResellerState} />}
                    {activeTab === 'messages' && <ResellerMessages currentUser={currentUser} onUpdateReseller={updateResellerState} />}
                    {activeTab === 'orders' && <ResellerOrders currentUser={currentUser} adminProducts={products} onUpdateReseller={updateResellerState} />}
                </main>
            </div>
        </div>
    );
};

export default ResellerPanel;