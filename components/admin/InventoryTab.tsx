import React, { useState } from 'react';
import { Product, Brand } from '../../types';
import { 
    Search, Plus, Edit2, Trash2, Eye, EyeOff 
} from 'lucide-react';

interface InventoryTabProps {
    products: Product[];
    setProducts: (products: Product[]) => void;
}

const InventoryTab: React.FC<InventoryTabProps> = ({ products, setProducts }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBrand, setFilterBrand] = useState<Brand | 'all'>('all');
    
    // Modal State
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

    // --- HANDLERS ---
    const handleSaveProduct = () => {
        if (!currentProduct.name || !currentProduct.price) return;
        
        const featuresArray = typeof currentProduct.features === 'string' 
            ? (currentProduct.features as string).split(',').map(s => s.trim()) 
            : currentProduct.features || [];
            
        const productToSave: Product = {
            id: currentProduct.id || Date.now().toString(),
            name: currentProduct.name,
            description: currentProduct.description || '',
            longDescription: currentProduct.longDescription || '',
            price: Number(currentProduct.price),
            brand: currentProduct.brand || 'informa',
            category: currentProduct.category || 'Todos',
            image: currentProduct.image || '/images/placeholder.jpg',
            features: featuresArray,
            stock: Number(currentProduct.stock) || 0,
            active: currentProduct.active ?? true
        };

        if (currentProduct.id) {
            setProducts(products.map(p => p.id === productToSave.id ? productToSave : p));
        } else {
            setProducts([...products, productToSave]);
        }
        
        setIsEditing(false);
        setCurrentProduct({});
    };

    const toggleProductActive = (id: string) => {
        setProducts(products.map(p => p.id === id ? { ...p, active: !p.active } : p));
    };

    const handleDeleteProduct = (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    // --- FILTERING ---
    const filteredInventory = products.filter(p => {
        if (filterBrand !== 'all' && p.brand !== filterBrand) return false;
        if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white italic">GESTIÓN DE <span className="text-[#ccff00]">INVENTARIO</span></h1>
                    <p className="text-sm text-zinc-500 mt-1">Administra tus productos y stock</p>
                </div>
                
                <div className="flex gap-3">
                    <div className="relative">
                        <select 
                            value={filterBrand}
                            onChange={(e) => setFilterBrand(e.target.value as any)}
                            className="bg-zinc-800 border border-white/10 text-white px-4 py-2 rounded-lg outline-none focus:border-[#ccff00] h-full"
                        >
                            <option value="all">Todas las Marcas</option>
                            <option value="informa">In Forma</option>
                            <option value="phisis">Phisis</option>
                            <option value="iqual">Iqual</option>
                            <option value="biofarma">BioFarma</option>
                        </select>
                    </div>
                    
                    <button 
                        onClick={() => { setCurrentProduct({ brand: 'informa', active: true, stock: 10, category: 'Alto Rendimiento' }); setIsEditing(true); }}
                        className="bg-[#ccff00] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#b3e600] flex items-center gap-2 hover:scale-105 transition-all"
                    >
                        <Plus className="w-5 h-5" /> Nuevo Producto
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Buscar producto..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 pl-10 pr-4 py-3 rounded-xl text-white outline-none focus:border-[#ccff00]"
                />
            </div>

            {/* Inventory Table */}
            <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-black/40 text-zinc-400 text-sm">
                        <tr>
                            <th className="px-6 py-4">Producto</th>
                            <th className="px-6 py-4">Marca</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Precio</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredInventory.map(product => (
                            <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <img src={product.image} className="w-10 h-10 rounded-lg object-cover bg-zinc-800" alt={product.name} />
                                    <div className="font-bold text-white">{product.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                                        product.brand === 'informa' ? 'bg-zinc-800 text-zinc-400' :
                                        product.brand === 'iqual' ? 'bg-indigo-900/40 text-indigo-300' : 
                                        product.brand === 'biofarma' ? 'bg-blue-900/40 text-blue-300' : 'bg-emerald-900/40 text-emerald-300'
                                    }`}>
                                        {product.brand}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-300 font-mono">{product.stock}</td>
                                <td className="px-6 py-4 text-[#ccff00] font-bold">${product.price.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => toggleProductActive(product.id)} className={`flex items-center gap-2 px-2 py-1 rounded text-[10px] font-bold border ${product.active ? 'bg-green-900/20 text-green-400 border-green-900/30' : 'bg-red-900/20 text-red-400 border-red-900/30'}`}>
                                        {product.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        {product.active ? 'VISIBLE' : 'OCULTO'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => { setCurrentProduct({...product}); setIsEditing(true); }} className="text-blue-400 p-2 hover:bg-white/5 rounded"><Edit2 className="w-4 h-4"/></button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-400 p-2 hover:bg-white/5 rounded"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PRODUCT MODAL */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-black text-white italic mb-6">EDITAR <span className="text-[#ccff00]">PRODUCTO</span></h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Nombre del Producto</label>
                                <input type="text" placeholder="Nombre" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]" value={currentProduct.name || ''} onChange={e=>setCurrentProduct({...currentProduct, name: e.target.value})} />
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-xs font-bold text-zinc-400 mb-1">Precio</label>
                                    <input type="number" placeholder="Precio" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]" value={currentProduct.price || 0} onChange={e=>setCurrentProduct({...currentProduct, price: Number(e.target.value)})} />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-xs font-bold text-zinc-400 mb-1">Stock</label>
                                    <input type="number" placeholder="Stock" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]" value={currentProduct.stock || 0} onChange={e=>setCurrentProduct({...currentProduct, stock: Number(e.target.value)})} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Marca</label>
                                <select 
                                    value={currentProduct.brand} 
                                    onChange={e=>setCurrentProduct({...currentProduct, brand: e.target.value as any})}
                                    className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]"
                                >
                                    <option value="informa">In Forma</option>
                                    <option value="phisis">Phisis</option>
                                    <option value="iqual">Iqual</option>
                                    <option value="biofarma">BioFarma</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Categoría</label>
                                <input type="text" placeholder="Categoría" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]" value={currentProduct.category || ''} onChange={e=>setCurrentProduct({...currentProduct, category: e.target.value})} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Descripción Corta</label>
                                <textarea rows={2} placeholder="Descripción" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]" value={currentProduct.description || ''} onChange={e=>setCurrentProduct({...currentProduct, description: e.target.value})} />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Descripción Detallada (Modal)</label>
                                <textarea rows={4} placeholder="Descripción completa que aparece en el detalle..." className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]" value={currentProduct.longDescription || ''} onChange={e=>setCurrentProduct({...currentProduct, longDescription: e.target.value})} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">URL de Imagen</label>
                                <input type="text" placeholder="URL Imagen" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]" value={currentProduct.image || ''} onChange={e=>setCurrentProduct({...currentProduct, image: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-8">
                            <button onClick={()=>setIsEditing(false)} className="text-zinc-400 px-4 py-2 hover:bg-white/5 rounded-xl">Cancelar</button>
                            <button onClick={handleSaveProduct} className="bg-[#ccff00] text-black px-6 py-2 rounded-xl font-bold shadow-lg">Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryTab;