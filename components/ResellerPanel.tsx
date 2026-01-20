
import React, { useState } from 'react';
import { Reseller, Product, Client, Message, ResellerOrder, CartItem, Sale } from '../types';
import { 
    LayoutDashboard, Package, Users, ShoppingCart, MessageSquare, 
    Settings, LogOut, ChevronRight, Plus, Search, DollarSign, 
    Calendar, MapPin, Send, Check, BarChart, TrendingUp, Award, X, Trash2
} from 'lucide-react';

interface ResellerPanelProps {
    resellers: Reseller[];
    setResellers: (resellers: Reseller[]) => void;
    onClose: () => void;
    initialUser?: Reseller | null; // New prop to receive logged user
}

const ResellerPanel: React.FC<ResellerPanelProps> = ({ resellers, setResellers, onClose, initialUser }) => {
    // Initialize with passed user if available
    const [currentUser, setCurrentUser] = useState<Reseller | null>(initialUser || null);
    
    // Internal login states (fallback if no initialUser)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Dashboard States
    const [activeTab, setActiveTab] = useState<'dashboard' | 'sales' | 'inventory' | 'clients' | 'orders' | 'messages' | 'settings'>('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    
    // New Sale State
    const [isMakingSale, setIsMakingSale] = useState(false);
    const [saleCart, setSaleCart] = useState<CartItem[]>([]);
    const [selectedClientForSale, setSelectedClientForSale] = useState('');

    // --- LOGIN LOGIC (Only used if accessing directly without initialUser) ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const found = resellers.find(r => r.email === email && r.password === password && r.active);
        if (found) {
            setCurrentUser(found);
            setError('');
        } else {
            setError('Credenciales inválidas o cuenta inactiva.');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setEmail('');
        setPassword('');
        onClose(); // Go back to main app/login on logout
    };

    // --- DATA UPDATERS ---
    const updateResellerState = (updatedUser: Reseller) => {
        const newResellers = resellers.map(r => r.id === updatedUser.id ? updatedUser : r);
        setResellers(newResellers);
        setCurrentUser(updatedUser);
    };

    const handleUpdateStock = (productId: string, newStock: number) => {
        if (!currentUser) return;
        const newStockList = currentUser.stock.map(p => 
            p.id === productId ? { ...p, stock: newStock } : p
        );
        updateResellerState({ ...currentUser, stock: newStockList });
    };

    const handleAddClient = () => {
        if (!currentUser) return;
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
        
        updateResellerState({ 
            ...currentUser, 
            clients: [...currentUser.clients, newClient] 
        });
    };

    const handleSendMessage = (text: string) => {
        if (!currentUser || !text.trim()) return;
        const msg: Message = {
            id: `M-${Date.now()}`,
            sender: 'reseller',
            content: text,
            timestamp: new Date().toLocaleString(),
            read: false
        };
        updateResellerState({
            ...currentUser,
            messages: [...currentUser.messages, msg]
        });
    };

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
        if (!currentUser || !selectedClientForSale || saleCart.length === 0) return;
        
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
        updateResellerState({
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

    // --- RENDERERS ---

    if (!currentUser) {
        // Fallback internal login if not passed via props (Should be covered by Login.tsx now, but kept for safety)
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

    const totalRevenue = currentUser.sales.reduce((acc, s) => acc + s.total, 0);

    return (
        <div className="min-h-screen relative bg-[#0a0a0a] font-sans text-gray-200 overflow-hidden">
             
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#ccff00]/10 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 flex min-h-screen">
                {/* Sidebar */}
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
                            { id: 'messages', icon: MessageSquare, label: 'Chat Admin' },
                        ].map(item => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                    activeTab === item.id 
                                    ? 'bg-[#ccff00]/90 text-black font-bold shadow-[0_0_20px_rgba(204,255,0,0.3)]' 
                                    : 'hover:bg-white/10 hover:text-white text-zinc-400'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-white/10">
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:bg-white/10 rounded-lg transition-colors">
                            <LogOut className="w-4 h-4" /> Cerrar Sesión
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="ml-64 flex-1 p-8">
                    
                    {activeTab === 'dashboard' && (
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
                    )}

                    {activeTab === 'sales' && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-8">
                                <h1 className="text-3xl font-bold text-white">Registro de Ventas</h1>
                                <button onClick={() => setIsMakingSale(true)} className="bg-[#ccff00] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#b3e600] flex items-center gap-2">
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
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-bold text-white">Mi Stock Disponible</h1>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                                    <input 
                                        type="text" 
                                        placeholder="Buscar..." 
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#ccff00]"
                                    />
                                </div>
                            </div>

                            <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                                <table className="w-full text-left">
                                    <thead className="bg-black/40 text-zinc-400 text-sm">
                                        <tr>
                                            <th className="px-6 py-4">Producto</th>
                                            <th className="px-6 py-4">Stock</th>
                                            <th className="px-6 py-4">Precio Sug.</th>
                                            <th className="px-6 py-4 text-right">Valor Total Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {currentUser.stock.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                                            <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <img src={product.image} className="w-8 h-8 rounded bg-zinc-800 object-cover" />
                                                    <span className="font-bold text-white">{product.name}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-mono font-bold ${product.stock < 5 ? 'text-red-500' : 'text-white'}`}>{product.stock}</span>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-400">${product.price.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right font-mono text-zinc-500">${(product.price * product.stock).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* NEW SALE MODAL */}
                    {isMakingSale && (
                        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-4xl h-[85vh] flex overflow-hidden animate-scale-in">
                                {/* Left: Product Selection */}
                                <div className="w-2/3 border-r border-white/10 flex flex-col">
                                    <div className="p-4 border-b border-white/10 bg-black/20">
                                        <h3 className="text-white font-bold mb-2">Seleccionar Productos del Stock</h3>
                                        <input type="text" placeholder="Buscar producto..." className="w-full bg-black/50 border border-white/10 p-2 rounded text-white" />
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
                                        {currentUser.stock.map(product => (
                                            <button 
                                                key={product.id} 
                                                onClick={() => addToSaleCart(product)}
                                                disabled={product.stock === 0}
                                                className={`text-left p-3 rounded-xl border transition-all flex gap-3 ${
                                                    product.stock === 0 
                                                    ? 'opacity-50 border-white/5 bg-black/20' 
                                                    : 'border-white/10 bg-black/40 hover:border-[#ccff00]/50 hover:bg-white/5'
                                                }`}
                                            >
                                                <img src={product.image} className="w-12 h-12 rounded bg-zinc-800 object-cover" />
                                                <div>
                                                    <p className="text-white font-bold text-sm line-clamp-1">{product.name}</p>
                                                    <p className="text-[#ccff00] text-xs font-mono">${product.price.toLocaleString()}</p>
                                                    <p className="text-zinc-500 text-[10px]">Stock: {product.stock}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Cart & Checkout */}
                                <div className="w-1/3 flex flex-col bg-black/40">
                                    <div className="p-4 border-b border-white/10">
                                        <h3 className="text-white font-bold mb-4">Detalle de Venta</h3>
                                        <select 
                                            value={selectedClientForSale}
                                            onChange={(e) => setSelectedClientForSale(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 p-2 rounded text-white mb-2"
                                        >
                                            <option value="">Seleccionar Cliente</option>
                                            {currentUser.clients.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                        {saleCart.map(item => (
                                            <div key={item.id} className="flex justify-between items-center text-sm">
                                                <div>
                                                    <p className="text-white">{item.name}</p>
                                                    <p className="text-zinc-500">x{item.quantity} · ${(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                                <button onClick={() => removeFromSaleCart(item.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                        {saleCart.length === 0 && <p className="text-center text-zinc-600 mt-10">Carrito vacío</p>}
                                    </div>

                                    <div className="p-4 border-t border-white/10 bg-black/60">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-zinc-400">Total</span>
                                            <span className="text-2xl font-bold text-[#ccff00]">${saleCart.reduce((acc, i) => acc + (i.price * i.quantity), 0).toLocaleString()}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button onClick={() => setIsMakingSale(false)} className="py-3 rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5">Cancelar</button>
                                            <button 
                                                onClick={confirmSale}
                                                disabled={!selectedClientForSale || saleCart.length === 0}
                                                className="py-3 rounded-lg bg-[#ccff00] text-black font-bold hover:bg-[#b3e600] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Confirmar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'clients' && (
                        <div className="animate-fade-in space-y-6">
                            <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-bold text-white">Clientes</h1>
                                <button onClick={handleAddClient} className="bg-[#ccff00] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#b3e600]"><Plus className="w-4 h-4"/> Nuevo</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentUser.clients.map(client => (
                                    <div key={client.id} className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-white font-bold text-lg">{client.name}</h3>
                                        <p className="text-zinc-500 text-sm mb-2">{client.phone || 'Sin teléfono'}</p>
                                        <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-2">
                                            <span className="text-xs text-zinc-400">Saldo</span>
                                            <span className={`font-mono font-bold ${client.currentAccountBalance < 0 ? 'text-red-500' : 'text-green-400'}`}>${client.currentAccountBalance}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'messages' && (
                        <div className="h-[calc(100vh-8rem)] flex flex-col bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden animate-fade-in">
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {currentUser.messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'reseller' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-4 rounded-xl ${msg.sender === 'reseller' ? 'bg-[#ccff00]/90 text-black' : 'bg-black/60 text-white'}`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <span className="text-[10px] block mt-1 opacity-60">{msg.timestamp}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-white/5 bg-black/20">
                                <form onSubmit={(e) => { e.preventDefault(); const input = (e.target as any).elements.msgInput; handleSendMessage(input.value); input.value=''; }} className="flex gap-2">
                                    <input name="msgInput" type="text" placeholder="Escribe un mensaje..." className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ccff00] outline-none" />
                                    <button className="bg-[#ccff00] p-3 rounded-xl text-black"><Send className="w-5 h-5" /></button>
                                </form>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'orders' && (
                         <div className="space-y-6 animate-fade-in">
                            <h1 className="text-3xl font-bold text-white">Pedidos de Reposición</h1>
                            <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-8 text-center">
                                <p className="text-zinc-500">Módulo de pedidos al administrador (Visualización simple)</p>
                                {/* Simple visualization of orders */}
                                <div className="mt-4 space-y-2">
                                    {currentUser.orders.map(o => (
                                        <div key={o.id} className="bg-black/40 p-3 rounded flex justify-between">
                                            <span className="text-white">{o.id}</span>
                                            <span className="text-[#ccff00]">${o.total}</span>
                                            <span className="text-zinc-400">{o.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ResellerPanel;
