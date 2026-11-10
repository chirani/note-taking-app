import { ThemedView } from "@/components/ui";

export default function Profile() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView
        style={{
          height: 50,
          width: "100%",
          borderBottomWidth: 2,
        }}
      />
    </ThemedView>
  );
}
