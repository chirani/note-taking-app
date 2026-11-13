import { ThemedView } from "@/components/ui";

export default function Inbox() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView
        style={{
          height: 50,
          width: "100%",
          borderBottomColor: "teal",
          borderBottomWidth: 2,
        }}
      ></ThemedView>
    </ThemedView>
  );
}
