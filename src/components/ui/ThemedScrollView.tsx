import { useTheme } from "@/hooks/theme";
import { forwardRef } from "react";
import {
  ScrollView,
  type ScrollViewInstance,
  type ScrollViewProps,
} from "react-native";

/**
 * A `ScrollView` painted with the theme's `colorBase100` surface color.
 * Any `style` passed in is merged last, so it can override the background.
 */
const ThemedScrollView = forwardRef<ScrollViewInstance, ScrollViewProps>(
  ({ style, children, ...scrollViewProps }, ref) => {
    const { colors } = useTheme();

    return (
      <ScrollView
        {...scrollViewProps}
        ref={ref}
        style={[{ backgroundColor: colors.colorBase100 }, style]}
      >
        {children}
      </ScrollView>
    );
  },
);

ThemedScrollView.displayName = "ThemedScrollView";

export default ThemedScrollView;
