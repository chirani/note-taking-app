import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/theme";
import { ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: colors.colorBase100 }}
      contentContainerStyle={{
        paddingTop: safeAreaInsets.top + Spacing.three,
        paddingLeft: safeAreaInsets.left + Spacing.three,
        paddingRight: safeAreaInsets.right + Spacing.three,
        paddingBottom: safeAreaInsets.bottom + Spacing.three,
      }}
    >
      <Text style={{ color: colors.colorBaseContent, fontSize: 18 }}>
        Grid One
      </Text>
    </ScrollView>
  );
}
