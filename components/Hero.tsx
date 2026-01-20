
import React, { useState, useEffect } from 'react';
import { ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { Banner, Product, SiteContent, Brand } from '../types';

interface HeroProps {
  activeBrand: Brand;
  banners: Banner[];
  products: Product[];
  onAddBundleToCart: (product: Product, quantity: number, discount?: number) => void;
  siteContent: SiteContent;
}

const Hero: React.FC<HeroProps> = ({ activeBrand, banners, products, onAddBundleToCart, siteContent }) => {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Filter banners for current brand and active status
  const currentBanners = banners.filter(b => b.brand === activeBrand && b.active);

  useEffect(() => {
    setActiveBannerIndex(0);
  }, [activeBrand]);

  const handleBannerClick = (banner: Banner) => {
    if (banner.relatedProducts && banner.relatedProducts.length > 0) {
        // Add all products in the bundle to cart with discount
        const discount = banner.discountPercentage || 0;
        banner.relatedProducts.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product && product.stock >= item.quantity) {
                onAddBundleToCart(product, item.quantity, discount);
            }
        });
    }
  };

  const renderBanner = () => {
    if (currentBanners.length === 0) return null;
    const banner = currentBanners[activeBannerIndex];

    const hasAction = banner.relatedProducts && banner.relatedProducts.length > 0;
    
    // Dynamic Banner Styles
    let cardStyle = '';
    let textStyleTitle = '';
    let textStyleDesc = '';
    let btnStyle = '';
    let bgGradient = '';

    if (activeBrand === 'informa') {
        cardStyle = 'bg-zinc-900/80 border-[#ccff00]/30';
        textStyleTitle = 'text-white italic';
        textStyleDesc = 'text-gray-300';
        btnStyle = 'bg-white text-black hover:bg-[#ccff00]';
        bgGradient = 'from-black via-black/80';
    } else if (activeBrand === 'iqual') {
        cardStyle = 'bg-slate-900/80 border-indigo-500/30';
        textStyleTitle = 'text-white font-sans tracking-wider';
        textStyleDesc = 'text-slate-300';
        btnStyle = 'bg-indigo-600 text-white hover:bg-indigo-500';
        bgGradient = 'from-slate-900 via-slate-900/80';
    } else if (activeBrand === 'biofarma') {
        cardStyle = 'bg-white/90 border-blue-200';
        textStyleTitle = 'text-blue-900 font-sans tracking-tight';
        textStyleDesc = 'text-gray-600';
        btnStyle = 'bg-blue-900 text-white hover:bg-blue-800';
        bgGradient = 'from-white via-white/80';
    } else {
        cardStyle = 'bg-white/80 border-white/50';
        textStyleTitle = 'text-emerald-950 font-serif';
        textStyleDesc = 'text-stone-600';
        btnStyle = 'bg-emerald-800 text-white hover:bg-emerald-900';
        bgGradient = 'from-white via-white/80';
    }

    return (
        <div className={`w-full md:w-96 z-20 mt-10 xl:mt-0 xl:absolute xl:bottom-10 xl:right-0 transition-all duration-500 md:mx-auto xl:mx-0`}>
             <div className={`backdrop-blur-xl border p-6 rounded-xl shadow-2xl relative overflow-hidden group ${cardStyle}`}>
                {/* Banner Image Background */}
                <div className="absolute inset-0 z-0">
                    <img src={banner.image} alt="" className="w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${bgGradient}`}></div>
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                             activeBrand === 'informa' 
                             ? 'bg-[#ccff00] text-black' 
                             : activeBrand === 'iqual' 
                                ? 'bg-indigo-500 text-white'
                                : activeBrand === 'biofarma'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-emerald-800 text-white'
                        }`}>
                            Oferta Especial
                        </span>
                        
                        {/* Pagination Dots */}
                        {currentBanners.length > 1 && (
                            <div className="flex gap-1">
                                {currentBanners.map((_, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveBannerIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            idx === activeBannerIndex 
                                                ? (activeBrand === 'informa' ? 'bg-[#ccff00] w-4' : activeBrand === 'iqual' ? 'bg-indigo-500 w-4' : activeBrand === 'biofarma' ? 'bg-blue-900 w-4' : 'bg-emerald-800 w-4')
                                                : 'bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-2 leading-tight ${textStyleTitle}`}>
                        {banner.title}
                    </h3>
                    <p className={`text-sm mb-4 line-clamp-2 ${textStyleDesc}`}>
                        {banner.description}
                    </p>

                    <button 
                        onClick={() => handleBannerClick(banner)}
                        className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${btnStyle}`}
                    >
                        {hasAction ? (
                            <>
                                AGREGAR AL PACK 
                                {banner.discountPercentage ? `(-${banner.discountPercentage}%)` : ''}
                                <ShoppingBag className="w-4 h-4" />
                            </>
                        ) : (
                            <>VER PROMOCIÓN <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
             </div>
        </div>
    );
  };

  if (activeBrand === 'informa') {
    return (
      <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-black min-h-[600px] flex items-center">
        {/* Dynamic Background */}
        {siteContent.sportsHeroBg && (
            <div className="absolute inset-0 z-0">
                <img src={siteContent.sportsHeroBg} alt="Sports Background" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            </div>
        )}
        
        {/* Abstract Background Shapes (Fallback if no image) */}
        {!siteContent.sportsHeroBg && (
            <>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#ccff00] opacity-10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gray-800 opacity-20 blur-2xl"></div>
                {/* Dynamic Lines from PDF Style */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -right-20 top-0 w-[500px] h-full bg-gradient-to-l from-[#ccff00]/10 to-transparent skew-x-12 transform origin-bottom-right"></div>
                </div>
            </>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row flex-wrap items-center w-full z-10">
          <div className="text-center md:text-left md:w-1/2 z-40 relative">
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-6 relative z-50">
              {siteContent.sportsHeroTitle1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-green-400">
                {siteContent.sportsHeroTitle2}
              </span>
            </h1>
            <p className="mt-4 max-w-lg mx-auto md:mx-0 text-xl text-gray-300 relative z-50">
              {siteContent.sportsHeroDescription}
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4 relative z-50">
              <button className="px-8 py-4 bg-[#ccff00] text-black font-black italic rounded transform hover:scale-105 transition-transform shadow-[0_0_20px_rgba(204,255,0,0.4)] flex items-center">
                VER CATÁLOGO <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 mt-10 md:mt-0 relative hidden md:block z-0">
             {!siteContent.sportsHeroBg && (
                 <div className="relative z-0 w-full h-[400px] bg-gradient-to-b from-gray-900 to-black rounded-xl border border-gray-800 p-6 flex items-center justify-center group opacity-50">
                     <img 
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop" 
                        alt="Athlete" 
                        className="rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-500 object-cover w-full h-full"
                     />
                 </div>
             )}
          </div>
          {renderBanner()}
        </div>
      </div>
    );
  }

  if (activeBrand === 'iqual') {
    return (
      <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-slate-900 min-h-[600px] flex items-center">
         {/* Dynamic Background */}
         {siteContent.fragranceHeroBg && (
            <div className="absolute inset-0 z-0">
                <img src={siteContent.fragranceHeroBg} alt="Fragrance Background" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
            </div>
        )}

        {/* Minimalist Shapes (Fallback) */}
        {!siteContent.fragranceHeroBg && (
            <>
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-slate-700/20 rounded-full blur-[100px]"></div>
            </>
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row flex-wrap items-center w-full z-10">
          <div className="text-center md:text-left md:w-1/2 z-40 relative">
            <span className="inline-block px-4 py-1 rounded-sm border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-6 tracking-[0.3em] uppercase relative z-50">
                Fragancias & Cuidado
            </span>
            <h1 className="text-5xl md:text-7xl font-sans font-light text-white mb-6 leading-tight relative z-50 tracking-wide">
              {siteContent.fragranceHeroTitle1} <br />
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {siteContent.fragranceHeroTitle2}
              </span>.
            </h1>
            <p className="mt-4 max-w-lg mx-auto md:mx-0 text-xl text-slate-300 font-light leading-relaxed relative z-50">
              {siteContent.fragranceHeroDescription}
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4 relative z-50">
              <button className="px-8 py-3 bg-white text-slate-900 font-bold tracking-widest text-sm hover:bg-indigo-50 transition-colors shadow-lg flex items-center rounded-sm">
                VER COLECCIÓN
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 mt-10 md:mt-0 relative hidden md:block z-0">
             {!siteContent.fragranceHeroBg && (
                 <div className="relative z-0 w-full h-[500px] flex items-center justify-center">
                     {/* Decorative Circle */}
                     <div className="absolute inset-0 border border-white/5 rounded-full scale-90"></div>
                     <div className="absolute inset-0 border border-indigo-500/10 rounded-full scale-75 animate-pulse"></div>
                     <img 
                        src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800&auto=format&fit=crop" 
                        alt="Fragrance" 
                        className="relative z-10 rounded-sm shadow-2xl object-cover h-[450px] w-[350px] opacity-80 grayscale hover:grayscale-0 transition-all duration-700"
                     />
                 </div>
             )}
          </div>
          {renderBanner()}
        </div>
      </div>
    );
  }

  if (activeBrand === 'biofarma') {
    return (
      <div className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-white min-h-[600px] flex items-center">
         
         {/* Dynamic Background */}
         {siteContent.bioHeroBg && (
            <div className="absolute inset-0 z-0">
                <img src={siteContent.bioHeroBg} alt="BioFarma Background" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
            </div>
        )}

         {/* Medical / Natural Background (Fallback) */}
         {!siteContent.bioHeroBg && (
            <>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white"></div>
                {/* DNA / Molecular structure abstract shapes */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-green-100/40 via-transparent to-transparent opacity-60 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-60 blur-3xl"></div>
            </>
         )}
         
         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row flex-wrap items-center w-full z-10">
            <div className="text-center md:text-left md:w-1/2 z-40 relative">
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-100 text-blue-900 text-sm font-bold mb-6 tracking-wide uppercase relative z-50">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Salud Integral
              </span>
              <h1 className="text-5xl md:text-6xl font-sans font-bold text-slate-800 mb-6 leading-tight relative z-50">
                {siteContent.bioHeroTitle1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-green-600">
                  {siteContent.bioHeroTitle2}
                </span>
              </h1>
              <p className="mt-4 max-w-lg mx-auto md:mx-0 text-xl text-slate-600 leading-relaxed relative z-50">
                {siteContent.bioHeroDescription}
              </p>
              <div className="mt-8 flex justify-center md:justify-start gap-4 relative z-50">
                <button className="px-8 py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition-all shadow-lg hover:shadow-blue-900/20 flex items-center">
                  Ver Vademécum
                </button>
              </div>
            </div>
            
            <div className="md:w-1/2 mt-12 md:mt-0 relative hidden md:block z-0">
               {!siteContent.bioHeroBg && (
                   <div className="relative w-full h-[500px] flex items-center justify-center">
                      <div className="absolute w-[400px] h-[400px] border-2 border-blue-100 rounded-full animate-[spin_60s_linear_infinite]"></div>
                      <div className="absolute w-[350px] h-[350px] border border-green-100 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                      <img 
                          src="https://images.unsplash.com/photo-1576091160550-21878bf7295f?q=80&w=800&auto=format&fit=crop" 
                          alt="Science" 
                          className="relative z-10 rounded-2xl shadow-2xl object-cover w-[400px] h-[500px]"
                      />
                   </div>
               )}
            </div>
            {renderBanner()}
          </div>
      </div>
    );
  }

  // Phisis Theme (Default)
  return (
    <div className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-stone-50 min-h-[600px] flex items-center">
        
        {/* Dynamic Background */}
        {siteContent.beautyHeroBg && (
            <div className="absolute inset-0 z-0">
                <img src={siteContent.beautyHeroBg} alt="Phisis Background" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-50 via-stone-50/80 to-transparent"></div>
            </div>
        )}

       {/* Fallback Abstract */}
       {!siteContent.beautyHeroBg && (
           <>
               <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
               <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
               <div className="absolute top-20 right-10 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
           </>
       )}

       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row flex-wrap items-center w-full z-10">
          <div className="text-center md:text-left md:w-1/2 z-40 relative">
            <span className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-4 tracking-widest uppercase relative z-50">
                Nutricosmética Celular
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-emerald-950 mb-6 leading-tight relative z-50">
              {siteContent.beautyHeroTitle1} <br />
              <span className="italic text-emerald-700">{siteContent.beautyHeroTitle2}</span>
            </h1>
            <p className="mt-4 max-w-lg mx-auto md:mx-0 text-xl text-stone-600 font-light leading-relaxed relative z-50">
              {siteContent.beautyHeroDescription}
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4 relative z-50">
              <button className="px-8 py-3 bg-emerald-800 text-white font-serif rounded-full hover:bg-emerald-900 transition-colors shadow-lg flex items-center">
                Descubrir Colección
              </button>
            </div>
          </div>
           <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center relative hidden md:flex z-0">
             {!siteContent.beautyHeroBg && (
                 <div className="w-[350px] h-[450px] relative">
                    <div className="absolute inset-0 bg-emerald-900 rounded-[2rem] transform rotate-6 opacity-10"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop" 
                        alt="Beauty" 
                        className="relative z-10 rounded-[2rem] shadow-2xl object-cover w-full h-full opacity-60"
                    />
                 </div>
             )}
          </div>
          {renderBanner()}
        </div>
    </div>
  );
};

export default Hero;
