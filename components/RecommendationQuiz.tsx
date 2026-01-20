
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Sparkles, ArrowRight, RefreshCw, X, Search, Activity, Heart, Zap, Smile, Check } from 'lucide-react';

interface QuizProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
    onAddToCart: (product: Product) => void;
}

type Goal = 'sports' | 'beauty' | 'health' | 'scent';
type SpecificNeed = 'muscle' | 'weight' | 'energy' | 'antiage' | 'hair' | 'skin' | 'immunity' | 'stress' | 'bones' | 'fresh' | 'intense' | 'daily';

const RecommendationQuiz: React.FC<QuizProps> = ({ isOpen, onClose, products, onAddToCart }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<{ goal?: Goal, need?: SpecificNeed, gender?: string }>({});
    const [result, setResult] = useState<Product | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStep(0);
            setAnswers({});
            setResult(null);
            setIsScanning(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleGoalSelect = (goal: Goal) => {
        setAnswers({ ...answers, goal });
        setStep(1);
    };

    const handleNeedSelect = (need: SpecificNeed) => {
        setAnswers({ ...answers, need });
        setStep(2);
    };

    const handleGenderSelect = (gender: string) => {
        const finalAnswers = { ...answers, gender };
        setAnswers(finalAnswers);
        runScanner(finalAnswers);
    };

    const runScanner = (finalAnswers: { goal?: Goal, need?: SpecificNeed, gender?: string }) => {
        setIsScanning(true);
        
        // Simular tiempo de "Escaneo" para efecto visual
        setTimeout(() => {
            const match = findBestMatch(finalAnswers);
            setResult(match);
            setIsScanning(false);
            setStep(3);
        }, 2000);
    };

    const findBestMatch = ({ goal, need, gender }: { goal?: Goal, need?: SpecificNeed, gender?: string }) => {
        // 1. Filtrar por Gran Categoría (Marca / Tipo)
        let candidates = products.filter(p => p.stock > 0); // Solo productos con stock

        switch (goal) {
            case 'sports':
                candidates = candidates.filter(p => 
                    p.brand === 'informa' || 
                    ['Alto Rendimiento', 'Adelgazantes', 'Energizantes'].includes(p.category)
                );
                break;
            case 'beauty':
                candidates = candidates.filter(p => 
                    p.brand === 'phisis' || 
                    ['Nutricosmética', 'Cuidado Piel', 'Facial', 'Cuidado Corporal'].includes(p.category)
                );
                break;
            case 'health':
                candidates = candidates.filter(p => 
                    p.brand === 'biofarma' || 
                    ['Salud Integral', 'Revitalización', 'Genética', 'Peptonas'].includes(p.category)
                );
                break;
            case 'scent':
                candidates = candidates.filter(p => 
                    p.brand === 'iqual' || 
                    ['Fragancias'].includes(p.category)
                );
                break;
        }

        // 2. Filtrar por Necesidad Específica (Tags, Descripción, Categoría)
        let specificCandidates = candidates.filter(p => {
            const text = (p.name + ' ' + p.description + ' ' + p.category + ' ' + (p.features?.join(' ') || '')).toLowerCase();
            
            switch (need) {
                // Sports
                case 'muscle': return text.includes('masa') || text.includes('fuerza') || text.includes('muscul') || text.includes('proteína') || text.includes('creatina');
                case 'weight': return text.includes('peso') || text.includes('grasa') || text.includes('slim') || text.includes('adelgaz');
                case 'energy': return text.includes('energ') || text.includes('rendimiento') || text.includes('potencia');
                
                // Beauty
                case 'antiage': return text.includes('age') || text.includes('arrugas') || text.includes('joven') || text.includes('celular') || text.includes('nad');
                case 'hair': return text.includes('pelo') || text.includes('cabello') || text.includes('uñas');
                case 'skin': return text.includes('piel') || text.includes('exfoli') || text.includes('hidrat');
                
                // Health
                case 'immunity': return text.includes('inmun') || text.includes('defensa') || text.includes('vitamin');
                case 'stress': return text.includes('estrés') || text.includes('cansancio') || text.includes('cerebro') || text.includes('nervio');
                case 'bones': return text.includes('hueso') || text.includes('articul') || text.includes('calcio');

                // Scent
                case 'fresh': return text.includes('fresco') || text.includes('cítric') || text.includes('verano') || text.includes('día');
                case 'intense': return text.includes('madera') || text.includes('noche') || text.includes('intenso') || text.includes('especi');
                case 'daily': return true; // Cualquiera sirve para diario

                default: return true;
            }
        });

        // Si el filtro específico vació la lista, volvemos a los candidatos generales de la categoría
        if (specificCandidates.length === 0) specificCandidates = candidates;

        // 3. Filtrar por Género (Solo si es relevante, ej: Fragancias o Salud Hormonal)
        let genderCandidates = specificCandidates;
        if (gender && gender !== 'unisex') {
            const genderMatches = specificCandidates.filter(p => {
                const text = (p.name + ' ' + p.description).toLowerCase();
                if (gender === 'male') return text.includes('hombre') || text.includes('masc') || text.includes('testo');
                if (gender === 'female') return text.includes('mujer') || text.includes('fem') || text.includes('meno');
                return false;
            });
            // Solo aplicamos filtro de género si hay resultados específicos, sino mostramos unisex
            if (genderMatches.length > 0) genderCandidates = genderMatches;
        }

        // 4. Selección Final (Random entre los mejores candidatos)
        const finalPool = genderCandidates.length > 0 ? genderCandidates : candidates;
        
        // Fallback absoluto si no hay nada en esa marca (raro)
        if (finalPool.length === 0) return products[0];

        return finalPool[Math.floor(Math.random() * finalPool.length)];
    };

    const reset = () => {
        setStep(0);
        setAnswers({});
        setResult(null);
        setIsScanning(false);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-20">
                    <X className="w-6 h-6" />
                </button>

                {/* SCANNER ANIMATION VIEW */}
                {isScanning && (
                    <div className="flex-1 flex flex-col items-center justify-center animate-fade-in text-center">
                        <div className="relative w-32 h-32 mb-8">
                            <div className="absolute inset-0 border-4 border-[#ccff00]/30 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 border-4 border-t-[#ccff00] rounded-full animate-spin"></div>
                            <Search className="absolute inset-0 m-auto text-white w-10 h-10 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Analizando Bio-Tipología...</h3>
                        <p className="text-zinc-500 text-sm">Escaneando catálogo completo en busca de tu match ideal.</p>
                        <div className="mt-8 font-mono text-xs text-[#ccff00]">
                             PROCESANDO DATOS: {answers.goal?.toUpperCase()} / {answers.need?.toUpperCase()}
                        </div>
                    </div>
                )}

                {/* STEPS VIEW */}
                {!isScanning && (
                    <>
                        {/* HEADER */}
                        <div className="text-center mb-8 relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 mb-4">
                                <Sparkles className="w-3 h-3 text-[#ccff00]" /> BIO-SCANNER IA
                            </div>
                            <div className="flex justify-center gap-2 mb-2">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className={`h-1 w-8 rounded-full transition-colors ${step > i ? 'bg-[#ccff00]' : step === i ? 'bg-white' : 'bg-white/10'}`}></div>
                                ))}
                            </div>
                        </div>

                        {/* STEP 0: MAIN GOAL */}
                        {step === 0 && (
                            <div className="animate-slide-up flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2 text-center">¿Qué estás buscando hoy?</h2>
                                <p className="text-zinc-400 mb-8 text-center text-sm">Selecciona el área principal para enfocar la búsqueda.</p>
                                
                                <div className="grid grid-cols-1 gap-3">
                                    <button onClick={() => handleGoalSelect('sports')} className="flex items-center p-4 rounded-xl bg-white/5 hover:bg-[#ccff00] hover:text-black border border-white/5 transition-all group">
                                        <div className="p-2 bg-black/20 rounded-lg mr-4 group-hover:bg-black/10"><Zap className="w-5 h-5" /></div>
                                        <div className="text-left">
                                            <span className="block font-bold">Rendimiento Deportivo</span>
                                            <span className="text-xs opacity-60">Masa muscular, energía, peso</span>
                                        </div>
                                        <ArrowRight className="ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>

                                    <button onClick={() => handleGoalSelect('beauty')} className="flex items-center p-4 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/5 transition-all group">
                                        <div className="p-2 bg-black/20 rounded-lg mr-4 group-hover:bg-black/10"><Sparkles className="w-5 h-5" /></div>
                                        <div className="text-left">
                                            <span className="block font-bold">Estética y Belleza</span>
                                            <span className="text-xs opacity-60">Piel, cabello, anti-age</span>
                                        </div>
                                        <ArrowRight className="ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>

                                    <button onClick={() => handleGoalSelect('scent')} className="flex items-center p-4 rounded-xl bg-white/5 hover:bg-indigo-500 hover:text-white border border-white/5 transition-all group">
                                        <div className="p-2 bg-black/20 rounded-lg mr-4 group-hover:bg-black/10"><Smile className="w-5 h-5" /></div>
                                        <div className="text-left">
                                            <span className="block font-bold">Fragancias y Estilo</span>
                                            <span className="text-xs opacity-60">Perfumes, cuidado personal</span>
                                        </div>
                                        <ArrowRight className="ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>

                                    <button onClick={() => handleGoalSelect('health')} className="flex items-center p-4 rounded-xl bg-white/5 hover:bg-blue-600 hover:text-white border border-white/5 transition-all group">
                                        <div className="p-2 bg-black/20 rounded-lg mr-4 group-hover:bg-black/10"><Heart className="w-5 h-5" /></div>
                                        <div className="text-left">
                                            <span className="block font-bold">Salud Integral</span>
                                            <span className="text-xs opacity-60">Inmunidad, estrés, prevención</span>
                                        </div>
                                        <ArrowRight className="ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 1: SPECIFIC NEED (Dynamic based on Goal) */}
                        {step === 1 && (
                            <div className="animate-slide-up flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2 text-center">Profundicemos un poco...</h2>
                                <p className="text-zinc-400 mb-8 text-center text-sm">¿Cuál es tu prioridad específica?</p>
                                
                                <div className="grid grid-cols-1 gap-3">
                                    {answers.goal === 'sports' && (
                                        <>
                                            <button onClick={() => handleNeedSelect('muscle')} className="p-4 rounded-xl bg-white/5 hover:bg-[#ccff00] hover:text-black border border-white/5 font-bold transition-all">Ganar Masa Muscular / Fuerza</button>
                                            <button onClick={() => handleNeedSelect('weight')} className="p-4 rounded-xl bg-white/5 hover:bg-[#ccff00] hover:text-black border border-white/5 font-bold transition-all">Quemar Grasa / Definición</button>
                                            <button onClick={() => handleNeedSelect('energy')} className="p-4 rounded-xl bg-white/5 hover:bg-[#ccff00] hover:text-black border border-white/5 font-bold transition-all">Energía y Recuperación</button>
                                        </>
                                    )}
                                    {answers.goal === 'beauty' && (
                                        <>
                                            <button onClick={() => handleNeedSelect('antiage')} className="p-4 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/5 font-bold transition-all">Rejuvenecimiento (Anti-Age)</button>
                                            <button onClick={() => handleNeedSelect('hair')} className="p-4 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/5 font-bold transition-all">Cabello y Uñas Fuertes</button>
                                            <button onClick={() => handleNeedSelect('skin')} className="p-4 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/5 font-bold transition-all">Piel Radiante / Hidratación</button>
                                        </>
                                    )}
                                    {answers.goal === 'scent' && (
                                        <>
                                            <button onClick={() => handleNeedSelect('fresh')} className="p-4 rounded-xl bg-white/5 hover:bg-indigo-500 hover:text-white border border-white/5 font-bold transition-all">Fresco / Cítrico / Día</button>
                                            <button onClick={() => handleNeedSelect('intense')} className="p-4 rounded-xl bg-white/5 hover:bg-indigo-500 hover:text-white border border-white/5 font-bold transition-all">Intenso / Amaderado / Noche</button>
                                            <button onClick={() => handleNeedSelect('daily')} className="p-4 rounded-xl bg-white/5 hover:bg-indigo-500 hover:text-white border border-white/5 font-bold transition-all">Uso Diario / Versátil</button>
                                        </>
                                    )}
                                    {answers.goal === 'health' && (
                                        <>
                                            <button onClick={() => handleNeedSelect('immunity')} className="p-4 rounded-xl bg-white/5 hover:bg-blue-600 hover:text-white border border-white/5 font-bold transition-all">Subir Defensas / Inmunidad</button>
                                            <button onClick={() => handleNeedSelect('stress')} className="p-4 rounded-xl bg-white/5 hover:bg-blue-600 hover:text-white border border-white/5 font-bold transition-all">Combatir Estrés / Cansancio</button>
                                            <button onClick={() => handleNeedSelect('bones')} className="p-4 rounded-xl bg-white/5 hover:bg-blue-600 hover:text-white border border-white/5 font-bold transition-all">Huesos y Articulaciones</button>
                                        </>
                                    )}
                                </div>
                                <button onClick={() => setStep(0)} className="mt-6 text-xs text-zinc-500 hover:text-white w-full text-center">Volver atrás</button>
                            </div>
                        )}

                        {/* STEP 2: GENDER / CONTEXT */}
                        {step === 2 && (
                            <div className="animate-slide-up flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2 text-center">Último paso</h2>
                                <p className="text-zinc-400 mb-8 text-center text-sm">¿Para quién buscamos?</p>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => handleGenderSelect('male')} className="p-8 rounded-2xl bg-white/5 hover:bg-blue-900/40 hover:border-blue-500 border border-white/5 transition-all group">
                                        <div className="text-3xl mb-2">👨</div>
                                        <span className="font-bold text-white">Para Él</span>
                                    </button>
                                    <button onClick={() => handleGenderSelect('female')} className="p-8 rounded-2xl bg-white/5 hover:bg-pink-900/40 hover:border-pink-500 border border-white/5 transition-all group">
                                        <div className="text-3xl mb-2">👩</div>
                                        <span className="font-bold text-white">Para Ella</span>
                                    </button>
                                    <button onClick={() => handleGenderSelect('unisex')} className="col-span-2 p-4 rounded-xl bg-white/5 hover:bg-purple-900/40 hover:border-purple-500 border border-white/5 transition-all">
                                        <span className="font-bold text-white">Indistinto / Unisex</span>
                                    </button>
                                </div>
                                <button onClick={() => setStep(1)} className="mt-6 text-xs text-zinc-500 hover:text-white w-full text-center">Volver atrás</button>
                            </div>
                        )}

                        {/* STEP 3: RESULT */}
                        {step === 3 && result && (
                            <div className="animate-scale-in text-center flex-1 flex flex-col items-center">
                                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                                    <Check className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">¡Match Encontrado!</h2>
                                <p className="text-zinc-400 mb-6 text-sm">Este producto es ideal para tus objetivos.</p>

                                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 w-full max-w-sm hover:border-[#ccff00]/30 transition-colors">
                                    <img src={result.image} alt={result.name} className="w-32 h-32 object-cover rounded-lg mx-auto mb-4 bg-zinc-800" />
                                    <h3 className="text-lg font-bold text-white mb-1">{result.name}</h3>
                                    <div className="mb-3">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border border-white/10 ${
                                            result.brand === 'informa' ? 'text-[#ccff00] bg-[#ccff00]/10' :
                                            result.brand === 'phisis' ? 'text-emerald-400 bg-emerald-400/10' :
                                            result.brand === 'iqual' ? 'text-indigo-400 bg-indigo-400/10' :
                                            result.brand === 'biofarma' ? 'text-blue-400 bg-blue-400/10' : 'text-white'
                                        }`}>
                                            {result.category}
                                        </span>
                                    </div>
                                    <p className="text-zinc-400 text-xs mb-4 line-clamp-2">{result.description}</p>
                                    <p className="text-[#ccff00] font-bold text-xl mb-4">${result.price.toLocaleString()}</p>
                                    
                                    <button 
                                        onClick={() => { onAddToCart(result); onClose(); }}
                                        className="w-full py-3 bg-[#ccff00] text-black font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        AGREGAR AL CARRITO
                                    </button>
                                </div>

                                <button onClick={reset} className="mt-auto pt-6 text-zinc-500 hover:text-white text-xs flex items-center justify-center gap-2">
                                    <RefreshCw className="w-3 h-3" /> Realizar nuevo escaneo
                                </button>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

export default RecommendationQuiz;
