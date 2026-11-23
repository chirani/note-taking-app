import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { AppState, Platform, type AppStateStatus } from "react-native";

const MINUTE = 1000 * 60;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: MINUTE,
        gcTime: 24 * 60 * MINUTE,
        retry: 2,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === "active");
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }

    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
