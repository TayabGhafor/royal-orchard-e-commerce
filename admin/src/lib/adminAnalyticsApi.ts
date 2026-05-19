import { api } from "./api";

export type SalesPayload = {
  totalSales: number;
  todaySales: number;
  weeklySales: number;
  monthlySales: number;
  revenue: number;
  orders: number;
  returnedOrders: number;
  pendingOrders: number;
  dailySalesTrend: { day: string; amount: number }[];
  monthlyRevenueTrend: { month: string; amount: number }[];
  orderStatusDistribution: { name: string; value: number }[];
};

export type TrendingItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  salesCount: number;
  viewsCount: number;
  trendingScore: number;
  progress: number;
};

export type UpcomingItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  growthPercent: number;
  cartMomentum: number;
  badge: string;
  expectedDemand: string;
  label: string;
};

export type ReturnsPayload = {
  totalReturns: number;
  returnRate: number;
  reasons: Record<string, number>;
  mostReturned: { productId: string; name: string; image: string; quantityReturned: number }[];
};

export type InventoryPayload = {
  outOfStock: { productId: string; name: string; slug: string; image: string; quantity: number; daysRemainingEstimate: number | null; band: string }[];
  lowStock: { productId: string; name: string; slug: string; image: string; quantity: number; daysRemainingEstimate: number | null; band: string }[];
  criticalStock: { productId: string; name: string; slug: string; image: string; quantity: number; daysRemainingEstimate: number | null; band: string }[];
};

export type SeasonalPayload = {
  seasons: {
    season: string;
    productCount: number;
    stockQuantity: number;
    salesTrend30d: number;
    products: { name: string; stock: number; sold: number }[];
  }[];
  seasonVsSales: { season: string; sales: number; stock: number }[];
};

export type RecommendationItem = {
  priority: string;
  title: string;
  detail: string;
  productId: string;
};

export type HitItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  views: number;
  sales: number;
  conversionPercent: number;
};

export type InsightItem = {
  id: string;
  title: string;
  detail: string;
  tone: string;
};

function withAdmin<T>(path: string) {
  return api<T>(path, { admin: true });
}

export const fetchAdminSales = () => withAdmin<SalesPayload>("/api/admin/analytics/sales");
export const fetchAdminTrending = () => withAdmin<{ items: TrendingItem[] }>("/api/admin/analytics/trending");
export const fetchAdminUpcoming = () => withAdmin<{ items: UpcomingItem[] }>("/api/admin/analytics/upcoming-trending");
export const fetchAdminReturns = () => withAdmin<ReturnsPayload>("/api/admin/analytics/returns");
export const fetchAdminInventory = () => withAdmin<InventoryPayload>("/api/admin/analytics/inventory");
export const fetchAdminSeasonal = () => withAdmin<SeasonalPayload>("/api/admin/analytics/seasonal");
export const fetchAdminRecommendations = () => withAdmin<{ items: RecommendationItem[] }>("/api/admin/analytics/recommendations");
export const fetchAdminHits = () => withAdmin<{ items: HitItem[]; chart: { name: string; hits: number }[] }>("/api/admin/analytics/hits");
export const fetchAdminInsights = () => withAdmin<{ items: InsightItem[] }>("/api/admin/analytics/insights");
