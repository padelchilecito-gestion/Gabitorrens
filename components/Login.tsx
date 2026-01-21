import React, { useState } from 'react';
import { Reseller } from '../types';
import { ShieldCheck, LogIn, ChevronLeft, User as UserIcon } from 'lucide-react';

interface LoginProps {
    resellers: Reseller[];
    onLoginSuccess: (type: 'admin' | 'reseller' | 'client', data?: any) => void;
    onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ resellers, onLoginSuccess, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        setTimeout(() => {
            // 1. Admin
            if (cleanEmail === 'admin@store.com' && cleanPassword === 'admin123') {
                onLoginSuccess('admin');
                return;
            }

            // 2. Revendedor
            const foundReseller = resellers.find(r => 
                r.email.trim().toLowerCase() === cleanEmail && 
                r.password.trim() === cleanPassword && 
                r.active
            );

            if (foundReseller) {
                onLoginSuccess('reseller', foundReseller);
                return;
            }

            // 3. Cliente (Si no es admin ni revendedor, es un cliente comprando)
            // En un sistema real, aquí consultarías a Firebase/Base de datos de clientes.
            // Para el MVP, permitimos el ingreso si tiene formato de email válido.
            if (cleanEmail.includes('@') && cleanPassword.length >= 4) {
                onLoginSuccess('client', { 
                    id: `C-${Date.now()}`,
                    name: cleanEmail.split('@')[0], // Usamos la parte del email como nombre
                    email: cleanEmail,
                    avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=200&auto=format&fit=crop'
                });
                return;
            }

            // 4. Fallo
            setError('Credenciales incorrectas. Para clientes, use cualquier email válido.');
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen relative bg-[#0a0a0a] flex items-center justify-center p-4 overflow-hidden font-sans">
            
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#ccff00]/10 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <button 
                    onClick={onClose}
                    className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" /> Volver a la tienda
                </button>

                <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl animate-scale-in">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <ShieldCheck className="w-8 h-8 text-[#ccff00]" />
                        </div>
                        <h2 className="text-2xl font-black text-white italic">INICIAR <span className="text-[#ccff00]">SESIÓN</span></h2>
                        <p className="text-zinc-500 text-sm mt-2">Acceso para Administradores, Revendedores y Clientes</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1 ml-1">Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white focus:border-[#ccff00] outline-none transition-colors" 
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1 ml-1">Contraseña</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white focus:border-[#ccff00] outline-none transition-colors" 
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-900/20 border border-red-900/30 rounded-lg text-red-400 text-xs text-center">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-[#ccff00] text-black font-bold py-3 rounded-xl hover:bg-[#b3e600] flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Verificando...' : (
                                <>INGRESAR <LogIn className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-xs text-zinc-500 mb-2">
                            ¿Eres nuevo cliente?
                        </p>
                        <p className="text-xs text-zinc-400">
                            Simplemente ingresa tu email y crea una contraseña para continuar.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;