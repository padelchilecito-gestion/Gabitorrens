import React from 'react';
import { SiteContent, ContactInfo, PaymentConfig } from '../../types';
import { 
    Upload, Image, Banknote, CreditCard, Wallet 
} from 'lucide-react';

interface SettingsTabProps {
    siteContent: SiteContent;
    setSiteContent: (content: SiteContent) => void;
    contactInfo: ContactInfo;
    setContactInfo: (info: ContactInfo) => void;
    paymentConfig: PaymentConfig;
    setPaymentConfig: (config: PaymentConfig) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ 
    siteContent, setSiteContent, contactInfo, setContactInfo, paymentConfig, setPaymentConfig 
}) => {

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldKey: keyof SiteContent) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSiteContent({ ...siteContent, [fieldKey]: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="animate-fade-in space-y-12 pb-20">
             
             {/* 1. Logos Configuration Section */}
             <div>
                <h1 className="text-3xl font-black text-white italic mb-6">LOGOS E <span className="text-[#ccff00]">IDENTIDAD</span></h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'In Forma', key: 'logoInforma', color: 'bg-[#ccff00]' },
                        { label: 'Phisis', key: 'logoPhisis', color: 'bg-emerald-500' },
                        { label: 'Iqual', key: 'logoIqual', color: 'bg-indigo-500' },
                        { label: 'BioFarma', key: 'logoBiofarma', color: 'bg-blue-500' },
                    ].map((brand) => (
                        <div key={brand.key} className="bg-zinc-900/40 backdrop-blur-md p-4 rounded-xl border border-white/5 shadow-xl space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                 <div className={`w-3 h-3 rounded-full ${brand.color}`}></div>
                                 <h3 className="font-bold text-white">{brand.label}</h3>
                            </div>
                            <div className="h-24 bg-black/50 rounded flex items-center justify-center border border-dashed border-white/10 mb-2 overflow-hidden">
                                {siteContent[brand.key as keyof SiteContent] ? (
                                    <img src={siteContent[brand.key as keyof SiteContent] as string} className="h-full object-contain" alt={brand.label} />
                                ) : (
                                    <span className="text-xs text-zinc-500">Sin Logo</span>
                                )}
                            </div>
                            <input 
                                type="text" 
                                placeholder="URL del logo" 
                                value={siteContent[brand.key as keyof SiteContent] as string || ''}
                                onChange={(e) => setSiteContent({...siteContent, [brand.key]: e.target.value})}
                                className="w-full text-xs bg-black/50 border border-white/10 p-2 rounded text-white outline-none focus:border-white/20" 
                            />
                            <div className="relative">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => handleLogoUpload(e, brand.key as keyof SiteContent)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <button className="w-full bg-white/5 hover:bg-white/10 text-zinc-300 text-xs py-2 rounded flex items-center justify-center gap-2 transition-colors">
                                    <Upload className="w-3 h-3" /> Subir Archivo
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             {/* 1.5 Background Images Configuration Section */}
             <div>
                <h1 className="text-3xl font-black text-white italic mb-6">FONDOS DE <span className="text-[#ccff00]">PANTALLA</span></h1>
                <p className="text-zinc-400 mb-6 text-sm">Carga una imagen para el fondo de la sección principal (Hero) de cada marca.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Fondo In Forma', key: 'sportsHeroBg', color: 'bg-[#ccff00]' },
                        { label: 'Fondo Phisis', key: 'beautyHeroBg', color: 'bg-emerald-500' },
                        { label: 'Fondo Iqual', key: 'fragranceHeroBg', color: 'bg-indigo-500' },
                        { label: 'Fondo BioFarma', key: 'bioHeroBg', color: 'bg-blue-500' },
                    ].map((brand) => (
                        <div key={brand.key} className="bg-zinc-900/40 backdrop-blur-md p-4 rounded-xl border border-white/5 shadow-xl space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                 <div className={`w-3 h-3 rounded-full ${brand.color}`}></div>
                                 <h3 className="font-bold text-white">{brand.label}</h3>
                            </div>
                            <div className="h-24 bg-black/50 rounded flex items-center justify-center border border-dashed border-white/10 mb-2 overflow-hidden relative group">
                                {siteContent[brand.key as keyof SiteContent] ? (
                                    <img src={siteContent[brand.key as keyof SiteContent] as string} className="w-full h-full object-cover opacity-60" alt={brand.label} />
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Image className="w-6 h-6 text-zinc-600 mb-1" />
                                        <span className="text-xs text-zinc-500">Sin Fondo</span>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="text" 
                                placeholder="URL de la imagen" 
                                value={siteContent[brand.key as keyof SiteContent] as string || ''}
                                onChange={(e) => setSiteContent({...siteContent, [brand.key]: e.target.value})}
                                className="w-full text-xs bg-black/50 border border-white/10 p-2 rounded text-white outline-none focus:border-white/20" 
                            />
                            <div className="relative">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => handleLogoUpload(e, brand.key as keyof SiteContent)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <button className="w-full bg-white/5 hover:bg-white/10 text-zinc-300 text-xs py-2 rounded flex items-center justify-center gap-2 transition-colors">
                                    <Upload className="w-3 h-3" /> Subir Imagen Local
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             {/* 2. CMS Text Configuration */}
             <div>
                <h1 className="text-3xl font-black text-white italic mb-6">PERSONALIZAR <span className="text-[#ccff00]">TEXTOS</span></h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* In Forma */}
                    <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/5 space-y-4">
                        <h3 className="text-[#ccff00] font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-2">Sección Deportes (In Forma)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Título 1</label>
                                <input type="text" value={siteContent.sportsHeroTitle1} onChange={(e) => setSiteContent({...siteContent, sportsHeroTitle1: e.target.value})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Título 2 (Color)</label>
                                <input type="text" value={siteContent.sportsHeroTitle2} onChange={(e) => setSiteContent({...siteContent, sportsHeroTitle2: e.target.value})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Descripción</label>
                            <textarea rows={3} value={siteContent.sportsHeroDescription} onChange={(e) => setSiteContent({...siteContent, sportsHeroDescription: e.target.value})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white outline-none" />
                        </div>
                    </div>

                    {/* Phisis */}
                    <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/5 space-y-4">
                        <h3 className="text-emerald-500 font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-2">Sección Nutricosmética (Phisis)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Título 1</label>
                                <input type="text" value={siteContent.beautyHeroTitle1} onChange={(e) => setSiteContent({...siteContent, beautyHeroTitle1: e.target.value})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Título 2 (Italic)</label>
                                <input type="text" value={siteContent.beautyHeroTitle2} onChange={(e) => setSiteContent({...siteContent, beautyHeroTitle2: e.target.value})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Descripción</label>
                            <textarea rows={3} value={siteContent.beautyHeroDescription} onChange={(e) => setSiteContent({...siteContent, beautyHeroDescription: e.target.value})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white outline-none" />
                        </div>
                    </div>

                    {/* Iqual */}
                    <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/5 space-y-4">
                        <h3 className="text-indigo-500 font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-2">Sección Fragancias (Iqual)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Título 1</label>
                                <input type="text" value={siteContent.fragranceHeroTitle1} onChange={(e) => setSiteContent({...siteContent, fragranceHeroTitle1: e.target.value})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Título 2 (Color)</label>
                                <input type="text" value={siteContent.fragranceHeroTitle2} onChange={(e) => setSiteContent({...siteContent, fragranceHeroTitle2: e.target.value})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Descripción</label>
                            <textarea rows={3} value={siteContent.fragranceHeroDescription} onChange={(e) => setSiteContent({...siteContent, fragranceHeroDescription: e.target.value})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white outline-none" />
                        </div>
                    </div>

                    {/* BioFarma */}
                    <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/5 space-y-4">
                        <h3 className="text-blue-500 font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-2">Sección Salud (BioFarma)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Título 1</label>
                                <input type="text" value={siteContent.bioHeroTitle1} onChange={(e) => setSiteContent({...siteContent, bioHeroTitle1: e.target.value})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1">Título 2 (Color)</label>
                                <input type="text" value={siteContent.bioHeroTitle2} onChange={(e) => setSiteContent({...siteContent, bioHeroTitle2: e.target.value})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Descripción</label>
                            <textarea rows={3} value={siteContent.bioHeroDescription} onChange={(e) => setSiteContent({...siteContent, bioHeroDescription: e.target.value})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white outline-none" />
                        </div>
                    </div>

                </div>
             </div>

             {/* 3. Contact Info */}
             <div>
                <h1 className="text-3xl font-black text-white italic mb-6">DATOS DE <span className="text-[#ccff00]">CONTACTO</span></h1>
                <div className="bg-zinc-900/40 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Correo Electrónico</label>
                            <input 
                                type="email" 
                                value={contactInfo.email}
                                onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#ccff00] focus:border-transparent outline-none text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Teléfono (WhatsApp)</label>
                            <input 
                                type="text" 
                                value={contactInfo.phone}
                                onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#ccff00] focus:border-transparent outline-none text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Dirección Comercial</label>
                            <input 
                                type="text" 
                                value={contactInfo.address}
                                onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#ccff00] focus:border-transparent outline-none text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Instagram</label>
                            <input 
                                type="text" 
                                value={contactInfo.instagram}
                                onChange={(e) => setContactInfo({...contactInfo, instagram: e.target.value})}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#ccff00] focus:border-transparent outline-none text-white"
                            />
                        </div>
                    </div>
                </div>
             </div>

             {/* 4. Payment Configuration */}
             <div>
                <h1 className="text-3xl font-black text-white italic mb-6">MÉTODOS DE <span className="text-[#ccff00]">PAGO</span></h1>
                <div className="bg-zinc-900/40 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/5 space-y-6">
                    
                    {/* Transfer Config */}
                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Banknote className="w-5 h-5 text-zinc-400" /> Transferencia Bancaria
                            </h3>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={paymentConfig.transfer.enabled} onChange={() => setPaymentConfig({...paymentConfig, transfer: {...paymentConfig.transfer, enabled: !paymentConfig.transfer.enabled}})} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ccff00]"></div>
                            </label>
                        </div>
                        {paymentConfig.transfer.enabled && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Nombre Banco" value={paymentConfig.transfer.bankName} onChange={(e) => setPaymentConfig({...paymentConfig, transfer: {...paymentConfig.transfer, bankName: e.target.value}})} className="bg-black/50 border border-white/10 p-2 rounded text-white text-sm" />
                                <input type="text" placeholder="Alias (CBU)" value={paymentConfig.transfer.alias} onChange={(e) => setPaymentConfig({...paymentConfig, transfer: {...paymentConfig.transfer, alias: e.target.value}})} className="bg-black/50 border border-white/10 p-2 rounded text-white text-sm" />
                                <input type="text" placeholder="Titular" value={paymentConfig.transfer.holderName} onChange={(e) => setPaymentConfig({...paymentConfig, transfer: {...paymentConfig.transfer, holderName: e.target.value}})} className="bg-black/50 border border-white/10 p-2 rounded text-white text-sm" />
                                <input type="text" placeholder="CBU numérico" value={paymentConfig.transfer.cbu} onChange={(e) => setPaymentConfig({...paymentConfig, transfer: {...paymentConfig.transfer, cbu: e.target.value}})} className="bg-black/50 border border-white/10 p-2 rounded text-white text-sm" />
                            </div>
                        )}
                    </div>

                    {/* Card & Cash Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between">
                            <h3 className="font-bold text-white flex items-center gap-2"><CreditCard className="w-5 h-5 text-zinc-400" /> Tarjetas</h3>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={paymentConfig.card.enabled} onChange={() => setPaymentConfig({...paymentConfig, card: {...paymentConfig.card, enabled: !paymentConfig.card.enabled}})} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ccff00]"></div>
                            </label>
                        </div>
                        <div className="p-4 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between">
                            <h3 className="font-bold text-white flex items-center gap-2"><Wallet className="w-5 h-5 text-zinc-400" /> Efectivo</h3>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={paymentConfig.cash.enabled} onChange={() => setPaymentConfig({...paymentConfig, cash: {...paymentConfig.cash, enabled: !paymentConfig.cash.enabled}})} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ccff00]"></div>
                            </label>
                        </div>
                    </div>
                </div>
             </div>

          </div>
    );
};

export default SettingsTab;