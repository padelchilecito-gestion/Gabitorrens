import React from 'react';
import { Reseller, Message } from '../../types';
import { Send } from 'lucide-react';

interface ResellerMessagesProps {
    currentUser: Reseller;
    onUpdateReseller: (updated: Reseller) => void;
}

const ResellerMessages: React.FC<ResellerMessagesProps> = ({ currentUser, onUpdateReseller }) => {

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;
        const msg: Message = {
            id: `M-${Date.now()}`,
            sender: 'reseller',
            content: text,
            timestamp: new Date().toLocaleString(),
            read: false
        };
        onUpdateReseller({
            ...currentUser,
            messages: [...currentUser.messages, msg]
        });
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden animate-fade-in">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentUser.messages.length === 0 && (
                    <div className="h-full flex items-center justify-center text-zinc-500">
                        <p>No hay mensajes. Escribe al administrador si tienes dudas.</p>
                    </div>
                )}
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
    );
};

export default ResellerMessages;