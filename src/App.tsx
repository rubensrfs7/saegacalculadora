import PricingCalculator from './components/PricingCalculator';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PricingTier {
  animals: number;
  price: number;
}

export type PlanType = 'Gestão' | 'Consultoria';

export interface PlanConfig {
  name: PlanType;
  tiers: PricingTier[];
}

export const PRICING_DATA: Record<PlanType, PricingTier[]> = {
  'Gestão': [
    { animals: 50, price: 69.90 },
    { animals: 150, price: 149.90 },
    { animals: 500, price: 249.90 },
  ],
  'Consultoria': [
    { animals: 50, price: 249.90 },
    { animals: 150, price: 349.90 },
    { animals: 500, price: 520.00 },
  ],
};

export default function App() {
  return (
    <div className="antialiased text-slate-900">
      <PricingCalculator />
    </div>
  );
}
