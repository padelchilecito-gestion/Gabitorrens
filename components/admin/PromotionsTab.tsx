import React, { useState } from 'react';
import { Banner, Product } from '../../types';
import { 
    Plus, Trash2, Package
} from 'lucide-react';

interface PromotionsTabProps {
    banners: Banner[];
    setBanners: (banners: Banner[]) => void;
    products: Product[];
}

const PromotionsTab: React.FC<PromotionsTabProps> = ({ banners, setBanners, products }) => {
    // Modal State
    const [isEditing, setIsEditing] = useState(false);
    const [currentBanner, setCurrentBanner] = useState<Partial<Banner>>({});
    
    // Banner Product Management State
    const [selectedPromoProductId, setSelectedPromoProductId] = useState('');
    const [promoQuantity, setPromoQuantity] = useState(1);

    // --- HANDLERS ---
    const handleSaveBanner = () => {
        if (!currentBanner.title) return;
        const bannerToSave: Banner = {
            id: currentBanner.id || `B-${Date.now()}`,
            title: currentBanner.title,
            description: currentBanner.description || '',
            image: currentBanner.image || '/images/placeholder-banner.jpg',
            brand: currentBanner.brand || 'informa',
            active: currentBanner.active ?? true,
            discountPercentage: Number(currentBanner.discountPercentage) || 0,
            relatedProducts: currentBanner.relatedProducts || []
        };
        
        if (currentBanner.id) {
            setBanners(banners.map(b => b.id === bannerToSave.id ? bannerToSave : b));
        } else {
            setBanners([...banners, bannerToSave]);
        }
        setIsEditing(false);
        setCurrentBanner({});
    };

    const handleDeleteBanner = (id: string) => {
        if (window.confirm('¿Eliminar esta promoción?')) {
            setBanners(banners.filter(b => b.id !== id));
        }
    };

    const handleAddProductToBanner = () => {
        if (!selectedPromoProductId || promoQuantity < 1) return;
        const newRelated = [
            ...(currentBanner.relatedProducts || []),
            { productId: selectedPromoProductId, quantity: promoQuantity, discountPercentage: currentBanner.discountPercentage }
        ];
        setCurrentBanner({ ...currentBanner, relatedProducts: newRelated });
        setSelectedPromoProductId('');
        setPromoQuantity(1);
    };

    const handleRemoveProductFromBanner = (index: number) => {
        const newRelated = [...(currentBanner.relatedProducts || [])];
        newRelated.splice(index, 1);
        setCurrentBanner({ ...currentBanner, relatedProducts: newRelated });
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white italic">BANNERS Y <span className="text-[#ccff00]">OFERTAS</span></h1>
                    <p className="text-zinc-500 text-sm">Gestiona la publicidad destacada en la página principal</p>
                </div>
                <button 
                    onClick={() => { setCurrentBanner({ brand: 'informa', active: true, relatedProducts: [], discountPercentage: 0 }); setIsEditing(true); }} 
                    className="bg-[#ccff00] text-black px-6 py-2 rounded-lg hover:bg-[#b3e600] flex items-center gap-2 font-bold hover:scale-105 transition-transform"
                >
                    <Plus className="w-5 h-5" /> Nueva Promoción
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map(banner => (
                    <div key={banner.id} className="bg-zinc-900/40 backdrop-blur-md rounded-2xl shadow-lg border border-white/5 overflow-hidden group hover:border-[#ccff00]/30 transition-all">
                        <div className="relative h-48 bg-black">
                            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded uppercase ${
                                banner.brand === 'informa' ? 'bg-[#ccff00] text-black' :
                                banner.brand === 'iqual' ? 'bg-indigo-600 text-white' : 
                                banner.brand === 'biofarma' ? 'bg-blue-600 text-white' : 'bg-emerald-800 text-white'
                            }`}>
                                {banner.brand}
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-lg mb-1 text-white">{banner.title}</h3>
                            <p className="text-sm text-zinc-400 mb-4 h-10 line-clamp-2">{banner.description}</p>
                            
                            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4 bg-black/30 p-2 rounded-lg border border-white/5">
                                <Package className="w-4 h-4" />
                                {banner.relatedProducts?.length 
                                ? `${banner.relatedProducts.reduce((acc, item) => acc + item.quantity, 0)} producto(s) incluidos` 
                                : 'Banner informativo'}
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                <button 
                                    onClick={() => { setCurrentBanner({...banner}); setIsEditing(true); }}
                                    className="flex-1 py-2 text-sm font-medium text-blue-400 bg-blue-900/10 hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handleDeleteBanner(banner.id)}
                                    className="p-2 text-red-400 bg-red-900/10 hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* BANNER MODAL */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh] animate-scale-in">
                        <h3 className="text-xl font-bold text-white mb-4">Editar Banner</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Título</label>
                                <input type="text" placeholder="Título" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white outline-none focus:border-[#ccff00]" value={currentBanner.title || ''} onChange={e => setCurrentBanner({...currentBanner, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Descripción</label>
                                <textarea rows={3} placeholder="Descripción" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white outline-none focus:border-[#ccff00]" value={currentBanner.description || ''} onChange={e => setCurrentBanner({...currentBanner, description: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">URL Imagen</label>
                                <input type="text" placeholder="URL Imagen" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white outline-none focus:border-[#ccff00]" value={currentBanner.image || ''} onChange={e => setCurrentBanner({...currentBanner, image: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Marca</label>
                                <select 
                                    value={currentBanner.brand}
                                    onChange={(e) => setCurrentBanner({...currentBanner, brand: e.target.value as any})}
                                    className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]"
                                >
                                    <option value="informa">In Forma</option>
                                    <option value="phisis">Phisis</option>
                                    <option value="iqual">Iqual</option>
                                    <option value="biofarma">BioFarma</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1/2">
                                    <label className="block text-xs font-bold text-zinc-400 mb-1">% Descuento</label>
                                    <input type="number" placeholder="% Descuento" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" value={currentBanner.discountPercentage || 0} onChange={e => setCurrentBanner({...currentBanner, discountPercentage: Number(e.target.value)})} />
                                </div>
                                <span className="text-xs text-zinc-500 mt-5">Aplica a todo el pack</span>
                            </div>

                            {/* Product Selection for Banner */}
                            <div className="border-t border-white/10 pt-4 mt-2">
                                <h4 className="text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wide">Configurar Pack / Productos Requeridos</h4>
                                <div className="flex gap-2 mb-3">
                                    <select 
                                        value={selectedPromoProductId}
                                        onChange={(e) => setSelectedPromoProductId(e.target.value)}
                                        className="flex-1 bg-black/50 border border-white/10 p-2 rounded-xl text-xs text-white outline-none focus:border-[#ccff00]"
                                    >
                                        <option value="">Seleccionar Producto...</option>
                                        {products
                                            .filter(p => p.brand === currentBanner.brand || !currentBanner.brand) 
                                            .map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={promoQuantity}
                                        onChange={(e) => setPromoQuantity(Math.max(1, Number(e.target.value)))}
                                        className="w-16 bg-black/50 border border-white/10 p-2 rounded-xl text-xs text-white text-center outline-none focus:border-[#ccff00]"
                                    />
                                    <button 
                                        onClick={handleAddProductToBanner}
                                        className="bg-[#ccff00] text-black p-2 rounded-lg hover:bg-[#b3e600]"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Added Products List */}
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {currentBanner.relatedProducts?.map((item, index) => {
                                        const prod = products.find(p => p.id === item.productId);
                                        return (
                                            <div key={index} className="flex justify-between items-center bg-black/30 p-2 rounded border border-white/5 text-xs">
                                                <span className="text-white truncate flex-1">{item.quantity}x {prod?.name || 'Producto Desconocido'}</span>
                                                <button onClick={() => handleRemoveProductFromBanner(index)} className="text-red-400 hover:text-red-300 ml-2">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {(!currentBanner.relatedProducts || currentBanner.relatedProducts.length === 0) && (
                                        <p className="text-xs text-zinc-600 text-center py-2">Sin productos asignados (Banner informativo)</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setIsEditing(false)} className="text-zinc-400 px-4 py-2 hover:bg-white/5 rounded-xl">Cancelar</button>
                            <button onClick={handleSaveBanner} className="bg-[#ccff00] text-black px-6 py-2 rounded-xl font-bold shadow-lg">Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionsTab;