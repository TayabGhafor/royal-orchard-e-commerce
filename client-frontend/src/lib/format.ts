/**
 * Currency helpers — RoyalOrchard prices are quoted in PKR (Rs.).
 */
export const formatPKR = (amount: number): string => {
  const rounded = Math.round(amount);
  return `Rs. ${rounded.toLocaleString("en-PK")}`;
};
