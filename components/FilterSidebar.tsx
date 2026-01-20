
import React from 'react';
import { X, Check } from 'lucide-react';
import { Brand, Category } from '../types';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeBrand: Brand; // Para el tema visual
  selectedBrands: Brand[];
  onToggleBrand: (brand: Brand) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  minPrice: number;
  maxPrice: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  activeBrand,
  selectedBrands,
  onToggleBrand,
  priceRange,
  onPriceChange,
  categories,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice
}) => {
  const isSports = activeBrand === 'informa';
  const isIqual = activeBrand === 'iqual';
  const isBio = activeBrand === 'biofarma';

  // Theme Logic
  const bgClass = isSports ? 'bg-[#0f0f0f] border-r border-[#ccff00]/20' : isIqual ? 'bg-slate-900 border-r border-indigo-500/20' : isBio ? 'bg-white border-r border-blue-100' : 'bg-stone-50 border-r border-emerald-100';
  const textTitle = isSports ? 'text-white' : isIqual ? 'text-white' : isBio ? 'text-blue-900' : 'text-emerald-900';
  const textSub = isSports ? 'text-gray-400' : isIqual ? 'text-slate-400' : 'text-gray-500';
  const accentColor = isSports ? 'text-[#ccff00]' : isIqual ? 'text-indigo-400' : isBio ? 'text-blue-700' : 'text-emerald-700';
  const accentBg = isSports ? 'bg-[#ccff00]' : isIqual ? 'bg-indigo-600' : isBio ? 'bg-blue-900' : 'bg-emerald-800';
  const checkboxBorder = isSports ? 'border-gray-600 checked:bg-[#ccff00] checked:border-[#ccff00]' : isIqual ? 'border-slate-600 checked:bg-indigo-500' : 'border-gray-300 checked:bg-emerald-600';

  const brands: { id: Brand; label: string }[] = [
    { id: 'informa', label: 'In Forma' },
    { id: 'phisis', label: 'Phisis' },
    { id: 'iqual', label: 'Iqual' },
    { id: 'biofarma', label: 'BioFarma' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:relative top-0 left-0 h-full lg:h-auto w-72 z-50 lg:z-0 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${bgClass} p-6 overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-8 lg:hidden">
          <h2 className={`text-xl font-bold ${textTitle}`}>Filtros</h2>
          <button onClick={onClose} className="p-2">
            <X className={`w-6 h-6 ${textSub}`} />
          </button>
        </div>

        {/* Brand Filter */}
        <div className="mb-8">
          <h3 className={`font-bold mb-4 uppercase tracking-wider text-sm ${textTitle}`}>Marcas</h3>
          <div className="space-y-3">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center cursor-pointer group">
                <div className={`w-5 h-5 border rounded mr-3 flex items-center justify-center transition-colors ${
                    selectedBrands.includes(brand.id) 
                        ? (isSports ? 'bg-[#ccff00] border-[#ccff00]' : isIqual ? 'bg-indigo-500 border-indigo-500' : isBio ? 'bg-blue-600 border-blue-600' : 'bg-emerald-600 border-emerald-600')
                        : (isSports || isIqual ? 'border-gray-700 bg-transparent' : 'border-gray-300 bg-white')
                }`}>
                    {selectedBrands.includes(brand.id) && <Check className={`w-3 h-3 ${isSports ? 'text-black' : 'text-white'}`} />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => onToggleBrand(brand.id)}
                />
                <span className={`text-sm ${selectedBrands.includes(brand.id) ? `font-bold ${textTitle}` : textSub} group-hover:${textTitle}`}>
                  {brand.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-8">
          <h3 className={`font-bold mb-4 uppercase tracking-wider text-sm ${textTitle}`}>Precio</h3>
          <div className="space-y-4">
             <div className="flex justify-between text-sm mb-2">
                <span className={textSub}>${priceRange[0].toLocaleString()}</span>
                <span className={textSub}>${priceRange[1].toLocaleString()}</span>
             </div>
             <input 
                type="range" 
                min={minPrice} 
                max={maxPrice} 
                value={priceRange[1]} 
                onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
                className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${isSports ? 'bg-gray-700 accent-[#ccff00]' : isIqual ? 'bg-slate-700 accent-indigo-500' : 'bg-gray-200 accent-emerald-600'}`}
             />
          </div>
        </div>

        {/* Categories Filter (Vertical List) */}
        <div>
           <h3 className={`font-bold mb-4 uppercase tracking-wider text-sm ${textTitle}`}>Categorías</h3>
           <div className="space-y-1">
             {categories.map((cat) => (
               <button
                 key={cat}
                 onClick={() => onSelectCategory(cat)}
                 className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat 
                        ? (isSports ? 'bg-[#ccff00]/10 text-[#ccff00] font-bold' : isIqual ? 'bg-indigo-500/10 text-indigo-400 font-bold' : isBio ? 'bg-blue-50 text-blue-700 font-bold' : 'bg-emerald-50 text-emerald-800 font-bold')
                        : `hover:bg-white/5 ${textSub} hover:${textTitle}`
                 }`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>

        {/* Reset Filters */}
        {(selectedBrands.length > 0 || selectedCategory !== 'Todos' || priceRange[1] < maxPrice) && (
            <button 
                onClick={() => {
                    onPriceChange([minPrice, maxPrice]);
                    onSelectCategory('Todos');
                    // Reset brands to empty (revert to default view)
                    selectedBrands.forEach(b => onToggleBrand(b));
                    // Hacky way to clear, better passed from parent
                    window.location.reload(); // Simple reset for now or handle in parent
                }}
                className={`mt-8 text-xs underline ${textSub} hover:${accentColor}`}
            >
                Limpiar Filtros
            </button>
        )}

      </aside>
    </>
  );
};

export default FilterSidebar;
