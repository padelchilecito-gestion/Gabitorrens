
import React, { useState } from 'react';
import { Product, ContactInfo, Brand, Banner, Reseller, Client, Message, SiteContent, PaymentConfig, SocialReview } from '../types';
import { 
  X, Plus, Edit2, Trash2, Search, Settings, Package, LayoutDashboard, EyeOff, Eye, 
  Tag, Users, UserCircle, Bell, Send, BarChart3, 
  DollarSign, CreditCard, Banknote, Wallet, Upload, TrendingUp, Minus, Save, Mail, Megaphone, Image
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  contactInfo: ContactInfo;
  setContactInfo: (info: ContactInfo) => void;
  paymentConfig: PaymentConfig;
  setPaymentConfig: (config: PaymentConfig) => void;
  banners: Banner[];
  setBanners: (banners: Banner[]) => void;
  socialReviews: SocialReview[];
  setSocialReviews: (reviews: SocialReview[]) => void;
  resellers: Reseller[];
  setResellers: (resellers: Reseller[]) => void;
  adminClients: Client[];
  setAdminClients: (clients: Client[]) => void;
  onClose: () => void;
  siteContent: SiteContent;
  setSiteContent: (content: SiteContent) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products = [], 
  setProducts, 
  contactInfo, 
  setContactInfo, 
  paymentConfig,
  setPaymentConfig,
  banners = [],
  setBanners,
  socialReviews = [],
  setSocialReviews,
  resellers = [],
  setResellers,
  adminClients = [],
  setAdminClients,
  onClose,
  siteContent,
  setSiteContent
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'settings' | 'promotions' | 'resellers' | 'clients' | 'messages' | 'analytics'>('settings');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Inventory Filtering State
  const [inventoryFilterBrand, setInventoryFilterBrand] = useState<Brand | 'all'>('all');

  // Modals States
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Partial<Banner>>({});
  const [isEditingReseller, setIsEditingReseller] = useState(false);
  const [currentReseller, setCurrentReseller] = useState<Partial<Reseller>>({});
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [currentClient, setCurrentClient] = useState<Partial<Client>>({});
  
  // Messaging State
  const [selectedChatResellerId, setSelectedChatResellerId] = useState<string | null>(null);
  const [adminMessageInput, setAdminMessageInput] = useState('');
  
  // New Message Modal State
  const [isComposingMessage, setIsComposingMessage] = useState(false);
  const [composeType, setComposeType] = useState<'private' | 'broadcast'>('private');
  const [composeRecipientId, setComposeRecipientId] = useState<string>('');
  const [composeContent, setComposeContent] = useState('');

  // Review management State
  const [newReviewUrl, setNewReviewUrl] = useState('');
  const [newReviewBrand, setNewReviewBrand] = useState<Brand | 'both'>('informa');

  // Banner Product Management State
  const [selectedPromoProductId, setSelectedPromoProductId] = useState('');
  const [promoQuantity, setPromoQuantity] = useState(1);

  // Safety Check to prevent white screen crashes
  if (!products || !contactInfo || !siteContent) {
      return (
          <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
              <div className="text-center">
                  <h2 className="text-xl font-bold mb-2">Cargando Panel de Control...</h2>
                  <p className="text-zinc-500 text-sm">Si esto persiste, verifica la conexión de datos.</p>
                  <button onClick={onClose} className="mt-4 px-4 py-2 bg-white/10 rounded">Volver</button>
              </div>
          </div>
      );
  }

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
    if (currentProduct.id) setProducts(products.map(p => p.id === productToSave.id ? productToSave : p));
    else setProducts([...products, productToSave]);
    setIsEditingProduct(false);
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

  const handleSaveReseller = () => {
    if (!currentReseller.name || !currentReseller.email || !currentReseller.password) return;
    const resellerToSave: Reseller = {
      id: currentReseller.id || `R-${Date.now()}`,
      name: currentReseller.name,
      email: currentReseller.email,
      password: currentReseller.password,
      region: currentReseller.region || 'General',
      active: currentReseller.active ?? true,
      stock: currentReseller.stock || JSON.parse(JSON.stringify(products)),
      clients: currentReseller.clients || [],
      orders: currentReseller.orders || [],
      messages: currentReseller.messages || [],
      sales: currentReseller.sales || [],
      points: currentReseller.points || 0
    };
    if (currentReseller.id) setResellers(resellers.map(r => r.id === resellerToSave.id ? resellerToSave : r));
    else setResellers([...resellers, resellerToSave]);
    setIsEditingReseller(false);
    setCurrentReseller({});
  };

  const handleDeleteReseller = (id: string) => {
    if (window.confirm('¿Eliminar este revendedor?')) {
        setResellers(resellers.filter(r => r.id !== id));
    }
  };

  const handleSaveClient = () => {
    if (!currentClient.name) return;
    const clientToSave: Client = {
        id: currentClient.id || `C-${Date.now()}`,
        name: currentClient.name,
        phone: currentClient.phone || '',
        address: currentClient.address || '',
        paymentMethod: currentClient.paymentMethod || 'Efectivo',
        currentAccountBalance: Number(currentClient.currentAccountBalance) || 0,
        lastOrderDate: currentClient.lastOrderDate || new Date().toLocaleDateString()
    };
    if (currentClient.id) setAdminClients(adminClients.map(c => c.id === clientToSave.id ? clientToSave : c));
    else setAdminClients([...adminClients, clientToSave]);
    setIsEditingClient(false);
    setCurrentClient({});
  };

  const handleDeleteClient = (id: string) => {
      setAdminClients(adminClients.filter(c => c.id !== id));
  };

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
    if (currentBanner.id) setBanners(banners.map(b => b.id === bannerToSave.id ? bannerToSave : b));
    else setBanners([...banners, bannerToSave]);
    setIsEditingBanner(false);
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

  const handleAddReview = () => {
      if (!newReviewUrl) return;
      const review: SocialReview = {
          id: `REV-${Date.now()}`,
          imageUrl: newReviewUrl,
          brand: newReviewBrand
      };
      setSocialReviews([...socialReviews, review]);
      setNewReviewUrl('');
  };

  const handleDeleteReview = (id: string) => {
      setSocialReviews(socialReviews.filter(r => r.id !== id));
  };

  const handleSelectChat = (resellerId: string) => {
    setSelectedChatResellerId(resellerId);
    const updatedResellers = resellers.map(r => {
        if (r.id === resellerId) {
            return {
                ...r,
                messages: r.messages.map(m => m.sender === 'reseller' ? { ...m, read: true } : m)
            };
        }
        return r;
    });
    setResellers(updatedResellers);
  };

  const handleSendAdminMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatResellerId || !adminMessageInput.trim()) return;
    const newMessage: Message = {
        id: `M-${Date.now()}`,
        sender: 'admin',
        content: adminMessageInput,
        timestamp: new Date().toLocaleString(),
        read: false
    };
    const updatedResellers = resellers.map(r => {
        if (r.id === selectedChatResellerId) {
            return { ...r, messages: [...r.messages, newMessage] };
        }
        return r;
    });
    setResellers(updatedResellers);
    setAdminMessageInput('');
  };

  const handleComposeSend = () => {
    if (!composeContent.trim()) return;
    if (composeType === 'private' && !composeRecipientId) return;

    const newMessage: Message = {
        id: `M-${Date.now()}`,
        sender: 'admin',
        content: composeContent,
        timestamp: new Date().toLocaleString(),
        read: false
    };

    let updatedResellers;

    if (composeType === 'broadcast') {
        // Add message to ALL resellers
        updatedResellers = resellers.map(r => ({
            ...r,
            messages: [...r.messages, newMessage]
        }));
    } else {
        // Add message to Specific reseller
        updatedResellers = resellers.map(r => {
            if (r.id === composeRecipientId) {
                return { ...r, messages: [...r.messages, newMessage] };
            }
            return r;
        });
        // If we are currently viewing this chat, select it
        setSelectedChatResellerId(composeRecipientId);
    }

    setResellers(updatedResellers);
    setIsComposingMessage(false);
    setComposeContent('');
    setComposeRecipientId('');
  };

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

  const totalUnreadMessages = resellers.reduce((acc, r) => acc + r.messages.filter(m => m.sender === 'reseller' && !m.read).length, 0);

  // Filter products for inventory table
  const filteredInventory = products.filter(p => {
      // Filter by Brand (Dropdown)
      if (inventoryFilterBrand !== 'all' && p.brand !== inventoryFilterBrand) return false;
      // Filter by Search Term
      if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
  });

  return (
    <div className="min-h-screen relative bg-[#0a0a0a] font-sans text-gray-200 selection:bg-[#ccff00] selection:text-black overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#ccff00]/10 rounded-full blur-[100px] animate-blob"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/5 rounded-full blur-[120px]"></div>
      </div>
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-black/60 backdrop-blur-xl border-r border-white/10 shadow-2xl flex flex-col z-50">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white italic">
            <LayoutDashboard className="text-[#ccff00]" />
            Panel <span className="text-[#ccff00]">Admin</span>
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'inventory', icon: Package, label: 'Inventario' },
            { id: 'promotions', icon: Tag, label: 'Promociones' },
            { id: 'analytics', icon: BarChart3, label: 'Estadísticas' },
            { id: 'messages', icon: Bell, label: 'Mensajes', badge: totalUnreadMessages },
            { id: 'resellers', icon: Users, label: 'Revendedores' },
            { id: 'clients', icon: UserCircle, label: 'Clientes' },
            { id: 'settings', icon: Settings, label: 'Configuración' },
          ].map(item => (
            <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === item.id 
                    ? 'bg-[#ccff00] text-black font-bold shadow-[0_0_20px_rgba(204,255,0,0.3)]' 
                    : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
            >
                <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                </div>
                {item.badge && item.badge > 0 ? (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                        {item.badge}
                    </span>
                ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={onClose} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors text-sm text-zinc-300">
            <X className="w-4 h-4" /> Volver a Tienda
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative ml-64 p-8 z-10 overflow-y-auto h-screen">
        
        {/* SETTINGS TAB (Configuration) */}
        {activeTab === 'settings' && (
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
                                    <img src={siteContent[brand.key as keyof SiteContent] as string} className="h-full object-contain" />
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
                <p className="text-zinc-400 mb-6 text-sm">Carga una imagen para el fondo de la sección principal (Hero) de cada marca. Si se deja vacío, se usará el fondo predeterminado.</p>
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
                                    <img src={siteContent[brand.key as keyof SiteContent] as string} className="w-full h-full object-cover opacity-60" />
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
        )}

        {/* PROMOTIONS TAB */}
        {activeTab === 'promotions' && (
             <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-8">
               <div>
                  <h1 className="text-3xl font-black text-white italic">BANNERS Y <span className="text-[#ccff00]">OFERTAS</span></h1>
                  <p className="text-zinc-500 text-sm">Gestiona la publicidad destacada en la página principal</p>
               </div>
               <button onClick={() => { setCurrentBanner({ brand: 'informa', active: true, relatedProducts: [], discountPercentage: 0 }); setIsEditingBanner(true); }} className="bg-[#ccff00] text-black px-6 py-2 rounded-lg hover:bg-[#b3e600] flex items-center gap-2 font-bold hover:scale-105 transition-transform">
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
                                     onClick={() => { setCurrentBanner({...banner}); setIsEditingBanner(true); }}
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
           </div>
        )}

        {/* ... Inventory, Resellers, Clients, Messages, Analytics Tabs ... */}
        {activeTab === 'inventory' && (
             <div className="animate-fade-in">
                 {/* Content of inventory tab */}
                 <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white italic">GESTIÓN DE <span className="text-[#ccff00]">INVENTARIO</span></h1>
                        <p className="text-sm text-zinc-500 mt-1">Administra tus productos y stock</p>
                    </div>
                    
                    <div className="flex gap-3">
                        {/* BRAND FILTER FOR INVENTORY */}
                        <div className="relative">
                            <select 
                                value={inventoryFilterBrand}
                                onChange={(e) => setInventoryFilterBrand(e.target.value as any)}
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
                            onClick={() => { setCurrentProduct({ brand: 'informa', active: true, stock: 10, category: 'Alto Rendimiento' }); setIsEditingProduct(true); }}
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
                                         <img src={product.image} className="w-10 h-10 rounded-lg object-cover bg-zinc-800" />
                                         <div className="font-bold text-white">{product.name}</div>
                                     </td>
                                     <td className="px-6 py-4"><span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                                        product.brand === 'informa' ? 'bg-zinc-800 text-zinc-400' :
                                        product.brand === 'iqual' ? 'bg-indigo-900/40 text-indigo-300' : 
                                        product.brand === 'biofarma' ? 'bg-blue-900/40 text-blue-300' : 'bg-emerald-900/40 text-emerald-300'
                                     }`}>{product.brand}</span></td>
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
                                             <button onClick={() => { setCurrentProduct({...product}); setIsEditingProduct(true); }} className="text-blue-400 p-2 hover:bg-white/5 rounded"><Edit2 className="w-4 h-4"/></button>
                                             <button onClick={() => handleDeleteProduct(product.id)} className="text-red-400 p-2 hover:bg-white/5 rounded"><Trash2 className="w-4 h-4"/></button>
                                         </div>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                </div>
            </div>
        )}
        
        {/* ... Resellers, Clients, Messages, Analytics Tabs ... */}
        {activeTab === 'resellers' && (
            <div className="animate-fade-in">
                {/* ... Reseller Table ... */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-white italic">RED DE <span className="text-[#ccff00]">REVENDEDORES</span></h1>
                    <button 
                        onClick={() => { setCurrentReseller({ active: true, region: 'Norte', points: 0 }); setIsEditingReseller(true); }}
                        className="bg-[#ccff00] text-black px-6 py-2 rounded-lg hover:bg-[#b3e600] flex items-center gap-2 font-bold"
                    >
                        <Plus className="w-5 h-5" /> Nuevo Partner
                    </button>
                </div>
                {/* ... table omitted for brevity ... */}
                <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead className="bg-black/40 text-zinc-400 text-sm">
                            <tr>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Región</th>
                                <th className="px-6 py-4">Ventas</th>
                                <th className="px-6 py-4">Puntos</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {resellers.map(reseller => (
                                <tr key={reseller.id} className="hover:bg-white/5">
                                    <td className="px-6 py-4 font-bold text-white">{reseller.name}</td>
                                    <td className="px-6 py-4 text-zinc-400">{reseller.email}</td>
                                    <td className="px-6 py-4"><span className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-xs uppercase">{reseller.region}</span></td>
                                    <td className="px-6 py-4 font-mono text-zinc-300">${reseller.sales.reduce((acc, s) => acc + s.total, 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-[#ccff00] font-bold">{reseller.points || 0}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => { setCurrentReseller(reseller); setIsEditingReseller(true); }} className="text-blue-400 p-2"><Edit2 className="w-4 h-4"/></button>
                                            <button onClick={() => handleDeleteReseller(reseller.id)} className="text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
        
        {/* ... Clients, Messages, Analytics Tabs ... */}
        {/* (Keep existing logic for these) */}
        {activeTab === 'clients' && (
            <div className="animate-fade-in">
                 <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-white italic">CLIENTES <span className="text-[#ccff00]">ADMINISTRADOS</span></h1>
                    <button 
                        onClick={() => { setCurrentClient({ paymentMethod: 'Efectivo', currentAccountBalance: 0 }); setIsEditingClient(true); }}
                        className="bg-[#ccff00] text-black px-6 py-2 rounded-lg hover:bg-[#b3e600] flex items-center gap-2 font-bold"
                    >
                        <Plus className="w-5 h-5" /> Nuevo Cliente
                    </button>
                </div>
                 <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead className="bg-black/40 text-zinc-400 text-sm">
                            <tr>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">Teléfono</th>
                                <th className="px-6 py-4">Pago Pref.</th>
                                <th className="px-6 py-4">Saldo Cta. Cte.</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-white/5">
                            {adminClients.map(client => (
                                <tr key={client.id} className="hover:bg-white/5">
                                    <td className="px-6 py-4 font-bold text-white">{client.name}</td>
                                    <td className="px-6 py-4 text-zinc-400">{client.phone}</td>
                                    <td className="px-6 py-4 text-zinc-400">{client.paymentMethod}</td>
                                    <td className={`px-6 py-4 font-bold ${client.currentAccountBalance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        ${client.currentAccountBalance.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                         <div className="flex justify-end gap-2">
                                            <button onClick={() => { setCurrentClient(client); setIsEditingClient(true); }} className="text-blue-400 p-2"><Edit2 className="w-4 h-4"/></button>
                                            <button onClick={() => handleDeleteClient(client.id)} className="text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                 </div>
            </div>
        )}

        {/* ... Messages ... */}
        {activeTab === 'messages' && (
            <div className="animate-fade-in flex flex-col h-[calc(100vh-12rem)] rounded-2xl overflow-hidden relative">
                
                {/* Header for Messages */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold text-xl">Centro de Mensajes</h3>
                    <button 
                        onClick={() => setIsComposingMessage(true)}
                        className="bg-[#ccff00] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#b3e600] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Nuevo Mensaje
                    </button>
                </div>

                <div className="flex flex-1 bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="w-1/3 border-r border-white/5 bg-black/20">
                        <div className="p-4 border-b border-white/5">
                            <h3 className="text-white font-bold text-sm uppercase tracking-wider text-zinc-500">Bandeja de Entrada</h3>
                        </div>
                        <div className="overflow-y-auto h-full">
                            {resellers.map(r => {
                                const unread = r.messages.filter(m => m.sender === 'reseller' && !m.read).length;
                                return (
                                    <button 
                                        key={r.id} 
                                        onClick={() => handleSelectChat(r.id)}
                                        className={`w-full text-left p-4 hover:bg-white/5 transition-colors border-b border-white/5 ${selectedChatResellerId === r.id ? 'bg-[#ccff00]/10 border-l-4 border-l-[#ccff00]' : ''}`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`font-bold ${selectedChatResellerId === r.id ? 'text-[#ccff00]' : 'text-white'}`}>{r.name}</span>
                                            {unread > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unread}</span>}
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate">{r.messages[r.messages.length - 1]?.content || 'Sin mensajes'}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="w-2/3 flex flex-col bg-black/40">
                        {selectedChatResellerId ? (
                            <>
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {resellers.find(r => r.id === selectedChatResellerId)?.messages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-4 rounded-xl ${msg.sender === 'admin' ? 'bg-[#ccff00] text-black' : 'bg-zinc-800 text-white'}`}>
                                                <p className="text-sm">{msg.content}</p>
                                                <span className="text-[10px] block mt-1 opacity-60 text-right">{msg.timestamp}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-white/10 bg-black/60">
                                    <form onSubmit={handleSendAdminMessage} className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={adminMessageInput}
                                            onChange={(e) => setAdminMessageInput(e.target.value)}
                                            placeholder="Escribe un mensaje..."
                                            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ccff00] outline-none"
                                        />
                                        <button className="bg-[#ccff00] text-black p-3 rounded-xl hover:bg-[#b3e600]"><Send className="w-5 h-5" /></button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-500">
                                Selecciona un chat o crea un mensaje nuevo
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* ... Analytics ... */}
        {activeTab === 'analytics' && (
             <div className="animate-fade-in space-y-8">
                <h1 className="text-3xl font-black text-white italic">ESTADÍSTICAS <span className="text-[#ccff00]">GLOBALES</span></h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                        <div className="flex gap-4 items-center">
                            <div className="p-3 bg-green-500/20 text-green-500 rounded-lg"><DollarSign className="w-8 h-8" /></div>
                            <div>
                                <p className="text-zinc-500 text-sm">Valor Inventario</p>
                                <h3 className="text-2xl font-bold text-white">${products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                        <div className="flex gap-4 items-center">
                            <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg"><Users className="w-8 h-8" /></div>
                            <div>
                                <p className="text-zinc-500 text-sm">Total Revendedores</p>
                                <h3 className="text-2xl font-bold text-white">{resellers.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                        <div className="flex gap-4 items-center">
                            <div className="p-3 bg-purple-500/20 text-purple-500 rounded-lg"><Package className="w-8 h-8" /></div>
                            <div>
                                <p className="text-zinc-500 text-sm">Productos Activos</p>
                                <h3 className="text-2xl font-bold text-white">{products.filter(p => p.active).length}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 h-64 flex flex-col justify-center items-center">
                         <BarChart3 className="w-16 h-16 text-zinc-700 mb-2" />
                         <p className="text-zinc-500">Gráfico de Ventas (Próximamente)</p>
                     </div>
                     <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 h-64 flex flex-col justify-center items-center">
                         <TrendingUp className="w-16 h-16 text-zinc-700 mb-2" />
                         <p className="text-zinc-500">Rendimiento por Región (Próximamente)</p>
                     </div>
                </div>
             </div>
        )}

        {/* NEW MESSAGE MODAL */}
        {isComposingMessage && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                 <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl animate-scale-in">
                     <div className="flex justify-between items-center mb-6">
                         <h3 className="text-xl font-bold text-white flex items-center gap-2">
                             <Mail className="w-5 h-5 text-[#ccff00]" /> Nuevo Mensaje
                         </h3>
                         <button onClick={() => setIsComposingMessage(false)}><X className="w-5 h-5 text-zinc-500 hover:text-white" /></button>
                     </div>
                     
                     <div className="space-y-6">
                         {/* Type Selector */}
                         <div className="grid grid-cols-2 gap-3 p-1 bg-black/40 rounded-xl">
                             <button 
                                onClick={() => setComposeType('private')}
                                className={`py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${composeType === 'private' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-white'}`}
                             >
                                 <Users className="w-4 h-4" /> Privado
                             </button>
                             <button 
                                onClick={() => setComposeType('broadcast')}
                                className={`py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${composeType === 'broadcast' ? 'bg-[#ccff00] text-black shadow' : 'text-zinc-500 hover:text-white'}`}
                             >
                                 <Megaphone className="w-4 h-4" /> Difusión
                             </button>
                         </div>

                         {/* Recipient Selector (Only for Private) */}
                         {composeType === 'private' && (
                             <div>
                                 <label className="block text-xs font-bold text-zinc-400 mb-1 ml-1">Destinatario</label>
                                 <select 
                                    value={composeRecipientId}
                                    onChange={(e) => setComposeRecipientId(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]"
                                 >
                                     <option value="">Seleccionar Revendedor...</option>
                                     {resellers.map(r => (
                                         <option key={r.id} value={r.id}>{r.name} ({r.region})</option>
                                     ))}
                                 </select>
                             </div>
                         )}

                         {/* Broadcast Warning */}
                         {composeType === 'broadcast' && (
                             <div className="p-3 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-xl text-[#ccff00] text-xs">
                                 ⚠️ Estás por enviar un mensaje a <strong>todos los revendedores ({resellers.length})</strong>. Úsalo para anuncios importantes.
                             </div>
                         )}

                         {/* Message Content */}
                         <div>
                             <label className="block text-xs font-bold text-zinc-400 mb-1 ml-1">Mensaje</label>
                             <textarea 
                                rows={4}
                                value={composeContent}
                                onChange={(e) => setComposeContent(e.target.value)}
                                placeholder="Escribe tu mensaje aquí..."
                                className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]"
                             />
                         </div>
                     </div>

                     <div className="flex justify-end gap-2 mt-8">
                         <button onClick={() => setIsComposingMessage(false)} className="text-zinc-400 px-4 py-2 hover:bg-white/5 rounded-xl transition-colors">Cancelar</button>
                         <button 
                            onClick={handleComposeSend}
                            disabled={!composeContent || (composeType === 'private' && !composeRecipientId)}
                            className="bg-[#ccff00] text-black px-6 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-[#b3e600] disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                             <Send className="w-4 h-4" /> Enviar
                         </button>
                     </div>
                 </div>
            </div>
        )}

        {/* Existing Modals ... */}
        {isEditingProduct && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                 <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                     <h3 className="text-2xl font-black text-white italic mb-6">EDITAR <span className="text-[#ccff00]">PRODUCTO</span></h3>
                     <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">Nombre del Producto</label>
                            <input type="text" placeholder="Nombre" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]" value={currentProduct.name} onChange={e=>setCurrentProduct({...currentProduct, name: e.target.value})} />
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Precio</label>
                                 <input type="number" placeholder="Precio" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]" value={currentProduct.price} onChange={e=>setCurrentProduct({...currentProduct, price: Number(e.target.value)})} />
                            </div>
                            <div className="w-1/2">
                                 <label className="block text-xs font-bold text-zinc-400 mb-1">Stock</label>
                                 <input type="number" placeholder="Stock" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]" value={currentProduct.stock} onChange={e=>setCurrentProduct({...currentProduct, stock: Number(e.target.value)})} />
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
                             <input type="text" placeholder="Categoría" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]" value={currentProduct.category} onChange={e=>setCurrentProduct({...currentProduct, category: e.target.value})} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">Descripción Corta</label>
                            <textarea rows={2} placeholder="Descripción" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]" value={currentProduct.description} onChange={e=>setCurrentProduct({...currentProduct, description: e.target.value})} />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">Descripción Detallada (Modal)</label>
                            <textarea rows={4} placeholder="Descripción completa que aparece en el detalle..." className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]" value={currentProduct.longDescription} onChange={e=>setCurrentProduct({...currentProduct, longDescription: e.target.value})} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">URL de Imagen</label>
                            <input type="text" placeholder="URL Imagen" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-[#ccff00]" value={currentProduct.image} onChange={e=>setCurrentProduct({...currentProduct, image: e.target.value})} />
                        </div>
                     </div>
                     <div className="flex justify-end gap-2 mt-8">
                         <button onClick={()=>setIsEditingProduct(false)} className="text-zinc-400 px-4 py-2 hover:bg-white/5 rounded-xl">Cancelar</button>
                         <button onClick={handleSaveProduct} className="bg-[#ccff00] text-black px-6 py-2 rounded-xl font-bold shadow-lg">Guardar</button>
                     </div>
                 </div>
            </div>
        )}

        {/* Reseller Modal */}
        {isEditingReseller && (
             <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                 <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl">
                     <h3 className="text-xl font-bold text-white mb-4">Editar Revendedor</h3>
                     <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">Nombre</label>
                            <input type="text" placeholder="Nombre" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" value={currentReseller.name || ''} onChange={e => setCurrentReseller({...currentReseller, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">Email</label>
                            <input type="email" placeholder="Email" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" value={currentReseller.email || ''} onChange={e => setCurrentReseller({...currentReseller, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">Contraseña</label>
                            <input type="text" placeholder="Contraseña" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" value={currentReseller.password || ''} onChange={e => setCurrentReseller({...currentReseller, password: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">Región</label>
                            <input type="text" placeholder="Región" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" value={currentReseller.region || ''} onChange={e => setCurrentReseller({...currentReseller, region: e.target.value})} />
                        </div>
                     </div>
                     <div className="flex justify-end gap-2 mt-6">
                         <button onClick={() => setIsEditingReseller(false)} className="text-zinc-400 px-4 py-2 hover:bg-white/5 rounded-lg">Cancelar</button>
                         <button onClick={handleSaveReseller} className="bg-[#ccff00] text-black px-6 py-2 rounded-lg font-bold">Guardar</button>
                     </div>
                 </div>
             </div>
        )}

        {/* Client Modal */}
        {isEditingClient && (
             <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                 <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl">
                     <h3 className="text-xl font-bold text-white mb-4">Editar Cliente</h3>
                     <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">Nombre</label>
                            <input type="text" placeholder="Nombre" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" value={currentClient.name || ''} onChange={e => setCurrentClient({...currentClient, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">Teléfono</label>
                            <input type="text" placeholder="Teléfono" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" value={currentClient.phone || ''} onChange={e => setCurrentClient({...currentClient, phone: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">Método de Pago</label>
                            <select 
                                value={currentClient.paymentMethod}
                                onChange={(e) => setCurrentClient({...currentClient, paymentMethod: e.target.value as any})}
                                className="w-full bg-black/50 border border-white/10 p-3 rounded text-white"
                            >
                                <option value="Efectivo">Efectivo</option>
                                <option value="Transferencia">Transferencia</option>
                                <option value="Tarjeta">Tarjeta</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">Saldo Cta. Cte.</label>
                            <input type="number" placeholder="Saldo Cta Cte" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" value={currentClient.currentAccountBalance || 0} onChange={e => setCurrentClient({...currentClient, currentAccountBalance: Number(e.target.value)})} />
                        </div>
                     </div>
                     <div className="flex justify-end gap-2 mt-6">
                         <button onClick={() => setIsEditingClient(false)} className="text-zinc-400 px-4 py-2 hover:bg-white/5 rounded-lg">Cancelar</button>
                         <button onClick={handleSaveClient} className="bg-[#ccff00] text-black px-6 py-2 rounded-lg font-bold">Guardar</button>
                     </div>
                 </div>
             </div>
        )}

        {/* Banner Modal */}
        {isEditingBanner && (
             <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                 <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
                     <h3 className="text-xl font-bold text-white mb-4">Editar Banner</h3>
                     <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">Título</label>
                            <input type="text" placeholder="Título" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" value={currentBanner.title || ''} onChange={e => setCurrentBanner({...currentBanner, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">Descripción</label>
                            <textarea rows={3} placeholder="Descripción" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" value={currentBanner.description || ''} onChange={e => setCurrentBanner({...currentBanner, description: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">URL Imagen</label>
                            <input type="text" placeholder="URL Imagen" className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" value={currentBanner.image || ''} onChange={e => setCurrentBanner({...currentBanner, image: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1">Marca</label>
                            <select 
                                value={currentBanner.brand}
                                onChange={(e) => setCurrentBanner({...currentBanner, brand: e.target.value as any})}
                                className="w-full bg-black/50 border border-white/10 p-3 rounded text-white"
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
                                    className="flex-1 bg-black/50 border border-white/10 p-2 rounded text-xs text-white"
                                >
                                    <option value="">Seleccionar Producto...</option>
                                    {products
                                        .filter(p => p.brand === currentBanner.brand || !currentBanner.brand) // Filter by brand if selected
                                        .map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={promoQuantity}
                                    onChange={(e) => setPromoQuantity(Math.max(1, Number(e.target.value)))}
                                    className="w-16 bg-black/50 border border-white/10 p-2 rounded text-xs text-white text-center"
                                />
                                <button 
                                    onClick={handleAddProductToBanner}
                                    className="bg-[#ccff00] text-black p-2 rounded hover:bg-[#b3e600]"
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
                         <button onClick={() => setIsEditingBanner(false)} className="text-zinc-400 px-4 py-2 hover:bg-white/5 rounded-lg">Cancelar</button>
                         <button onClick={handleSaveBanner} className="bg-[#ccff00] text-black px-6 py-2 rounded-lg font-bold">Guardar</button>
                     </div>
                 </div>
             </div>
        )}

      </div>
    </div>
  );
};
