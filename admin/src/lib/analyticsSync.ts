import { queryClient } from "./queryClient";

export const ADMIN_BI_QUERY_KEY = ["admin-bi-suite"] as const;

/** Refetch BI dashboards when orders, products, or inventory change. */
export function invalidateAdminAnalytics() {
  void queryClient.invalidateQueries({ queryKey: ADMIN_BI_QUERY_KEY });
}
