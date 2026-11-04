import { useTheme } from "@/hooks/theme";
import { ScrollView, type ScrollViewProps } from "react-native";

/**
 * A `ScrollView` painted with the theme's `colorBase100` surface color.
 * Any `style` passed in is merged last, so it can override the background.
 */
const ThemedScrollView: React.FC<ScrollViewProps> = ({
  style,
  children,
  ...scrollViewProps
}) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      {...scrollViewProps}
      style={[{ backgroundColor: colors.colorBase100 }, style]}
    >
      {children}
    </ScrollView>
  );
};

export default ThemedScrollView;
