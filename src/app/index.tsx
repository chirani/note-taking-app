import { ThemedScrollView, ThemedText } from "@/components/ui";
import ThemedButton from "@/components/ui/ThemedButton";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { useTheme } from "@/hooks/theme";
import { View } from "react-native";

export default function HomeScreen() {
  const { colors } = useTheme();
  return (
    <>
      <ThemedScrollView style={{ paddingHorizontal: 16 }}>
        <View style={{ height: 180 }} />
        <View style={{ marginBottom: 16 }}>
          <ThemedText
            size="h3"
            color={colors.colorPrimary}
            style={{ marginBottom: 16 }}
          >
            Text Styles
          </ThemedText>
          <ThemedText>
            <ThemedText size="h1">H1 Text_ </ThemedText>
            <ThemedText size="h2">H2 Text_ </ThemedText>
            <ThemedText size="h3">H3 Text_ </ThemedText>
            <ThemedText size="regular">Regular Text_ </ThemedText>
            <ThemedText size="small"> Small Text_</ThemedText>
          </ThemedText>
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
          <ThemedButton size="md" type="outline">
            Outline Medium
          </ThemedButton>
          <ThemedButton size="md" type="transparent">
            Transparent Medium
          </ThemedButton>
          <ThemedButton size="sm">Hello World</ThemedButton>
        </View>
        <View style={{ gap: 16, alignItems: "stretch" }}>
          <ThemedText
            size="h3"
            color={colors.colorSecondary}
            style={{ marginBottom: 16 }}
          >
            Input Styles
          </ThemedText>
          <ThemedTextInput placeholder="email" />
          <ThemedTextInput placeholder="email" />
          <View style={{ height: 180 }} />
        </View>
      </ThemedScrollView>
    </>
  );
}
