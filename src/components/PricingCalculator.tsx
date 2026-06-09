import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info } from 'lucide-react';
import { PRICING_DATA, PlanType } from '../App';

export default function PricingCalculator() {
  const [animals, setAnimals] = useState<number>(50);
  const [plan, setPlan] = useState<PlanType>('Gestão');

  const calculatePrice = (count: number, currentPlan: PlanType) => {
    const tiers = PRICING_DATA[currentPlan];
    
    // Sort tiers
    const sortedTiers = [...tiers].sort((a, b) => a.animals - b.animals);
    const lastTier = sortedTiers[sortedTiers.length - 1];
    const secondLastTier = sortedTiers[sortedTiers.length - 2];
    
    if (count <= sortedTiers[0].animals) return sortedTiers[0].price;
    
    // Projection for counts > 500
    if (count > lastTier.animals) {
      const priceDiff = lastTier.price - secondLastTier.price;
      const animalDiff = lastTier.animals - secondLastTier.animals;
      const slope = priceDiff / animalDiff;
      return lastTier.price + (count - lastTier.animals) * slope;
    }

    // Linear interpolation for intermediate tiers
    for (let i = 0; i < sortedTiers.length - 1; i++) {
      const lower = sortedTiers[i];
      const upper = sortedTiers[i + 1];
      
      if (count >= lower.animals && count <= upper.animals) {
        const ratio = (count - lower.animals) / (upper.animals - lower.animals);
        return lower.price + ratio * (upper.price - lower.price);
      }
    }
    
    return sortedTiers[0].price;
  };

  const totalPrice = useMemo(() => calculatePrice(animals, plan), [animals, plan]);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="bg-slate-900 px-8 py-10 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-4">
                <img 
                  src="https://preview.saega.com.br/version_2_final/assets/logotipo-so-CgB1U75J.png" 
                  alt="SAEGA Logo" 
                  className="h-12 w-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-slate-400 text-lg">Calculadora de Preços Personalizados</p>
            </div>
            {/* Decorative element */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="p-8">
            {/* animals input */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    Quantidade de Animais
                  </label>
                  {animals > 500 && (
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter mt-1 bg-blue-50 px-2 py-0.5 rounded inline-block w-fit">
                      Modo Projeção
                    </span>
                  )}
                </div>
                <div className="text-3xl font-bold text-slate-900 font-mono">
                  {animals}
                </div>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="10"
                value={animals}
                onChange={(e) => setAnimals(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all"
              />
              <div className="relative mt-2 h-6">
                <span className="absolute left-0 text-xs font-medium text-slate-400">50</span>
                <span 
                  className="absolute -translate-x-1/2 text-xs font-medium text-slate-400"
                  style={{ left: `${((150 - 50) / 1950) * 100}%` }}
                >
                  150
                </span>
                <span 
                  className="absolute -translate-x-1/2 text-xs font-medium text-slate-400"
                  style={{ left: `${((500 - 50) / 1950) * 100}%` }}
                >
                  500
                </span>
                <span 
                  className="absolute -translate-x-1/2 text-xs font-medium text-slate-400"
                  style={{ left: `${((1250 - 50) / 1950) * 100}%` }}
                >
                  1250
                </span>
                <span className="absolute right-0 text-xs font-medium text-slate-400">2000</span>
              </div>
            </div>

            {/* Plan selection */}
            <div className="mb-10">
              <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider block mb-4">
                Selecione o Plano
              </label>
              <div className="grid grid-cols-2 gap-4">
                {(['Gestão', 'Consultoria'] as PlanType[]).map((p) => (
                  <button
                    key={p}
                    id={`plan-${p}`}
                    onClick={() => setPlan(p)}
                    className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                      plan === p 
                        ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-500/10' 
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-bold text-lg ${plan === p ? 'text-blue-900' : 'text-slate-900'}`}>
                          {p}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {p === 'Gestão' ? 'Foco em controle' : 'Acompanhamento técnico'}
                        </p>
                      </div>
                      {plan === p && (
                        <div className="bg-blue-600 rounded-full p-1">
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Result */}
            <div className="mt-12 bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-500 uppercase">Investimento Mensal</span>
                    <Info className="w-4 h-4 text-slate-400 cursor-help" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-400">R$</span>
                    <motion.span 
                      key={totalPrice}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-5xl font-black text-slate-900 tracking-tight"
                    >
                      {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </motion.span>
                  </div>
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-600/20 whitespace-nowrap">
                  Contratar Agora
                </button>
              </div>
            </div>
            
            {/* Comparison info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Custo por Animal', value: `R$ ${(totalPrice / animals).toFixed(2)}` },
                { label: 'Suporte', value: plan === 'Gestão' ? 'Padrão' : 'Prioritário' },
                { label: 'Escalabilidade', value: 'Ilimitada' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="text-xs font-semibold text-slate-400 uppercase mb-1">{item.label}</div>
                  <div className="text-sm font-bold text-slate-800">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        <p className="text-center mt-8 text-slate-400 text-sm">
          Valores calculados proporcionalmente entre as faixas de 50, 150 e 500 animais.
        </p>
      </div>
    </div>
  );
}
