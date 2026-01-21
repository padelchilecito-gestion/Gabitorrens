import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail'; 
import RecommendationQuiz from './components/RecommendationQuiz'; 
import BioFarmaCatalog from './components/BioFarmaCatalog'; 
import CartSidebar from './components/CartSidebar';
import { AdminPanel } from './components/AdminPanel';
import ResellerPanel from './components/ResellerPanel';
import Login from './components/Login';
import SocialProof from './components/SocialProof';
import { initialProducts, initialContactInfo, initialBanners, initialResellers, initialAdminClients, initialSiteContent, initialPaymentConfig, initialSocialReviews } from './data';
import { Product, CartItem, Category, ContactInfo, Banner, Reseller, Client, SiteContent, User, PaymentConfig, SocialReview, Brand, PeptoneFormula } from './types';
import { Sparkles, SlidersHorizontal, Lock, MapPin, Phone, Mail, Instagram } from 'lucide-react';

// Importamos el hook que acabamos de crear
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  // --- ESTADO PERSISTENTE (Se guarda en el navegador) ---
  // Cuando conectemos Firebase, solo cambiaremos esta parte.
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);
  const [contactInfo, setContactInfo] = useLocalStorage<ContactInfo>('contactInfo', initialContactInfo);
  const [paymentConfig, setPaymentConfig] = useLocalStorage<PaymentConfig>('paymentConfig', initialPaymentConfig);
  const [banners, setBanners] = useLocalStorage<Banner[]>('banners', initialBanners);
  const [resellers, setResellers] = useLocalStorage<Reseller[]>('resellers', initialResellers);
  const [adminClients, setAdminClients] = useLocalStorage<Client[]>('adminClients', initialAdminClients);
  const [siteContent, setSiteContent] = useLocalStorage<SiteContent>('siteContent', initialSiteContent);
  const [socialReviews, setSocialReviews] = useLocalStorage<SocialReview[]>('socialReviews', initialSocialReviews);
  
  // --- ESTADO DE INTERFAZ (No necesita guardarse) ---
  const [currentView, setCurrentView] = useState<'shop' | 'admin' | 'reseller' | 'login'>('shop');
  const [activeBrand, setActiveBrand] = useState<Brand>('informa');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [loggedReseller, setLoggedReseller] = useState<Reseller | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todos');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // --- LÓGICA DE NEGOCIO ---

  const filteredProducts = useMemo(() => {
      return products.filter(p => {
          const brandMatch = p.brand === activeBrand;
          const categoryMatch = selectedCategory === 'Todos' || p.category === selectedCategory;
          const isActive = p.active === true;
          return brandMatch && categoryMatch && isActive;
      });
  }, [products, activeBrand, selectedCategory]);

  const handleGoogleLogin = () => {
      return new Promise<void>((resolve) => {
          setTimeout(() => {
              setCurrentUser({
                  id: 'u-google-123',
                  name: 'Juan Pérez',
                  email: 'juan.perez@gmail.com',
                  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
              });
              resolve();
          }, 1500);
      });
  };

  const handleUnifiedLogin = (type: 'admin' | 'reseller', data?: Reseller) => {
      if (type === 'admin') {
          setCurrentView('admin');
      } else if (type === 'reseller' && data) {
          setLoggedReseller(data);
          setCurrentView('reseller');
      }
  };

  const categories: Category[] = ['Todos', ...Array.from(new Set(
    products
        .filter(p => p.brand === activeBrand)
        .map(p => p.category)
  ))].sort() as Category[];

  // --- MANEJO DEL CARRITO ---

  const addToCart = (product: Product, quantity: number = 1, discount: number = 0) => {
    if (product.stock < quantity) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      
      if (existing) {
        if (existing.quantity + quantity > product.stock) return prev;
        
        return prev.map(item => 
          item.id === product.id ? { 
              ...item, 
              quantity: item.quantity + quantity,
              discount: Math.max(item.discount || 0, discount)
          } : item
        );
      }
      return [...prev, { ...product, quantity: quantity, discount: discount }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    const product = products.find(p => p.id === id) || cart.find(i => i.id === id);
    if (!product) return;

    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > product.stock) return item;
        const finalQty = Math.max(0, newQty);
        return { ...item, quantity: finalQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleSelectPeptone = (item: PeptoneFormula) => {
      const productPayload: Product = {
            id: `PEP-${item.code}`,
            name: `Linfar ${item.code} - ${item.name}`,
            brand: 'biofarma',
            category: 'Peptonas',
            price: 28900,
            description: item.recommendations,
            longDescription: item.description,
            features: [item.ingredients, ...item.presentations],
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop',
            stock: 100,
            active: true
      };
      setSelectedProduct(productPayload);
  };

  const isSports = activeBrand === 'informa';
  const isIqual = activeBrand === 'iqual';
  const isBio = activeBrand === 'biofarma';

  const getBgClass = () => {
      if (isSports) return 'bg-[#0a0a0a]';
      if (isIqual) return 'bg-slate-900';
      if (isBio) return 'bg-white';
      return 'bg-stone-50';
  };

  const getCatBtnClass = (isActive: boolean) => {
      if (isActive) {
          if (isSports) return 'bg-[#ccff00] text-black font-bold shadow-[0_0_20px_rgba(204,255,0,0.3)]';
          if (isIqual) return 'bg-indigo-600 text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)]';
          if (isBio) return 'bg-blue-900 text-white font-bold shadow-lg';
          return 'bg-emerald-800 text-white shadow-lg';
      } else {
          if (isSports) return 'bg-zinc-800/50 border border-white/10 text-gray-300 hover:bg-zinc-700/50 hover:border-[#ccff00]/50';
          if (isIqual) return 'bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700/50 hover:border-indigo-500/50';
          if (isBio) return 'bg-blue-50 border border-blue-100 text-blue-900 hover:bg-blue-100';
          return 'bg-white/60 border border-stone-200 text-stone-600 hover:bg-white/80';
      }
  };

  // --- RENDER ---

  if (currentView === 'login') {
      return (
          <Login 
            resellers={resellers}
            onLoginSuccess={handleUnifiedLogin}
            onClose={() => setCurrentView('shop')}
          />
      );
  }

  if (currentView === 'admin') {
      return (
        <AdminPanel 
            products={products}
            setProducts={setProducts}
            contactInfo={contactInfo}
            setContactInfo={setContactInfo}
            paymentConfig={paymentConfig}
            setPaymentConfig={setPaymentConfig}
            banners={banners}
            setBanners={setBanners}
            socialReviews={socialReviews}
            setSocialReviews={setSocialReviews}
            resellers={resellers}
            setResellers={setResellers}
            adminClients={adminClients}
            setAdminClients={setAdminClients}
            onClose={() => setCurrentView('shop')}
            siteContent={siteContent}
            setSiteContent={setSiteContent}
        />
      );
  }

  if (currentView === 'reseller') {
    return (
        <ResellerPanel 
            resellers={resellers}
            setResellers={setResellers}
            onClose={() => {
                setLoggedReseller(null);
                setCurrentView('shop');
            }}
            initialUser={loggedReseller}
        />
    );
  }

  return (
    <div className={`min-h-screen relative transition-colors duration-700 ${getBgClass()}`}>
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         {isSports && (
             <>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ccff00]/10 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
             </>
         )}
         {isIqual && (
             <>
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-slate-700/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
             </>
         )}
         {!isSports && !isIqual && !isBio && (
             <>
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
             </>
         )}
      </div>

      <div className="relative z-10">
        <Navbar 
            cart={cart} 
            onCartClick={() => setIsCartOpen(true)} 
            activeBrand={activeBrand}
            onBrandSwitch={(brand) => {
                setActiveBrand(brand);
                setSelectedCategory('Todos');
            }}
            currentUser={currentUser}
            siteContent={siteContent}
        />
        
        <Hero 
            activeBrand={activeBrand} 
            banners={banners}
            products={products}
            onAddBundleToCart={addToCart}
            siteContent={siteContent}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            
            {activeBrand !== 'biofarma' && (
                <div className="mb-8 overflow-x-auto pb-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                    {categories.map((cat, idx) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat as Category)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${getCatBtnClass(selectedCategory === cat)}`}
                        >
                        {cat}
                        </button>
                    ))}
                    </div>
                </div>
            )}

            {/* PRODUCT GRID */}
            {filteredProducts.length > 0 && (
                <div className="mb-16">
                    {activeBrand === 'biofarma' && <h3 className="text-2xl font-bold text-blue-900 mb-6 border-l-4 border-blue-500 pl-4">Destacados y Kits</h3>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product, idx) => (
                        <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                            <ProductCard 
                                product={product} 
                                onAddToCart={(p) => addToCart(p, 1)} 
                                onClick={(p) => setSelectedProduct(p)}
                            />
                        </div>
                        ))}
                    </div>
                </div>
            )}

            {/* BIOFARMA VADEMECUM */}
            {activeBrand === 'biofarma' && (
                <div className="mb-16 animate-slide-up">
                    <BioFarmaCatalog 
                        onAddToCart={(p, qty) => { addToCart(p, qty); setIsCartOpen(true); }} 
                        onSelect={handleSelectPeptone}
                    />
                </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && activeBrand !== 'biofarma' && (
                <div className="text-center py-20 animate-fade-in bg-white/5 rounded-2xl border border-white/5">
                    <SlidersHorizontal className={`w-12 h-12 mx-auto mb-4 ${isSports || isIqual ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className={`text-xl font-bold ${isSports || isIqual ? 'text-gray-400' : 'text-stone-500'}`}>No encontramos productos.</p>
                    <p className="text-sm text-gray-500 mt-2">Intenta seleccionar otra categoría.</p>
                    <button 
                        onClick={() => setSelectedCategory('Todos')}
                        className={`mt-6 px-6 py-2 rounded-lg font-bold ${
                            isSports ? 'bg-[#ccff00] text-black' : isBio ? 'bg-blue-900 text-white' : isIqual ? 'bg-indigo-600 text-white' : 'bg-emerald-800 text-white'
                        }`}
                    >
                        Ver Todos
                    </button>
                </div>
            )}
        </main>

        <button 
            onClick={() => setIsQuizOpen(true)}
            className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.3)] animate-blob hover:scale-110 transition-transform ${
                isSports ? 'bg-[#ccff00] text-black' : isIqual ? 'bg-indigo-600 text-white' : isBio ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
            }`}
        >
            <Sparkles className="w-6 h-6" />
        </button>

        <SocialProof reviews={socialReviews} activeBrand={activeBrand} />

        {/* Footer */}
        <footer className={`${
            isSports ? 'bg-black/80 border-t border-white/5' : isIqual ? 'bg-slate-900/80 border-t border-white/5' : isBio ? 'bg-white border-t border-blue-100' : 'bg-stone-100/80 border-t border-stone-200'
        } backdrop-blur-lg pt-16 pb-8`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="text-center md:text-left">
                        <h3 className={`text-xl font-bold mb-4 ${isSports || isIqual ? 'text-white' : isBio ? 'text-blue-900' : 'text-emerald-900'}`}>
                            {isSports ? 'IN FORMA' : isIqual ? 'IQUAL' : isBio ? 'BIOFARMA' : 'PHISIS'}
                        </h3>
                        <p className={`text-sm ${isSports || isIqual ? 'text-gray-400' : 'text-stone-500'}`}>
                            {isSports 
                                ? 'Llevando tu rendimiento al máximo nivel con suplementación deportiva de vanguardia.' 
                                : isIqual 
                                    ? 'Descubrí tu esencia con nuestras fragancias exclusivas y productos de cuidado personal.'
                                    : isBio
                                        ? 'Ciencia y naturaleza para una salud integral. Soluciones de regeneración celular.'
                                        : 'Cuidando tu belleza interior y exterior con lo mejor de la naturaleza y la ciencia.'
                            }
                        </p>
                    </div>

                    <div className="text-center md:text-left">
                        <h3 className={`text-lg font-bold mb-4 ${isSports ? 'text-[#ccff00]' : isIqual ? 'text-indigo-400' : isBio ? 'text-blue-700' : 'text-emerald-700'}`}>
                            Contacto
                        </h3>
                        <div className={`space-y-3 text-sm ${isSports || isIqual ? 'text-gray-300' : 'text-stone-600'}`}>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <MapPin className="w-4 h-4" /> {contactInfo.address}
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <Phone className="w-4 h-4" /> {contactInfo.phone}
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <Mail className="w-4 h-4" /> {contactInfo.email}
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <Instagram className="w-4 h-4" /> {contactInfo.instagram}
                            </div>
                        </div>
                    </div>

                    <div className="text-center md:text-right space-y-2">
                        <button 
                            onClick={() => setCurrentView('login')}
                            className={`text-sm font-medium flex items-center justify-center md:justify-end gap-2 ml-auto hover:underline ${
                                isSports || isIqual ? 'text-gray-600 hover:text-white' : 'text-stone-400 hover:text-emerald-800'
                            }`}
                        >
                            <Lock className="w-4 h-4" /> Acceso Socios
                        </button>
                    </div>
                </div>

                <div className={`text-center pt-8 border-t ${isSports || isIqual ? 'border-gray-800' : 'border-stone-200'}`}>
                    <p className={`text-xs ${isSports || isIqual ? 'text-gray-600' : 'text-stone-400'}`}>
                        © 2024 In Forma, Phisis & Iqual. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>

        <CartSidebar 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            activeBrand={activeBrand}
            contactInfo={contactInfo}
            paymentConfig={paymentConfig}
            currentUser={currentUser}
            onLogin={handleGoogleLogin}
        />

        {selectedProduct && (
            <ProductDetail 
                product={selectedProduct} 
                onClose={() => setSelectedProduct(null)}
                onAddToCart={(p, qty) => { addToCart(p, qty); setIsCartOpen(true); }}
            />
        )}

        <RecommendationQuiz 
            isOpen={isQuizOpen}
            onClose={() => setIsQuizOpen(false)}
            products={products}
            onAddToCart={(p) => { addToCart(p, 1); setIsCartOpen(true); }}
        />

      </div>
    </div>
  );
}

export default App;