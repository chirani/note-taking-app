import { Appearance } from "react-native";
import { create } from "zustand";

export interface ThemeColors {
  colorBase100: string;
  colorBase200: string;
  colorBase300: string;
  colorBaseContent: string;
  colorPrimary: string;
  colorprimaryContent: string;
  colorSecondary: string;
  colorsecondaryContent: string;
  colorAccent: string;
  coloraccentContent: string;
  colorNeutral: string;
  colorneutralContent: string;
  colorInfo: string;
  colorinfoContent: string;
  colorSuccess: string;
  colorsuccessContent: string;
  colorWarning: string;
  colorwarningContent: string;
  colorError: string;
  colorerrorContent: string;
}

export const darkTheme: ThemeColors = {
  colorBase100: "#1e293b",
  colorBase200: "#0f172a",
  colorBase300: "#334155",
  colorBaseContent: "#e2e8f0",
  colorPrimary: "#818cf8",
  colorprimaryContent: "#1e1b4b",
  colorSecondary: "#a78bfa",
  colorsecondaryContent: "#2e1065",
  colorAccent: "#22d3ee",
  coloraccentContent: "#083344",
  colorNeutral: "#475569",
  colorneutralContent: "#f1f5f9",
  colorInfo: "#38bdf8",
  colorinfoContent: "#082f49",
  colorSuccess: "#4ade80",
  colorsuccessContent: "#052e16",
  colorWarning: "#fbbf24",
  colorwarningContent: "#451a03",
  colorError: "#f87171",
  colorerrorContent: "#450a0a",
};

export const lightTheme: ThemeColors = {
  colorBase100: "#ffffff",
  colorBase200: "#f8fafc",
  colorBase300: "#e2e8f0",
  colorBaseContent: "#1e293b",
  colorPrimary: "#4f46e5",
  colorprimaryContent: "#ffffff",
  colorSecondary: "#7c3aed",
  colorsecondaryContent: "#ffffff",
  colorAccent: "#06b6d4",
  coloraccentContent: "#ffffff",
  colorNeutral: "#334155",
  colorneutralContent: "#f8fafc",
  colorInfo: "#0ea5e9",
  colorinfoContent: "#ffffff",
  colorSuccess: "#16a34a",
  colorsuccessContent: "#ffffff",
  colorWarning: "#f59e0b",
  colorwarningContent: "#ffffff",
  colorError: "#dc2626",
  colorerrorContent: "#ffffff",
};

export type ThemeColorKey = keyof ThemeColors;

type ThemeMode = "light" | "dark";

function getSystemMode(): ThemeMode {
  return Appearance.getColorScheme() === "dark" ? "dark" : "light";
}

interface ThemeState {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setCustomTheme: (colors: ThemeColors) => void;
}

const initialMode = getSystemMode();

export const useTheme = create<ThemeState>()((set) => ({
  mode: initialMode,
  colors: initialMode === "dark" ? darkTheme : lightTheme,
  setMode: (mode) =>
    set({
      mode,
      colors: mode === "dark" ? darkTheme : lightTheme,
    }),
  toggleTheme: () =>
    set((state) => {
      const nextMode = state.mode === "light" ? "dark" : "light";
      return {
        mode: nextMode,
        colors: nextMode === "dark" ? darkTheme : lightTheme,
      };
    }),
  setCustomTheme: (colors) => set({ colors }),
}));

// Keep the in-memory theme in sync with the OS light/dark setting.
Appearance.addChangeListener(({ colorScheme }) => {
  if (colorScheme) {
    useTheme.getState().setMode(colorScheme === "dark" ? "dark" : "light");
  }
});
