
export type Brand = 'informa' | 'phisis' | 'iqual' | 'biofarma';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

export interface SocialReview {
    id: string;
    imageUrl: string;
    brand: Brand | 'both'; // A qué marca pertenece el comentario
}

export interface PaymentMethodConfig {
    enabled: boolean;
    alias?: string;
    cbu?: string;
    bankName?: string;
    holderName?: string;
}

export interface PaymentConfig {
    cash: PaymentMethodConfig;
    transfer: PaymentMethodConfig;
    card: PaymentMethodConfig;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string; // New field for detailed view
  usageMode?: string; // New field for detailed view
  price: number;
  brand: Brand;
  category: string;
  image: string;
  features?: string[];
  stock: number;
  active: boolean;
}

// Interface specific for the Peptone Catalog (Vademécum)
export interface PeptoneFormula {
    code: string; // e.g., APG, ART
    name: string; // e.g., Arteriotrófica
    ingredients: string;
    recommendations: string;
    description: string; // Full description from Vademecum
    presentations: ('Ampollas' | 'Comprimidos' | 'Gotas')[];
}

export interface CartItem extends Product {
  quantity: number;
  discount?: number;
  selectedPresentation?: string; // To store if user picked Ampollas/Comprimidos
}

export interface SiteContent {
  sportsHeroTitle1: string;
  sportsHeroTitle2: string;
  sportsHeroDescription: string;
  logoInforma?: string;
  sportsHeroBg?: string; // New
  
  beautyHeroTitle1: string;
  beautyHeroTitle2: string;
  beautyHeroDescription: string;
  logoPhisis?: string;
  beautyHeroBg?: string; // New
  
  fragranceHeroTitle1: string;
  fragranceHeroTitle2: string;
  fragranceHeroDescription: string;
  logoIqual?: string;
  fragranceHeroBg?: string; // New

  bioHeroTitle1: string;
  bioHeroTitle2: string;
  bioHeroDescription: string;
  logoBiofarma?: string;
  bioHeroBg?: string; // New
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  instagram: string;
}

export interface PromotionItem {
  productId: string;
  quantity: number;
  discountPercentage?: number;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  brand: Brand;
  active: boolean;
  discountPercentage?: number;
  relatedProducts: PromotionItem[]; // Si está vacío, es solo informativo
}

export type Category = 'Todos' | 'Alto Rendimiento' | 'Adelgazantes' | 'Energizantes' | 'Nutricosmética' | 'Cuidado Piel' | 'Fragancias' | 'Cuidado Corporal' | 'Facial' | 'Salud Integral' | 'Peptonas' | 'Revitalización' | 'Genética';

// --- RESELLER TYPES ---

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'Efectivo' | 'Transferencia' | 'Tarjeta';
  currentAccountBalance: number; // Saldo deudor o a favor
  lastOrderDate?: string;
}

export interface Message {
  id: string;
  sender: 'admin' | 'reseller';
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ResellerOrder {
  id: string;
  clientId: string; // ID del propio revendedor si es auto-compra o referencia
  clientName: string;
  items: CartItem[];
  total: number;
  status: 'Pendiente' | 'En Camino' | 'Entregado' | 'Cancelado';
  date: string;
  deliveryTimeEstimate?: string; // e.g. "24-48hs"
}

export interface Sale {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
}

export interface Reseller {
  id: string;
  name: string;
  email: string;
  password: string; // En una app real esto estaría hasheado
  region: string;
  active: boolean;
  stock: Product[]; // Stock propio del revendedor
  clients: Client[];
  orders: ResellerOrder[]; // Pedidos de reposición al Admin
  sales: Sale[]; // Ventas realizadas a sus clientes finales
  messages: Message[];
  points: number; // Sistema de gamificación
}
