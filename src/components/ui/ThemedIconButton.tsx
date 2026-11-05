import { useTheme } from "@/hooks/theme";
import {
  Ionicons,
  IoniconsIconName,
} from "@react-native-vector-icons/ionicons";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type IconButtonSize = "sm" | "md" | "lg" | "xl";
type IconButtonShape = "square" | "rounded";

interface IconButtonDimensions {
  box: number;
  radius: number;
  icon: number;
}

const iconButtonSizes: Record<IconButtonSize, IconButtonDimensions> = {
  sm: { box: 32, radius: 4, icon: 16 },
  md: { box: 40, radius: 6, icon: 20 },
  lg: { box: 48, radius: 8, icon: 24 },
  xl: { box: 56, radius: 10, icon: 28 },
};

export interface ThemedIconButtonProps
  extends Omit<PressableProps, "children"> {
  /** Ionicon rendered in the center of the button. */
  icon: IoniconsIconName;
  /**
   * Corner shape. Defaults to `square`.
   * - `square`: equal width/height with the size's small corner radius.
   * - `rounded`: fully circular (`borderRadius: 100`).
   */
  shape?: IconButtonShape;
  /** Button/icon preset. Defaults to `md`. */
  size?: IconButtonSize;
  /**
   * Visual variant. Defaults to `regular`.
   * - `regular`: filled with `color`.
   * - `outline`: transparent fill, `color` border and icon.
   * - `transparent`: muted fill, no border, `color` icon.
   */
  variant?: "regular" | "outline" | "transparent";
  /** Accent color. Defaults to the theme's `colorPrimary`. */
  color?: string;
}

/**
 * A square or circular icon-only button. Matches `ThemedButton`'s variants
 * and spring press animation, but takes an Ionicon instead of a label.
 */
const ThemedIconButton: React.FC<ThemedIconButtonProps> = ({
  icon,
  shape = "square",
  size = "md",
  variant = "regular",
  color,
  disabled = false,
  accessibilityState,
  style,
  onPressIn,
  onPressOut,
  ...pressableProps
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const accentColor = color ?? colors.colorPrimary;
  const dimensions = iconButtonSizes[size];
  const iconColor =
    variant === "regular" ? colors.colorBase100 : accentColor;

  const variantStyle =
    variant === "outline"
      ? styles.outline
      : variant === "transparent"
        ? [styles.transparent, { backgroundColor: colors.colorsecondaryContent }]
        : null;

  const shapeStyle =
    shape === "rounded"
      ? styles.rounded
      : { borderRadius: dimensions.radius };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...pressableProps}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{
          ...accessibilityState,
          disabled,
        }}
        style={(state) => [
          styles.button,
          {
            width: dimensions.box,
            height: dimensions.box,
            backgroundColor: accentColor,
            borderColor: accentColor,
          },
          variantStyle,
          shapeStyle,
          disabled && styles.disabled,
          typeof style === "function" ? style(state) : style,
        ]}
        onPressIn={(e) => {
          if (!disabled) scale.set(withSpring(0.9));
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          if (!disabled) scale.set(withSpring(1));
          onPressOut?.(e);
        }}
      >
        <Ionicons name={icon} size={dimensions.icon} color={iconColor} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  outline: {
    backgroundColor: "transparent",
  },
  transparent: {
    borderColor: "transparent",
  },
  rounded: {
    borderRadius: 100,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default ThemedIconButton;
