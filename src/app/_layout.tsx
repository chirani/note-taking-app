import { DATABASE_NAME, migrateDbIfNeeded } from "@/db";
import { useTheme } from "@/hooks/theme";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

async function initializeDatabase(db: SQLiteDatabase) {
  await migrateDbIfNeeded(db);
  await SplashScreen.hideAsync();
}

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={initializeDatabase}>
      <View style={{ flex: 1, backgroundColor: colors.colorBase100 }}>
        <View
          style={{ height: insets.top, backgroundColor: colors.colorPrimary }}
        />
        <StatusBar style="light" animated={false} />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
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
      </View>
    </SQLiteProvider>
  );
}
