// src/hooks/useMarginMaximizer.ts
export const calculateTiers = (sqft: number, baseRate: number) => {
  const baseCost = sqft * baseRate;

  return {
    essential: {
      price: baseCost * 1.25,
      cost: baseCost,
      margin: 20, // (2.5k profit on 12.5k price)
    },
    professional: {
      price: baseCost * 1.45,
      cost: baseCost,
      margin: 31,
    },
    platinum: {
      price: baseCost * 1.7 + 1500, // Premium surcharge
      cost: baseCost + 500, // Higher material cost
      margin: 41,
    },
  };
};
