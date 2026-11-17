import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { ThemedView } from "@/components/ui";
import { spacing } from "@/config/ui";
import { router } from "expo-router";

export default function Home() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView
        style={{
          height: 50,
          width: "100%",
          borderBottomWidth: 2,
        }}
      ></ThemedView>
      <FloatingActionButton
        icon="add"
        accessibilityLabel="New todo"
        offset={spacing.xl}
        onPress={() => router.push("/todos/new")}
      />
    </ThemedView>
  );
}
