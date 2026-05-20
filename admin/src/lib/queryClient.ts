import { QueryClient } from "@tanstack/react-query";

/** Shared React Query client — import from store/mutations to invalidate analytics. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
