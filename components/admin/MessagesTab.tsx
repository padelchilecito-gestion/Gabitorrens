import React, { useState } from 'react';
import { Reseller, Message } from '../../types';
import { 
    Plus, Send, Users, Megaphone, Mail, X 
} from 'lucide-react';

interface MessagesTabProps {
    resellers: Reseller[];
    setResellers: (resellers: Reseller[]) => void;
}

const MessagesTab: React.FC<MessagesTabProps> = ({ resellers, setResellers }) => {
    // Chat State
    const [selectedChatResellerId, setSelectedChatResellerId] = useState<string | null>(null);
    const [adminMessageInput, setAdminMessageInput] = useState('');

    // Modal State
    const [isComposing, setIsComposing] = useState(false);
    const [composeType, setComposeType] = useState<'private' | 'broadcast'>('private');
    const [composeRecipientId, setComposeRecipientId] = useState<string>('');
    const [composeContent, setComposeContent] = useState('');

    // --- HANDLERS ---

    const handleSelectChat = (resellerId: string) => {
        setSelectedChatResellerId(resellerId);
        // Marcar como leídos los mensajes de este revendedor
        const updatedResellers = resellers.map(r => {
            if (r.id === resellerId) {
                return {
                    ...r,
                    messages: r.messages.map(m => m.sender === 'reseller' ? { ...m, read: true } : m)
                };
            }
            return r;
        });
        setResellers(updatedResellers);
    };

    const handleSendAdminMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedChatResellerId || !adminMessageInput.trim()) return;

        const newMessage: Message = {
            id: `M-${Date.now()}`,
            sender: 'admin',
            content: adminMessageInput,
            timestamp: new Date().toLocaleString(),
            read: false
        };

        const updatedResellers = resellers.map(r => {
            if (r.id === selectedChatResellerId) {
                return { ...r, messages: [...r.messages, newMessage] };
            }
            return r;
        });

        setResellers(updatedResellers);
        setAdminMessageInput('');
    };

    const handleComposeSend = () => {
        if (!composeContent.trim()) return;
        if (composeType === 'private' && !composeRecipientId) return;
    
        const newMessage: Message = {
            id: `M-${Date.now()}`,
            sender: 'admin',
            content: composeContent,
            timestamp: new Date().toLocaleString(),
            read: false
        };
    
        let updatedResellers;
    
        if (composeType === 'broadcast') {
            // Enviar a todos
            updatedResellers = resellers.map(r => ({
                ...r,
                messages: [...r.messages, newMessage]
            }));
        } else {
            // Enviar a uno
            updatedResellers = resellers.map(r => {
                if (r.id === composeRecipientId) {
                    return { ...r, messages: [...r.messages, newMessage] };
                }
                return r;
            });
            // Si no estábamos en ese chat, lo abrimos
            setSelectedChatResellerId(composeRecipientId);
        }
    
        setResellers(updatedResellers);
        setIsComposing(false);
        setComposeContent('');
        setComposeRecipientId('');
    };

    return (
        <div className="animate-fade-in flex flex-col h-[calc(100vh-12rem)] rounded-2xl overflow-hidden relative">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-xl">Centro de Mensajes</h3>
                <button 
                    onClick={() => setIsComposing(true)}
                    className="bg-[#ccff00] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#b3e600] flex items-center gap-2 transition-transform hover:scale-105"
                >
                    <Plus className="w-4 h-4" /> Nuevo Mensaje
                </button>
            </div>

            {/* Layout Principal */}
            <div className="flex flex-1 bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                
                {/* Sidebar Lista de Chats */}
                <div className="w-1/3 border-r border-white/5 bg-black/20 flex flex-col">
                    <div className="p-4 border-b border-white/5">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider text-zinc-500">Bandeja de Entrada</h3>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {resellers.map(r => {
                            const unread = r.messages.filter(m => m.sender === 'reseller' && !m.read).length;
                            const lastMsg = r.messages[r.messages.length - 1];
                            return (
                                <button 
                                    key={r.id} 
                                    onClick={() => handleSelectChat(r.id)}
                                    className={`w-full text-left p-4 hover:bg-white/5 transition-colors border-b border-white/5 ${
                                        selectedChatResellerId === r.id ? 'bg-[#ccff00]/10 border-l-4 border-l-[#ccff00]' : ''
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`font-bold ${selectedChatResellerId === r.id ? 'text-[#ccff00]' : 'text-white'}`}>
                                            {r.name}
                                        </span>
                                        {unread > 0 && (
                                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                                                {unread}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs truncate ${unread > 0 ? 'text-white font-medium' : 'text-zinc-500'}`}>
                                        {lastMsg ? lastMsg.content : 'Sin mensajes'}
                                    </p>
                                </button>
                            );
                        })}
                        {resellers.length === 0 && (
                            <div className="p-8 text-center text-zinc-500 text-sm">
                                No hay revendedores registrados.
                            </div>
                        )}
                    </div>
                </div>

                {/* Área de Chat */}
                <div className="w-2/3 flex flex-col bg-black/40 relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ccff00 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {selectedChatResellerId ? (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
                                {resellers.find(r => r.id === selectedChatResellerId)?.messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] p-4 rounded-2xl shadow-lg ${
                                            msg.sender === 'admin' 
                                            ? 'bg-[#ccff00] text-black rounded-tr-none' 
                                            : 'bg-zinc-800 text-white rounded-tl-none border border-white/10'
                                        }`}>
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                            <span className={`text-[10px] block mt-1 opacity-60 text-right ${msg.sender === 'admin' ? 'text-black/70' : 'text-zinc-400'}`}>
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {resellers.find(r => r.id === selectedChatResellerId)?.messages.length === 0 && (
                                    <div className="flex h-full items-center justify-center opacity-30">
                                        <p>Comienza la conversación...</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Input Area */}
                            <div className="p-4 border-t border-white/10 bg-black/60 backdrop-blur-md relative z-20">
                                <form onSubmit={handleSendAdminMessage} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={adminMessageInput}
                                        onChange={(e) => setAdminMessageInput(e.target.value)}
                                        placeholder="Escribe un mensaje..."
                                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ccff00] outline-none transition-colors"
                                    />
                                    <button className="bg-[#ccff00] text-black p-3 rounded-xl hover:bg-[#b3e600] shadow-lg transition-transform hover:scale-105">
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 relative z-10">
                            <Mail className="w-16 h-16 mb-4 opacity-20" />
                            <p>Selecciona un chat o crea un mensaje nuevo</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL NUEVO MENSAJE */}
            {isComposing && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                     <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl animate-scale-in">
                         <div className="flex justify-between items-center mb-6">
                             <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                 <Mail className="w-5 h-5 text-[#ccff00]" /> Nuevo Mensaje
                             </h3>
                             <button onClick={() => setIsComposing(false)}><X className="w-5 h-5 text-zinc-500 hover:text-white" /></button>
                         </div>
                         
                         <div className="space-y-6">
                             {/* Selector de Tipo */}
                             <div className="grid grid-cols-2 gap-3 p-1 bg-black/40 rounded-xl border border-white/5">
                                 <button 
                                    onClick={() => setComposeType('private')}
                                    className={`py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                        composeType === 'private' ? 'bg-zinc-800 text-white shadow-lg border border-white/10' : 'text-zinc-500 hover:text-white'
                                    }`}
                                 >
                                     <Users className="w-4 h-4" /> Privado
                                 </button>
                                 <button 
                                    onClick={() => setComposeType('broadcast')}
                                    className={`py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                        composeType === 'broadcast' ? 'bg-[#ccff00] text-black shadow-lg' : 'text-zinc-500 hover:text-white'
                                    }`}
                                 >
                                     <Megaphone className="w-4 h-4" /> Difusión
                                 </button>
                             </div>
    
                             {/* Selector de Destinatario (Solo Privado) */}
                             {composeType === 'private' && (
                                 <div className="animate-fade-in">
                                     <label className="block text-xs font-bold text-zinc-400 mb-2 ml-1 uppercase">Destinatario</label>
                                     <select 
                                        value={composeRecipientId}
                                        onChange={(e) => setComposeRecipientId(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00] transition-colors"
                                     >
                                         <option value="">Seleccionar Revendedor...</option>
                                         {resellers.map(r => (
                                             <option key={r.id} value={r.id}>{r.name} ({r.region})</option>
                                         ))}
                                     </select>
                                 </div>
                             )}
    
                             {/* Advertencia de Difusión */}
                             {composeType === 'broadcast' && (
                                 <div className="p-4 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-xl text-[#ccff00] text-xs flex gap-3 items-start animate-fade-in">
                                     <Megaphone className="w-5 h-5 shrink-0" />
                                     <p>
                                         ⚠️ Estás por enviar un mensaje a <strong>todos los revendedores ({resellers.length})</strong>. 
                                         Esta acción no se puede deshacer. Úsalo para anuncios importantes.
                                     </p>
                                 </div>
                             )}
    
                             {/* Contenido del Mensaje */}
                             <div>
                                 <label className="block text-xs font-bold text-zinc-400 mb-2 ml-1 uppercase">Mensaje</label>
                                 <textarea 
                                    rows={5}
                                    value={composeContent}
                                    onChange={(e) => setComposeContent(e.target.value)}
                                    placeholder="Escribe tu mensaje aquí..."
                                    className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00] transition-colors resize-none"
                                 />
                             </div>
                         </div>
    
                         <div className="flex justify-end gap-3 mt-8">
                             <button onClick={() => setIsComposing(false)} className="text-zinc-400 px-4 py-2 hover:bg-white/5 rounded-xl transition-colors font-medium">Cancelar</button>
                             <button 
                                onClick={handleComposeSend}
                                disabled={!composeContent || (composeType === 'private' && !composeRecipientId)}
                                className="bg-[#ccff00] text-black px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-[#b3e600] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                             >
                                 <Send className="w-4 h-4" /> Enviar Mensaje
                             </button>
                         </div>
                     </div>
                </div>
            )}
        </div>
    );
};

export default MessagesTab;