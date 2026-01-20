
import React from 'react';
import { ShoppingCart, Menu, X, Sparkles, Fingerprint, Activity } from 'lucide-react';
import { CartItem, User, Brand, SiteContent } from '../types';

interface NavbarProps {
  cart: CartItem[];
  onCartClick: () => void;
  activeBrand: Brand;
  onBrandSwitch: (brand: Brand) => void;
  currentUser: User | null;
  siteContent: SiteContent;
}

const Navbar: React.FC<NavbarProps> = ({ cart, onCartClick, activeBrand, onBrandSwitch, currentUser, siteContent }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isSports = activeBrand === 'informa';
  const isPhisis = activeBrand === 'phisis';
  const isIqual = activeBrand === 'iqual';
  const isBio = activeBrand === 'biofarma';

  // Dynamic Styles based on Brand
  const getNavStyle = () => {
      if (isSports) return 'bg-black/95 border-b border-[#ccff00]/30';
      if (isIqual) return 'bg-slate-900/95 border-b border-indigo-500/30';
      if (isBio) return 'bg-white/95 border-b border-blue-900/10 shadow-sm';
      return 'bg-white/95 border-b border-emerald-100 shadow-sm';
  };

  const getBadgeStyle = () => {
      if (isSports) return 'text-black bg-[#ccff00]';
      if (isIqual) return 'text-white bg-indigo-600';
      if (isBio) return 'text-white bg-blue-900';
      return 'text-white bg-emerald-600';
  };

  const getCartIconStyle = () => {
      if (isSports) return 'hover:bg-gray-800 text-white';
      if (isIqual) return 'hover:bg-slate-800 text-slate-200';
      if (isBio) return 'hover:bg-blue-50 text-blue-900';
      return 'hover:bg-emerald-50 text-emerald-900';
  };

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-500 ${getNavStyle()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[100px] md:min-h-[90px] py-2"> 
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center justify-center cursor-pointer" onClick={() => onBrandSwitch(activeBrand)}>
            {isSports && (
              siteContent?.logoInforma ? (
                  <img src={siteContent.logoInforma} alt="In Forma" className="h-24 md:h-28 w-auto object-contain transition-all" />
              ) : (
                <div className="relative w-[300px] h-[100px] flex items-center justify-center transform scale-100 md:scale-110 origin-left">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 280 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M60 30 C 120 0, 220 0, 255 35 L 245 38 C 210 12, 120 12, 70 38 Z" fill="#ccff00" />
                        <path d="M220 58 C 160 88, 60 88, 25 53 L 35 50 C 70 76, 160 76, 210 50 Z" fill="white" />
                    </svg>
                    <div className="relative z-10 flex flex-col items-center justify-center pt-2">
                        <div className="flex items-center leading-none tracking-tighter transform -skew-x-[10deg]">
                            <div className="relative mr-1">
                                <span className="text-[2.8rem] font-[900] italic text-white font-sans">I</span>
                                <div className="absolute top-0 left-0 w-5 h-5 bg-[#ccff00]" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                            </div>
                            <span className="text-[2.8rem] font-[900] italic text-white font-sans">N</span>
                            <span className="w-3"></span>
                            <span className="text-[2.8rem] font-[900] italic text-white font-sans">FORMA</span>
                        </div>
                        <div className="text-[11px] md:text-[12px] font-bold text-[#ccff00] uppercase tracking-[0.2em] w-full text-center mt-0 transform -skew-x-[10deg]">
                            Suplementos Deportivos
                        </div>
                    </div>
                </div>
              )
            )}
            {isPhisis && (
               siteContent?.logoPhisis ? (
                   <img src={siteContent.logoPhisis} alt="Phisis" className="h-16 md:h-20 w-auto object-contain transition-all" />
               ) : (
                  <div className="flex items-center gap-3 transform scale-100 md:scale-110 origin-left">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                        <Sparkles className="text-emerald-700 w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                    <span className="text-3xl font-serif text-emerald-900 tracking-wide">
                        phisis
                    </span>
                    <span className="text-[11px] tracking-widest text-emerald-600 uppercase">Belleza Única</span>
                    </div>
                  </div>
               )
            )}
            {isIqual && (
                siteContent?.logoIqual ? (
                    <img src={siteContent.logoIqual} alt="Iqual" className="h-16 md:h-20 w-auto object-contain transition-all" />
                ) : (
                  <div className="flex items-center gap-3 transform scale-100 md:scale-110 origin-left">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-indigo-500/50">
                        <Fingerprint className="text-indigo-400 w-7 h-7" />
                    </div>
                    <div className="flex flex-col">
                    <span className="text-3xl font-sans font-bold text-white tracking-[0.2em]">
                        iQUAL
                    </span>
                    <span className="text-[11px] tracking-widest text-indigo-300 uppercase">Tu misma esencia</span>
                    </div>
                  </div>
                )
            )}
            {isBio && (
               siteContent?.logoBiofarma ? (
                   <img src={siteContent.logoBiofarma} alt="BioFarma" className="h-16 md:h-20 w-auto object-contain transition-all" />
               ) : (
                  <div className="flex items-center gap-3 transform scale-100 md:scale-110 origin-left">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center relative overflow-hidden">
                        {/* Medical Cross + Leaf SVG */}
                        <svg className="w-8 h-8 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                             <path d="M12 6v12M6 12h12" className="text-blue-900" />
                        </svg>
                        <svg className="absolute top-0 right-0 w-6 h-6 text-green-600 fill-green-600/20" viewBox="0 0 24 24">
                             <path d="M12 2C7 2 3 7 3 12s5 10 10 10 9-4 9-9c0-5-4-11-10-11zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" fill="none" />
                             <path d="M17 3c-3 0-6 3-6 8 0 5 4 8 8 8 0-4-2-9-5-13z" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-0">
                            <span className="text-3xl font-sans font-bold text-blue-900 tracking-tight">BioFarma</span>
                            <span className="text-3xl font-sans font-light text-green-700 tracking-tight">Natural</span>
                        </div>
                        <span className="text-[9px] tracking-widest text-gray-500 uppercase">Ciencia y Naturaleza</span>
                    </div>
                  </div>
               )
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <button 
                onClick={() => onBrandSwitch('informa')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  isSports 
                  ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.4)]' 
                  : 'text-gray-400 hover:text-white hover:bg-black/40'
                }`}
              >
                DEPORTES
              </button>
              <button 
                onClick={() => onBrandSwitch('phisis')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  isPhisis 
                  ? 'bg-emerald-700 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-emerald-900 hover:bg-emerald-50'
                }`}
              >
                NUTRICOSMÉTICA
              </button>
              <button 
                onClick={() => onBrandSwitch('iqual')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  isIqual 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                FRAGANCIAS
              </button>
              <button 
                onClick={() => onBrandSwitch('biofarma')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  isBio 
                  ? 'bg-blue-900 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-blue-900 hover:bg-blue-50'
                }`}
              >
                SALUD INTEGRAL
              </button>
            </div>
          </div>

          {/* Cart Icon & User */}
          <div className="flex items-center gap-4">
            
            {/* User Profile (If Logged In) */}
            {currentUser && (
                <div className="hidden md:flex items-center gap-2">
                     <span className={`text-sm font-bold ${isSports || isIqual ? 'text-white' : 'text-blue-900'}`}>
                         {currentUser.name.split(' ')[0]}
                     </span>
                     <img 
                        src={currentUser.avatar} 
                        alt="Profile" 
                        className={`w-8 h-8 rounded-full border-2 ${isSports || isIqual ? 'border-white/20' : 'border-blue-100'}`}
                     />
                </div>
            )}

            <button
              onClick={onCartClick}
              className={`relative p-2 rounded-full transition-colors ${getCartIconStyle()}`}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className={`absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none transform translate-x-1/4 -translate-y-1/4 rounded-full ${getBadgeStyle()}`}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                    isSports || isIqual ? 'text-gray-400 hover:text-white' : 'text-blue-900 hover:bg-blue-50'
                }`}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${
            isSports ? 'bg-zinc-900' : isIqual ? 'bg-slate-900' : 'bg-white border-b border-gray-100'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <button 
                onClick={() => { onBrandSwitch('informa'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-4 rounded-md text-base font-bold ${
                    isSports ? 'text-[#ccff00] bg-zinc-800' : 'text-gray-500'
                }`}
              >
                LÍNEA DEPORTIVA
              </button>
              <button 
                onClick={() => { onBrandSwitch('phisis'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-4 rounded-md text-base font-bold ${
                    isPhisis ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500'
                }`}
              >
                LÍNEA NUTRICOSMÉTICA
              </button>
              <button 
                onClick={() => { onBrandSwitch('iqual'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-4 rounded-md text-base font-bold ${
                    isIqual ? 'text-indigo-400 bg-slate-800' : 'text-gray-500'
                }`}
              >
                FRAGANCIAS IQUAL
              </button>
              <button 
                onClick={() => { onBrandSwitch('biofarma'); setIsMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-4 rounded-md text-base font-bold ${
                    isBio ? 'text-blue-900 bg-blue-50' : 'text-gray-500'
                }`}
              >
                SALUD BIOFARMA
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
