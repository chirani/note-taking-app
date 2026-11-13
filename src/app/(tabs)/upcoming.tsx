import { ThemedView } from "@/components/ui";

export default function Today() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView
        style={{
          height: 50,
          width: "100%",
          borderBottomColor: "yellow",
          borderBottomWidth: 2,
        }}
      ></ThemedView>
    </ThemedView>
  );
}
