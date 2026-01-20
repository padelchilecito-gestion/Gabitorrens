

import React from 'react';
import { SocialReview, Brand } from '../types';
import { Instagram, Facebook } from 'lucide-react';

interface SocialProofProps {
    reviews: SocialReview[];
    activeBrand: Brand;
}

const SocialProof: React.FC<SocialProofProps> = ({ reviews, activeBrand }) => {
    // Filter reviews relevant to the current brand or global ones ('both')
    const filteredReviews = reviews.filter(r => r.brand === activeBrand || r.brand === 'both');

    if (filteredReviews.length === 0) return null;

    const isSports = activeBrand === 'informa';
    const isIqual = activeBrand === 'iqual';

    const bgClass = isSports ? 'bg-black border-white/5' : isIqual ? 'bg-slate-900 border-white/5' : 'bg-stone-50 border-emerald-100/50';
    const iconBg = isSports ? 'bg-[#ccff00]/10 text-[#ccff00]' : isIqual ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-100 text-emerald-800';
    const titleColor = isSports || isIqual ? 'text-white' : 'text-emerald-950 font-serif';
    const spanColor = isSports ? 'text-[#ccff00]' : isIqual ? 'text-indigo-400' : 'text-emerald-600';

    return (
        <div className={`py-12 border-b ${bgClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-center gap-3 mb-8 animate-fade-in">
                    <div className={`p-2 rounded-full ${iconBg}`}>
                        <Instagram className="w-5 h-5" />
                    </div>
                    <h2 className={`text-2xl font-bold italic ${titleColor}`}>
                        LO QUE DICEN <span className={spanColor}>ELLOS</span>
                    </h2>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="relative group">
                    <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide">
                        {filteredReviews.map((review, idx) => (
                            <div 
                                key={review.id} 
                                className={`flex-shrink-0 w-64 md:w-72 rounded-2xl overflow-hidden snap-center transform transition-transform duration-300 hover:scale-[1.02] border shadow-xl ${
                                    isSports 
                                    ? 'border-white/10 bg-zinc-900/50 shadow-[#ccff00]/5' 
                                    : isIqual 
                                        ? 'border-white/10 bg-slate-800/50 shadow-indigo-500/5'
                                        : 'border-emerald-100 bg-white shadow-emerald-900/5'
                                }`}
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                {/* Mock Header to look like Social Media Post */}
                                <div className={`px-4 py-3 flex items-center gap-2 border-b ${
                                    isSports ? 'border-white/5 bg-zinc-900' : isIqual ? 'border-white/5 bg-slate-800' : 'border-gray-100 bg-gray-50'
                                }`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSports || isIqual ? 'bg-white/10' : 'bg-white border'}`}>
                                        <Instagram className={`w-4 h-4 ${isSports || isIqual ? 'text-white' : 'text-pink-600'}`} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-xs font-bold ${isSports || isIqual ? 'text-white' : 'text-gray-900'}`}>Cliente Feliz</span>
                                        <span className={`text-[10px] ${isSports || isIqual ? 'text-gray-500' : 'text-gray-400'}`}>Vía Instagram Stories</span>
                                    </div>
                                </div>
                                
                                {/* The Screenshot Image */}
                                <div className="relative">
                                    <img 
                                        src={review.imageUrl} 
                                        alt="Testimonio Cliente" 
                                        className="w-full h-auto object-cover max-h-[500px]"
                                        loading="lazy"
                                    />
                                    {/* Gradient overlay for better text readability if image has text at bottom */}
                                    <div className={`absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t ${isSports || isIqual ? 'from-black/80' : 'from-black/20'} to-transparent`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Fade Edges indicating scroll */}
                    <div className={`absolute inset-y-0 right-0 w-20 bg-gradient-to-l pointer-events-none ${isSports ? 'from-black' : isIqual ? 'from-slate-900' : 'from-stone-50'} to-transparent`}></div>
                </div>

            </div>
        </div>
    );
};

export default SocialProof;
