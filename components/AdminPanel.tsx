import React, { useState } from 'react';
import { Product, ContactInfo, Banner, Reseller, Client, SiteContent, PaymentConfig, SocialReview } from '../types';
import { 
  X, Settings, Package, LayoutDashboard, 
  Tag, Users, UserCircle, Bell, BarChart3
} from 'lucide-react';

// Importamos los componentes modulares
import InventoryTab from './admin/InventoryTab';
import PromotionsTab from './admin/PromotionsTab';
import ResellersTab from './admin/ResellersTab';
import ClientsTab from './admin/ClientsTab';
import MessagesTab from './admin/MessagesTab';
import AnalyticsTab from './admin/AnalyticsTab';
import SettingsTab from './admin/SettingsTab';

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

  // Safety Check
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

  const totalUnreadMessages = resellers.reduce((acc, r) => acc + r.messages.filter(m => m.sender === 'reseller' && !m.read).length, 0);

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
        
        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
             <InventoryTab products={products} setProducts={setProducts} />
        )}

        {/* PROMOTIONS TAB */}
        {activeTab === 'promotions' && (
             <PromotionsTab banners={banners} setBanners={setBanners} products={products} />
        )}
        
        {/* RESELLERS TAB */}
        {activeTab === 'resellers' && (
            <ResellersTab resellers={resellers} setResellers={setResellers} products={products} />
        )}
        
        {/* CLIENTS TAB */}
        {activeTab === 'clients' && (
            <ClientsTab adminClients={adminClients} setAdminClients={setAdminClients} />
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
            <MessagesTab resellers={resellers} setResellers={setResellers} />
        )}
        
        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
             <AnalyticsTab products={products} resellers={resellers} />
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
            <SettingsTab 
                siteContent={siteContent} 
                setSiteContent={setSiteContent} 
                contactInfo={contactInfo} 
                setContactInfo={setContactInfo}
                paymentConfig={paymentConfig}
                setPaymentConfig={setPaymentConfig}
            />
        )}

      </div>
    </div>
  );
};