import {
  ThemedButton,
  ThemedScrollView,
  ThemedText,
  ThemedTextInput,
} from "@/components/ui";
import { useTheme } from "@/hooks/theme";
import { View } from "react-native";

export default function HomeScreen() {
  const { colors } = useTheme();
  return (
    <>
      <ThemedScrollView style={{ paddingHorizontal: 16 }}>
        <View style={{ height: 100 }} />
        <View style={{ marginBottom: 16 }}>
          <ThemedText
            size="h3"
            color={colors.colorPrimary}
            style={{ marginBottom: 16 }}
          >
            Text Styles
          </ThemedText>

          <ThemedText size="h1">This is H1 Text_ </ThemedText>
          <ThemedText size="h2">This is H2 Text_ </ThemedText>
          <ThemedText size="h3">This is H3 Text_ </ThemedText>
          <ThemedText size="regular">This is Regular Text_ </ThemedText>
          <ThemedText size="small">This is Small Text_</ThemedText>
        </View>
        <View style={{ gap: 16, alignItems: "flex-start" }}>
          <ThemedText
            size="h3"
            color={colors.colorSecondary}
            style={{ marginBottom: 16 }}
          >
            Button Styles
          </ThemedText>
          <ThemedButton size="xl">Regular X-Large</ThemedButton>
          <ThemedButton size="lg">Regular Large</ThemedButton>
          <ThemedButton size="md">Regular Medium</ThemedButton>
          <ThemedButton size="md" pending>
            Regular Medium
          </ThemedButton>
          <ThemedButton size="md" variant="outline">
            Outline Medium
          </ThemedButton>
          <ThemedButton size="md" variant="transparent">
            Transparent Medium
          </ThemedButton>
          <ThemedButton size="sm">Regular Small</ThemedButton>
        </View>
        <View style={{ height: 16 }} />
        <View style={{ gap: 16, alignItems: "stretch" }}>
          <ThemedText
            size="h3"
            color={colors.colorSecondary}
            style={{ marginBottom: 16 }}
          >
            Input Styles
          </ThemedText>
          <ThemedTextInput placeholder="email" />
          <ThemedTextInput placeholder="username" />
          <View style={{ height: 100 }} />
        </View>
      </ThemedScrollView>
    </>
  );
}
