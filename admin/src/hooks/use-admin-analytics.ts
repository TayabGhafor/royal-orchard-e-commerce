import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ADMIN_BI_QUERY_KEY } from "@/lib/analyticsSync";
import {
  fetchAdminHits,
  fetchAdminInsights,
  fetchAdminInventory,
  fetchAdminRecommendations,
  fetchAdminReturns,
  fetchAdminSales,
  fetchAdminSeasonal,
  fetchAdminTrending,
  fetchAdminUpcoming,
} from "@/lib/adminAnalyticsApi";

async function fetchBiSuite() {
  const [sales, trending, upcoming, returns, inventory, seasonal, recommendations, hits, insights] =
    await Promise.all([
      fetchAdminSales(),
      fetchAdminTrending(),
      fetchAdminUpcoming(),
      fetchAdminReturns(),
      fetchAdminInventory(),
      fetchAdminSeasonal(),
      fetchAdminRecommendations(),
      fetchAdminHits(),
      fetchAdminInsights(),
    ]);
  return { sales, trending, upcoming, returns, inventory, seasonal, recommendations, hits, insights };
}

/** Live BI query — polls every 15s, refetches on focus & after admin mutations. */
export function useAdminAnalytics() {
  const [, setClock] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setClock((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return useQuery({
    queryKey: ADMIN_BI_QUERY_KEY,
    queryFn: fetchBiSuite,
    staleTime: 5_000,
    refetchInterval: () => (typeof document !== "undefined" && document.hidden ? false : 15_000),
    refetchOnWindowFocus: true,
    retry: 1,
  });
}
