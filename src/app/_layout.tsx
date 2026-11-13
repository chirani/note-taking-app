import { DATABASE_NAME, migrateDbIfNeeded } from "@/db";
import { useTheme } from "@/hooks/theme";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const [dbError, setDbError] = useState<Error | null>(null);

  const initializeDatabase = useCallback(async (db: SQLiteDatabase) => {
    try {
      await migrateDbIfNeeded(db);
    } catch (error) {
      console.error("Failed to initialize the database", error);
      setDbError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      await SplashScreen.hideAsync();
    }
  }, []);

  if (dbError) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.colorBase100,
          paddingTop: insets.top,
          padding: 24,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StatusBar
          style={mode === "dark" ? "dark" : "light"}
          animated={false}
        />
        <Text
          style={{
            color: colors.colorBaseContent,
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Couldn&apos;t open the database
        </Text>
        <Text style={{ color: colors.colorBaseContent, textAlign: "center" }}>
          {dbError.message}
        </Text>
      </View>
    );
  }

  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={initializeDatabase}>
      <View style={{ flex: 1, backgroundColor: "red" }}>
        <View
          style={{ height: insets.top, backgroundColor: colors.colorPrimary }}
        />
        <StatusBar
          style={mode === "dark" ? "dark" : "light"}
          animated={false}
        />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="design"
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
        <View
          style={{
            height: insets.bottom,
            backgroundColor: colors.colorPrimary,
          }}
        />
      </View>
    </SQLiteProvider>
  );
}
