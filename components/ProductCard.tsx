
import React from 'react';
import { Plus, AlertCircle, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (product: Product) => void; // New prop for click handler
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  const isSports = product.brand === 'informa';
  const isIqual = product.brand === 'iqual';
  const isBio = product.brand === 'biofarma';
  const hasStock = product.stock > 0;

  let cardClasses = '';
  let badgeClasses = '';
  let titleClasses = '';
  let textClasses = '';
  let tagClasses = '';
  let priceClasses = '';
  let btnClasses = '';

  if (isSports) {
      cardClasses = 'bg-zinc-900/60 border border-white/5 hover:border-[#ccff00]/50 hover:shadow-[0_10px_30px_-10px_rgba(204,255,0,0.15)] rounded-xl';
      badgeClasses = 'bg-[#ccff00]/90 text-black';
      titleClasses = 'text-white italic uppercase';
      textClasses = 'text-gray-400';
      tagClasses = 'border-gray-700/50 bg-black/20 text-gray-300';
      priceClasses = 'text-[#ccff00]';
      btnClasses = 'bg-white hover:bg-[#ccff00] text-black';
  } else if (isIqual) {
      cardClasses = 'bg-slate-900/60 border border-white/10 hover:border-indigo-500/50 hover:shadow-[0_10px_30px_-10px_rgba(99,102,241,0.15)] rounded-sm';
      badgeClasses = 'bg-indigo-600/90 text-white';
      titleClasses = 'text-white font-sans tracking-wide';
      textClasses = 'text-slate-400';
      tagClasses = 'border-slate-700/50 bg-slate-800/40 text-slate-300';
      priceClasses = 'text-indigo-400';
      btnClasses = 'bg-white hover:bg-indigo-50 text-slate-900';
  } else if (isBio) {
      cardClasses = 'bg-white border border-blue-100 hover:border-blue-400 hover:shadow-xl rounded-2xl shadow-sm';
      badgeClasses = 'bg-blue-600/90 text-white';
      titleClasses = 'text-blue-900 font-sans tracking-tight';
      textClasses = 'text-gray-600';
      tagClasses = 'border-blue-100 bg-blue-50 text-blue-700 rounded-md';
      priceClasses = 'text-blue-800';
      btnClasses = 'bg-blue-900 hover:bg-green-600 text-white rounded-lg';
  } else {
      // Phisis
      cardClasses = 'bg-white/70 border border-white/40 shadow-sm hover:shadow-xl hover:border-emerald-200 rounded-2xl';
      badgeClasses = 'bg-emerald-100/90 text-emerald-800';
      titleClasses = 'text-emerald-950 font-serif';
      textClasses = 'text-stone-600';
      tagClasses = 'border-stone-200/50 bg-white/40 text-stone-500 rounded-full';
      priceClasses = 'text-emerald-700';
      btnClasses = 'bg-emerald-800 hover:bg-emerald-700 text-white rounded-full';
  }

  return (
    <div className={`group relative flex flex-col h-full overflow-hidden transition-all duration-500 hover:-translate-y-2 backdrop-blur-md ${cardClasses} ${!hasStock ? 'opacity-80' : ''}`}>
      
      {/* Image Container - Clickable */}
      <div 
        className="relative h-64 overflow-hidden bg-gray-100/10 cursor-pointer"
        onClick={() => onClick(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transform transition-transform duration-700 ${
              hasStock ? 'group-hover:scale-110' : 'grayscale'
          }`}
        />
        <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded backdrop-blur-md shadow-lg ${badgeClasses}`}>
            {product.category}
        </div>
        
        {/* Hover Overlay for Detail View */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <Eye className="w-4 h-4" /> Ver Detalles
            </div>
        </div>

        {/* Out of Stock Overlay */}
        {!hasStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-bold border-2 border-white px-4 py-2 uppercase tracking-widest transform -rotate-12">
                    Agotado
                </span>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="mb-4 cursor-pointer" onClick={() => onClick(product)}>
           <h3 className={`text-xl font-bold mb-2 ${titleClasses}`}>
            {product.name}
           </h3>
           <p className={`text-sm line-clamp-3 ${textClasses}`}>
            {product.description}
           </p>
        </div>

        {/* Features */}
        {product.features && (
            <div className="flex flex-wrap gap-2 mb-6">
                {product.features.map((feature, idx) => (
                    <span key={idx} className={`text-[10px] px-2 py-1 border backdrop-blur-sm ${tagClasses}`}>
                        {feature}
                    </span>
                ))}
            </div>
        )}

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between">
          <span className={`text-2xl font-bold ${priceClasses}`}>
            ${product.price.toLocaleString()}
          </span>
          
          <button
            onClick={(e) => {
                e.stopPropagation();
                if (hasStock) onAddToCart(product);
            }}
            disabled={!hasStock}
            className={`p-3 transition-all duration-300 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 ${
                hasStock ? btnClasses : 'bg-gray-500 cursor-not-allowed text-gray-300'
            }`}
          >
            {hasStock ? <Plus className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
