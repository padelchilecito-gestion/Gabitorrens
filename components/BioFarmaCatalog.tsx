
import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, Info, Pill, Droplets, Syringe, X, Check, Eye } from 'lucide-react';
import { linfarCatalog } from '../data';
import { Product, PeptoneFormula } from '../types';

interface BioFarmaCatalogProps {
    onAddToCart: (product: Product, quantity: number) => void;
    onSelect: (item: PeptoneFormula) => void; // New prop to handle detail view
}

const BioFarmaCatalog: React.FC<BioFarmaCatalogProps> = ({ onAddToCart, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'organo' | 'inmuno' | 'estetica'>('all');
    const [selectedPresentation, setSelectedPresentation] = useState<Record<string, string>>({}); // Map code -> presentation

    const filteredCatalog = useMemo(() => {
        return linfarCatalog.filter(item => {
            const matchesSearch = 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.recommendations.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Simple logic for category tabs based on typical recommendations keywords
            let matchesCategory = true;
            if (activeFilter === 'organo') matchesCategory = !item.recommendations.toLowerCase().includes('piel') && !item.recommendations.toLowerCase().includes('inmuno');
            if (activeFilter === 'inmuno') matchesCategory = item.recommendations.toLowerCase().includes('inmuno') || item.recommendations.toLowerCase().includes('defensa');
            if (activeFilter === 'estetica') matchesCategory = item.recommendations.toLowerCase().includes('piel') || item.recommendations.toLowerCase().includes('celulitis') || item.recommendations.toLowerCase().includes('arrugas');

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, activeFilter]);

    const handleAddPeptone = (item: PeptoneFormula, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening detail when adding to cart
        // Create a temporary Product object for the cart
        // Price assumed standard for Peptones or hardcoded for now
        const basePrice = 28900; 
        const presentation = selectedPresentation[item.code] || item.presentations[0]; // Default to first available

        const productPayload: Product = {
            id: `PEP-${item.code}`,
            name: `Linfar ${item.code} - ${item.name}`,
            brand: 'biofarma',
            category: 'Peptonas',
            price: basePrice,
            description: `Fórmula: ${item.ingredients}. Presentación: ${presentation}`,
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop', // Generic medical bottle
            stock: 100, // Always in stock virtual
            active: true
        };

        // We override the cart logic slightly to include presentation in name or separate field if supported
        // For now, appending to name is safest for current Cart structure
        onAddToCart({
            ...productPayload,
            name: `Linfar ${item.code} (${presentation})` 
        }, 1);
    };

    const getIconForPresentation = (p: string) => {
        if (p === 'Ampollas') return <Syringe className="w-3 h-3" />;
        if (p === 'Comprimidos') return <Pill className="w-3 h-3" />;
        return <Droplets className="w-3 h-3" />;
    };

    return (
        <div className="bg-blue-50/50 rounded-3xl border border-blue-100 p-6 md:p-10 shadow-xl my-12 relative overflow-hidden">
            
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-black text-blue-900 mb-2 font-sans tracking-tight">
                        VADEMÉCUM <span className="text-blue-500">DIGITAL</span>
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Buscador especializado de fórmulas Linfar Peptonum. Encuentra el tratamiento biológico específico por código, patología o nombre.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
                    
                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Buscar (ej. Hígado, APG, Piel...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white text-slate-700 shadow-sm"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex bg-white p-1 rounded-xl border border-blue-100 shadow-sm">
                        {[
                            { id: 'all', label: 'Todos' },
                            { id: 'organo', label: 'Órgano-Específicos' },
                            { id: 'inmuno', label: 'Inmunidad' },
                            { id: 'estetica', label: 'Estética' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveFilter(tab.id as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    activeFilter === tab.id 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCatalog.map((item) => (
                        <div 
                            key={item.code} 
                            onClick={() => onSelect(item)}
                            className="bg-white border border-blue-100 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all group flex flex-col cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-2xl font-black text-blue-100 group-hover:text-blue-600 transition-colors font-mono tracking-tighter">
                                    {item.code}
                                </span>
                                <div className="flex gap-1">
                                    {item.presentations.map(p => (
                                        <div key={p} className="p-1.5 bg-slate-50 text-slate-400 rounded-md border border-slate-100" title={p}>
                                            {getIconForPresentation(p)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <h3 className="font-bold text-lg text-slate-800 mb-1 leading-tight">{item.name}</h3>
                            <p className="text-xs text-slate-500 font-medium mb-3 uppercase tracking-wide">{item.ingredients}</p>
                            
                            <div className="bg-blue-50/50 p-3 rounded-lg mb-4 flex-1">
                                <p className="text-sm text-slate-700 leading-snug line-clamp-3">
                                    <Info className="w-3 h-3 inline mr-1 text-blue-500" />
                                    {item.recommendations}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-3">
                                {/* Presentation Selector - Click stops propagation */}
                                <select 
                                    className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-2.5 outline-none focus:border-blue-500 flex-1"
                                    value={selectedPresentation[item.code] || item.presentations[0]}
                                    onChange={(e) => setSelectedPresentation({...selectedPresentation, [item.code]: e.target.value})}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {item.presentations.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>

                                <button 
                                    onClick={(e) => handleAddPeptone(item, e)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-colors shadow-lg shadow-blue-600/20"
                                    title="Agregar al Pedido"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mt-2 text-center">
                                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1 group-hover:text-blue-600 transition-colors">
                                    <Eye className="w-3 h-3" /> Ver descripción completa
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCatalog.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        <p>No se encontraron fórmulas con ese criterio.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default BioFarmaCatalog;
