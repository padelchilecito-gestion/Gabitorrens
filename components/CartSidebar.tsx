
import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Truck, Check, ArrowRight, CreditCard, Wallet, Banknote, ShieldCheck, Copy, CheckCircle2 } from 'lucide-react';
import { CartItem, Brand, ContactInfo, User, PaymentConfig } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  activeBrand: Brand;
  contactInfo: ContactInfo;
  paymentConfig: PaymentConfig;
  currentUser: User | null;
  onLogin: () => Promise<void>;
}

type CheckoutStep = 'cart' | 'login' | 'payment';
type PaymentType = 'full' | 'deposit'; // 100% or 50%
type PaymentMethod = 'transfer' | 'card' | 'cash';

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  onRemoveItem, 
  onUpdateQuantity,
  activeBrand,
  contactInfo,
  paymentConfig,
  currentUser,
  onLogin
}) => {
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType>('full');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [copiedAlias, setCopiedAlias] = useState(false);

  const isSports = activeBrand === 'informa';
  const isIqual = activeBrand === 'iqual';
  const isBio = activeBrand === 'biofarma';
  const isDark = isSports || isIqual;

  // Colors Logic
  const bgMain = isSports ? 'bg-[#0f0f0f]' : isIqual ? 'bg-slate-900' : 'bg-white';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const accentColor = isSports ? 'text-[#ccff00]' : isIqual ? 'text-indigo-400' : isBio ? 'text-blue-800' : 'text-emerald-700';
  const accentBg = isSports ? 'bg-[#ccff00]' : isIqual ? 'bg-indigo-600' : isBio ? 'bg-blue-900' : 'bg-emerald-800';
  const accentTextBtn = isSports ? 'text-black' : 'text-white';
  const borderCol = isDark ? 'border-white/10' : 'border-gray-100';

  // Calculate total considering potential discounts
  const total = cart.reduce((acc, item) => {
      const discount = item.discount || 0;
      const finalPrice = item.price - (item.price * (discount / 100));
      return acc + (finalPrice * item.quantity);
  }, 0);

  // Calculate final amounts based on selection
  const payNowAmount = paymentType === 'full' ? total : total * 0.5;
  const payLaterAmount = total - payNowAmount;

  // Calcular fecha de entrega (3 días desde hoy)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDate = deliveryDate.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  const handleInitialCheckoutClick = () => {
      if (currentUser) {
          setCheckoutStep('payment');
      } else {
          setCheckoutStep('login');
      }
  };

  const performLogin = async () => {
      setIsLoggingIn(true);
      await onLogin();
      setIsLoggingIn(false);
      setCheckoutStep('payment');
  };

  const handleCopyAlias = () => {
      if (paymentConfig.transfer.alias) {
          navigator.clipboard.writeText(paymentConfig.transfer.alias);
          setCopiedAlias(true);
          setTimeout(() => setCopiedAlias(false), 2000);
      }
  };

  const handleFinalWhatsApp = () => {
    // 1. Limpiar el número de teléfono
    const cleanPhone = contactInfo.phone.replace(/[^\d]/g, '');

    if (!cleanPhone) {
        alert("El número de contacto no está configurado correctamente.");
        return;
    }

    if (!paymentMethod) {
        alert("Por favor selecciona un método de pago.");
        return;
    }

    // 2. Construir el mensaje detallado
    let message = `*NUEVO PEDIDO WEB* 🛒\n`;
    message += `Cliente: *${currentUser?.name}*\n`;
    message += `Marca: *${activeBrand.toUpperCase()}*\n\n`;
    
    message += `*DETALLE DEL PEDIDO:*\n`;
    cart.forEach(item => {
        const discount = item.discount || 0;
        const finalPrice = item.price - (item.price * (discount / 100));
        message += `▪️ ${item.quantity}x ${item.name} ($${finalPrice.toLocaleString()})\n`;
    });

    message += `\n----------------------------------\n`;
    message += `*TOTAL COMPRA: $${total.toLocaleString()}*\n`;
    message += `----------------------------------\n\n`;

    message += `*CONFIGURACIÓN DE PAGO:*\n`;
    message += `📝 Esquema: *${paymentType === 'full' ? 'PAGO COMPLETO (100%)' : 'SEÑA (50%) PARA ENCARGAR'}*\n`;
    
    let methodText = '';
    if (paymentMethod === 'transfer') {
        methodText = 'Transferencia Bancaria';
        message += `💳 Método: *${methodText}*\n`;
        message += `⚠️ *ESTADO: PAGO REALIZADO (ADJUNTO COMPROBANTE)*\n`;
    } else if (paymentMethod === 'card') {
        methodText = 'Tarjeta Crédito/Débito';
        message += `💳 Método: *${methodText}*\n`;
        message += `(Solicitar link de pago)\n`;
    } else {
        methodText = 'Efectivo';
        message += `💳 Método: *${methodText}*\n`;
    }

    message += `\n*A PAGAR AHORA: $${payNowAmount.toLocaleString()}*\n`;
    if (payLaterAmount > 0) {
        message += `Saldo pendiente contra entrega: $${payLaterAmount.toLocaleString()}\n`;
    }

    message += `\n📍 *Datos de Entrega:*\n`;
    message += `Dirección registrada en cuenta: ${currentUser?.email}\n`; // Usando email como referencia simple
    message += `(Confirmar dirección exacta en el chat)`;

    // 3. Codificar y Enviar
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const resetFlow = () => {
      setCheckoutStep('cart');
      onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={resetFlow}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${bgMain}`}>
        
        {/* Header (Shared) */}
        <div className={`px-6 py-5 border-b flex items-center justify-between ${borderCol}`}>
            <div className="flex items-center gap-3">
              <ShoppingBag className={`w-5 h-5 ${isDark ? 'text-white' : isBio ? 'text-blue-900' : 'text-emerald-800'}`} />
              <h2 className={`text-lg font-bold ${textMain}`}>
                {checkoutStep === 'cart' && "Tu Carrito"}
                {checkoutStep === 'login' && "Iniciar Sesión"}
                {checkoutStep === 'payment' && "Finalizar Pedido"}
              </h2>
            </div>
            <button onClick={resetFlow} className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}>
              <X className="w-5 h-5" />
            </button>
        </div>

        {/* --- STEP 1: CART VIEW --- */}
        {checkoutStep === 'cart' && (
            <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                isDark ? 'bg-white/5' : isBio ? 'bg-blue-50' : 'bg-emerald-50'
                            }`}>
                                <ShoppingBag className={`w-8 h-8 ${textMuted}`} />
                            </div>
                            <p className={`${textMuted}`}>Tu carrito está vacío</p>
                        </div>
                    ) : (
                        cart.map((item) => {
                            const hasDiscount = item.discount && item.discount > 0;
                            const finalPrice = item.price - (item.price * ((item.discount || 0) / 100));

                            return (
                                <div key={item.id} className="flex gap-4 group">
                                    <div className={`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border ${
                                        isDark ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'
                                    }`}>
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className={`font-bold line-clamp-1 ${textMain}`}>{item.name}</h3>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                                    item.brand === 'informa' 
                                                    ? 'bg-[#ccff00] text-black' 
                                                    : item.brand === 'iqual'
                                                        ? 'bg-indigo-600 text-white'
                                                        : item.brand === 'biofarma'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-emerald-100 text-emerald-800'
                                                }`}>
                                                    {item.brand}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-2">
                                            <div className={`flex items-center border rounded-lg ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                                                <button 
                                                    onClick={() => onUpdateQuantity(item.id, -1)}
                                                    className={`w-8 h-8 flex items-center justify-center transition-colors ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-50'}`}
                                                >-</button>
                                                <span className={`px-2 text-sm font-medium w-8 text-center ${textMain}`}>{item.quantity}</span>
                                                <button 
                                                    onClick={() => onUpdateQuantity(item.id, 1)}
                                                    className={`w-8 h-8 flex items-center justify-center transition-colors ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-50'}`}
                                                >+</button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    {hasDiscount && (
                                                        <div className="flex items-center justify-end gap-1">
                                                            <span className="text-xs text-gray-500 line-through">
                                                                ${(item.price * item.quantity).toLocaleString()}
                                                            </span>
                                                            <span className="text-[10px] bg-red-500/10 text-red-500 px-1 rounded font-bold">
                                                                -{item.discount}%
                                                            </span>
                                                        </div>
                                                    )}
                                                    <span className={`font-bold ${
                                                        hasDiscount ? 'text-red-500' : textMain
                                                    }`}>
                                                        ${(finalPrice * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={() => onRemoveItem(item.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                {cart.length > 0 && (
                    <div className={`border-t p-6 ${isDark ? 'border-white/10 bg-black/20' : 'border-gray-100 bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <span className={textMuted}>Total a pagar</span>
                            <span className={`text-2xl font-black ${textMain}`}>${total.toLocaleString()}</span>
                        </div>
                        <button 
                            onClick={handleInitialCheckoutClick}
                            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-lg shadow-xl hover:scale-105 ${accentBg} ${accentTextBtn}`}>
                            FINALIZAR COMPRA
                        </button>
                    </div>
                )}
            </>
        )}

        {/* ... (Step 2: Login Overlay remains mostly the same, using isDark/isBio logic implicitly) ... */}
        {checkoutStep === 'login' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                 <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                     isDark ? 'bg-white/5' : isBio ? 'bg-blue-50' : 'bg-emerald-50'
                 }`}>
                     <ShieldCheck className={`w-10 h-10 ${isSports ? 'text-[#ccff00]' : isIqual ? 'text-indigo-400' : isBio ? 'text-blue-600' : 'text-emerald-600'}`} />
                 </div>
                 <h3 className={`text-2xl font-bold mb-2 ${textMain}`}>
                     Identifícate
                 </h3>
                 <p className={`mb-8 max-w-xs ${textMuted}`}>
                     Para garantizar la seguridad de tu pedido, necesitamos que inicies sesión.
                 </p>

                 <button 
                    onClick={performLogin}
                    disabled={isLoggingIn}
                    className={`w-full max-w-sm py-3 px-4 rounded-xl flex items-center justify-center gap-3 font-medium transition-all transform hover:scale-105 ${
                        isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                    }`}
                 >
                     {isLoggingIn ? (
                         <span className="animate-pulse">Conectando...</span>
                     ) : (
                         <>
                            Iniciar sesión con Google
                         </>
                     )}
                 </button>
                 
                 <button 
                    onClick={() => setCheckoutStep('cart')}
                    className={`mt-6 text-sm hover:underline ${textMuted}`}
                 >
                     Volver al carrito
                 </button>
            </div>
        )}

        {/* ... (Step 3: Payment uses accent colors already defined) ... */}
        {checkoutStep === 'payment' && (
            <div className="flex-1 flex flex-col h-full animate-fade-in overflow-y-auto">
                 <div className="p-6 space-y-8">
                     
                     {/* User Info */}
                     <div className={`p-4 rounded-xl flex items-center gap-3 ${isDark ? 'bg-white/5' : isBio ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                         <img src={currentUser?.avatar} className="w-10 h-10 rounded-full" alt="" />
                         <div>
                             <p className={`text-sm font-bold ${textMain}`}>{currentUser?.name}</p>
                             <p className={`text-xs ${isSports ? 'text-gray-400' : isIqual ? 'text-indigo-200' : isBio ? 'text-blue-700' : 'text-emerald-700'}`}>{currentUser?.email}</p>
                         </div>
                     </div>

                     {/* Payment Percentage */}
                     <div>
                         <h3 className={`font-bold mb-3 ${textMain}`}>1. ¿Cómo quieres pagar?</h3>
                         <div className="grid grid-cols-2 gap-3">
                             <button 
                                onClick={() => setPaymentType('full')}
                                className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                                    paymentType === 'full' 
                                    ? (isSports ? 'border-[#ccff00] bg-[#ccff00]/10' : isIqual ? 'border-indigo-500 bg-indigo-500/10' : isBio ? 'border-blue-600 bg-blue-50' : 'border-emerald-600 bg-emerald-50')
                                    : (isDark ? 'border-white/10 bg-black/40' : 'border-gray-200 bg-white')
                                }`}
                             >
                                 {paymentType === 'full' && (
                                     <div className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center ${
                                         isSports ? 'bg-[#ccff00] text-black' : isIqual ? 'bg-indigo-500 text-white' : isBio ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                                     }`}><Check className="w-3 h-3" /></div>
                                 )}
                                 <span className={`block text-xs font-bold uppercase mb-1 ${textMuted}`}>Recomendado</span>
                                 <span className={`block font-bold text-lg mb-1 ${textMain}`}>100%</span>
                                 <span className={`text-xs ${textMuted}`}>Pago completo ahora</span>
                             </button>

                             <button 
                                onClick={() => setPaymentType('deposit')}
                                className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                                    paymentType === 'deposit' 
                                    ? (isSports ? 'border-[#ccff00] bg-[#ccff00]/10' : isIqual ? 'border-indigo-500 bg-indigo-500/10' : isBio ? 'border-blue-600 bg-blue-50' : 'border-emerald-600 bg-emerald-50')
                                    : (isDark ? 'border-white/10 bg-black/40' : 'border-gray-200 bg-white')
                                }`}
                             >
                                 {paymentType === 'deposit' && (
                                     <div className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center ${
                                         isSports ? 'bg-[#ccff00] text-black' : isIqual ? 'bg-indigo-500 text-white' : isBio ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                                     }`}><Check className="w-3 h-3" /></div>
                                 )}
                                 <span className={`block text-xs font-bold uppercase mb-1 ${textMuted}`}>Seña</span>
                                 <span className={`block font-bold text-lg mb-1 ${textMain}`}>50%</span>
                                 <span className={`text-xs ${textMuted}`}>El resto al recibir</span>
                             </button>
                         </div>
                     </div>

                     {/* Payment Method */}
                     <div>
                        <h3 className={`font-bold mb-3 ${textMain}`}>2. Método de Pago</h3>
                        <div className="space-y-2">
                            {paymentConfig.transfer.enabled && (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setPaymentMethod('transfer')}
                                        className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
                                            paymentMethod === 'transfer' 
                                            ? (isSports ? 'bg-[#ccff00] text-black font-bold' : isIqual ? 'bg-indigo-600 text-white font-bold' : isBio ? 'bg-blue-900 text-white font-bold' : 'bg-emerald-800 text-white font-bold')
                                            : (isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                                        }`}
                                    >
                                        <Banknote className="w-5 h-5" />
                                        Transferencia Bancaria
                                    </button>
                                    
                                    {paymentMethod === 'transfer' && (
                                        <div className={`p-4 rounded-lg border text-sm space-y-3 animate-fade-in ${
                                            isDark ? 'bg-black/40 border-white/10' : 'bg-blue-50 border-blue-100'
                                        }`}>
                                            <div className="flex justify-between items-center">
                                                <span className={textMuted}>Banco/Billetera:</span>
                                                <span className={`font-bold ${textMain}`}>{paymentConfig.transfer.bankName}</span>
                                            </div>
                                            <div className="p-3 bg-black/10 rounded flex items-center justify-between border border-black/5">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase text-gray-500 font-bold">Alias</span>
                                                    <span className={`font-mono text-lg font-bold ${accentColor}`}>
                                                        {paymentConfig.transfer.alias}
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={handleCopyAlias}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white hover:bg-gray-50 text-emerald-800 shadow-sm'
                                                    }`}
                                                >
                                                    {copiedAlias ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            <p className="text-xs text-center text-gray-500 italic">
                                                ⚠️ Realiza el pago ahora. Se solicitará el comprobante al finalizar.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {paymentConfig.card.enabled && (
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
                                        paymentMethod === 'card' 
                                        ? (isSports ? 'bg-[#ccff00] text-black font-bold' : isIqual ? 'bg-indigo-600 text-white font-bold' : isBio ? 'bg-blue-900 text-white font-bold' : 'bg-emerald-800 text-white font-bold')
                                        : (isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                                    }`}
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Tarjeta Crédito / Débito
                                </button>
                            )}

                            {paymentConfig.cash.enabled && (
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
                                        paymentMethod === 'cash' 
                                        ? (isSports ? 'bg-[#ccff00] text-black font-bold' : isIqual ? 'bg-indigo-600 text-white font-bold' : isBio ? 'bg-blue-900 text-white font-bold' : 'bg-emerald-800 text-white font-bold')
                                        : (isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                                    }`}
                                >
                                    <Wallet className="w-5 h-5" />
                                    Efectivo
                                </button>
                            )}
                        </div>
                     </div>

                     {/* Summary */}
                     <div className={`p-4 rounded-xl border space-y-2 ${
                         isDark ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-gray-50'
                     }`}>
                         <div className="flex justify-between text-sm">
                             <span className={textMuted}>Total Carrito</span>
                             <span className={textMain}>${total.toLocaleString()}</span>
                         </div>
                         {paymentType === 'deposit' && (
                             <div className="flex justify-between text-sm">
                                <span className={textMuted}>Pendiente (Contra entrega)</span>
                                <span className={textMain}>${payLaterAmount.toLocaleString()}</span>
                             </div>
                         )}
                         <div className={`border-t pt-2 mt-2 flex justify-between font-bold text-lg ${
                             isDark ? 'border-white/10 ' + accentColor : isBio ? 'border-gray-200 text-blue-800' : 'border-gray-200 text-emerald-700'
                         }`}>
                             <span>A Pagar Ahora</span>
                             <span>${payNowAmount.toLocaleString()}</span>
                         </div>
                     </div>
                 </div>

                 <div className={`p-6 mt-auto border-t ${
                     isDark ? 'border-white/10 bg-black/40' : 'border-gray-100 bg-white'
                 }`}>
                     <button 
                        onClick={handleFinalWhatsApp}
                        disabled={!paymentMethod}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg shadow-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed ${accentBg} ${accentTextBtn}`}
                     >
                         {paymentMethod === 'transfer' 
                            ? "CONFIRMAR Y ENVIAR COMPROBANTE" 
                            : "CONFIRMAR PEDIDO"
                         } 
                         <ArrowRight className="w-5 h-5" />
                     </button>
                     <button 
                        onClick={() => setCheckoutStep('cart')}
                        className={`w-full mt-3 text-sm hover:underline ${textMuted}`}
                     >
                         Volver
                     </button>
                 </div>
            </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
