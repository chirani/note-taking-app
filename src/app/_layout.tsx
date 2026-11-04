import { useTheme } from "@/hooks/theme";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const { colors } = useTheme();

  useEffect(() => {
    const loadSession = async () => {
      SplashScreen.hide();
    };

    loadSession();
  }, []);

  return (
    <>
      <StatusBar animated />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            contentStyle: { backgroundColor: colors.colorBase100 },
          }}
        />

        <Stack.Screen
          name="explore"
          options={{
            contentStyle: { backgroundColor: colors.colorBase100 },
          }}
        />
      </Stack>
    </>
  );
}
