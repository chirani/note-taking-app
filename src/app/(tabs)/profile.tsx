import { ThemedText, ThemedView } from "@/components/ui";
import { spacing } from "@/config/ui";
import { useTheme } from "@/hooks/theme";
import { TouchableOpacity } from "react-native";

export default function Profile() {
  const { colors, mode, toggleTheme } = useTheme();
  return (
    <ThemedView style={{ flex: 1, paddingHorizontal: spacing.xl }}>
      <ThemedView style={{ height: 20 }} />
      <TouchableOpacity onPressOut={() => toggleTheme()}>
        <ThemedView
          style={{
            padding: spacing.xl,
            backgroundColor: colors.colorBase200,
            borderRadius: 4,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <ThemedText size="small">Toggle Theme</ThemedText>
          <ThemedText size="small">{mode}</ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </ThemedView>
  );
}
