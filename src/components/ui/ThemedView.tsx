import { useTheme } from "@/hooks/theme";
import { View, type ViewProps } from "react-native";

/**
 * A `View` painted with the theme's `colorBase100` surface color.
 * Any `style` passed in is merged last, so it can override the background.
 */
const ThemedView: React.FC<ViewProps> = ({ style, ...viewProps }) => {
  const { colors } = useTheme();

  return (
    <View
      {...viewProps}
      style={[{ backgroundColor: colors.colorBase100 }, style]}
    />
  );
};

export default ThemedView;
