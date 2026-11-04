import { ThemedView } from "@/components/ui";

export default function Home() {
  return (
    <ThemedView>
      <ThemedView
        style={{
          height: 50,
          width: "100%",
          borderBottomColor: "red",
          borderBottomWidth: 2,
        }}
      ></ThemedView>
    </ThemedView>
  );
}
