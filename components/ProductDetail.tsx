
import React from 'react';
import { Product } from '../types';
import { X, ShoppingCart, Check, Star, ShieldCheck, Activity } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = React.useState(1);
  const [isAdded, setIsAdded] = React.useState(false);

  const isSports = product.brand === 'informa';
  const isIqual = product.brand === 'iqual';
  const isBio = product.brand === 'biofarma';

  // Theme Logic
  const overlayBg = isSports ? 'bg-black/90' : isIqual ? 'bg-slate-900/90' : 'bg-white/90';
  const modalBg = isSports ? 'bg-zinc-900 border border-white/10' : isIqual ? 'bg-slate-800 border border-white/10' : 'bg-white border border-gray-100';
  const textMain = isSports || isIqual ? 'text-white' : 'text-gray-900';
  const textSub = isSports || isIqual ? 'text-gray-400' : 'text-gray-500';
  const accentColor = isSports ? 'text-[#ccff00]' : isIqual ? 'text-indigo-400' : isBio ? 'text-blue-600' : 'text-emerald-700';
  const btnBg = isSports ? 'bg-[#ccff00] text-black hover:bg-white' : isIqual ? 'bg-indigo-600 text-white hover:bg-indigo-500' : isBio ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-emerald-800 text-white hover:bg-emerald-700';

  const handleAdd = () => {
      onAddToCart(product, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in ${overlayBg}`}>
       <div className={`relative w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row ${modalBg}`}>
           
           <button 
             onClick={onClose}
             className={`absolute top-4 right-4 z-20 p-2 rounded-full backdrop-blur-md transition-colors ${isSports || isIqual ? 'bg-black/20 text-white hover:bg-white/20' : 'bg-white/50 text-gray-600 hover:bg-gray-100'}`}
           >
               <X className="w-6 h-6" />
           </button>

           {/* Left: Image */}
           <div className="w-full md:w-1/2 h-1/3 md:h-auto relative bg-gray-100">
               <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
               <div className={`absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t ${isSports ? 'from-zinc-900' : isIqual ? 'from-slate-800' : 'from-white'} to-transparent`}></div>
           </div>

           {/* Right: Content */}
           <div className="w-full md:w-1/2 p-8 overflow-y-auto">
               <div className="mb-2">
                   <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                       isSports ? 'bg-[#ccff00]/20 text-[#ccff00]' : isIqual ? 'bg-indigo-500/20 text-indigo-300' : isBio ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                   }`}>
                       {product.category}
                   </span>
               </div>
               
               <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textMain} ${isSports ? 'italic' : ''}`}>
                   {product.name}
               </h2>

               <div className="flex items-center gap-4 mb-6">
                   <span className={`text-3xl font-bold ${accentColor}`}>
                       ${product.price.toLocaleString()}
                   </span>
                   {product.stock > 0 && product.stock < 10 && (
                       <span className="text-xs text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded-full">
                           ¡Últimas {product.stock} unidades!
                       </span>
                   )}
               </div>

               <p className={`text-lg mb-6 leading-relaxed ${textSub}`}>
                   {product.description}
                   {product.longDescription && (
                       <span className="block mt-4 text-sm opacity-90">{product.longDescription}</span>
                   )}
               </p>

               {/* Features / Ingredients */}
               <div className="mb-8">
                   <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${textMain}`}>
                       Beneficios Clave
                   </h3>
                   <div className="space-y-2">
                       {product.features?.map((feat, i) => (
                           <div key={i} className="flex items-center gap-3">
                               <div className={`p-1 rounded-full ${isSports ? 'bg-[#ccff00] text-black' : isIqual ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                   <Check className="w-3 h-3" />
                               </div>
                               <span className={textSub}>{feat}</span>
                           </div>
                       ))}
                   </div>
               </div>

               {/* Add to Cart Section */}
               <div className={`pt-6 border-t ${isSports || isIqual ? 'border-white/10' : 'border-gray-100'}`}>
                   <div className="flex items-center gap-4 mb-4">
                       <div className={`flex items-center border rounded-lg ${isSports || isIqual ? 'border-white/20' : 'border-gray-200'}`}>
                           <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={`w-10 h-10 flex items-center justify-center ${textMain}`}>-</button>
                           <span className={`w-8 text-center font-bold ${textMain}`}>{quantity}</span>
                           <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className={`w-10 h-10 flex items-center justify-center ${textMain}`}>+</button>
                       </div>
                       <button 
                           onClick={handleAdd}
                           disabled={product.stock === 0}
                           className={`flex-1 h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg ${btnBg}`}
                       >
                           {isAdded ? (
                               <>Agregado <Check className="w-5 h-5" /></>
                           ) : (
                               <>Agregar al Carrito <ShoppingCart className="w-5 h-5" /></>
                           )}
                       </button>
                   </div>
                   <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-gray-500">
                       <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Compra Segura</span>
                       <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Calidad Premium</span>
                   </div>
               </div>

           </div>
       </div>
    </div>
  );
};

export default ProductDetail;
