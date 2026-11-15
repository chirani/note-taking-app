import { spacing } from "@/config/ui";
import { StyleProp, View, ViewStyle } from "react-native";
import ThemedIconButton, { ThemedIconButtonProps } from "./ThemedIconButton";

export interface FloatingActionButtonProps extends Omit<
  ThemedIconButtonProps,
  "shape" | "size"
> {
  /** Distance from the right and bottom edges of the screen. Defaults to `spacing.xl`. */
  offset?: number;
  /** Extra styles for the positioning `View` that wraps the button. */
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * A circular, floating icon button pinned to the bottom-right corner of its
 * parent. Wraps `ThemedIconButton`, so it shares its variants, press
 * animation, and theme colors.
 */
const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  offset = spacing.xl,
  containerStyle,
  ...iconButtonProps
}) => {
  return (
    <View
      style={[
        {
          position: "absolute",
          right: offset,
          bottom: offset,
        },
        containerStyle,
      ]}
    >
      <ThemedIconButton shape="rounded" size="xl" {...iconButtonProps} />
    </View>
  );
};

export default FloatingActionButton;
