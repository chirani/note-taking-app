import { useTheme } from "@/hooks/theme";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useEffect } from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type CheckboxSize = "sm" | "md" | "lg";

interface CheckboxDimensions {
  box: number;
  radius: number;
  icon: number;
}

const checkboxSizes: Record<CheckboxSize, CheckboxDimensions> = {
  sm: { box: 20, radius: 5, icon: 14 },
  md: { box: 24, radius: 6, icon: 16 },
  lg: { box: 30, radius: 8, icon: 20 },
};

export interface ThemedCheckboxProps extends PressableProps {
  /** Whether the box is checked. Defaults to `false`. */
  checked?: boolean;
  /** Called with the next checked state when the box is pressed. */
  onCheckedChange?: (checked: boolean) => void;
  /** Box preset. Defaults to `md`. */
  size?: CheckboxSize;
  /** Fill and border color when checked. Defaults to the theme's `colorPrimary`. */
  color?: string;
}

/**
 * A square checkbox. Unchecked it shows a `colorBase300` outline; checked it
 * fills with the accent color and animates a checkmark into view.
 */
const ThemedCheckbox: React.FC<ThemedCheckboxProps> = ({
  checked = false,
  onCheckedChange,
  size = "md",
  color,
  disabled = false,
  hitSlop,
  style,
  onPress,
  onPressIn,
  onPressOut,
  accessibilityState,
  ...pressableProps
}) => {
  const { colors } = useTheme();
  const accentColor = color ?? colors.colorPrimary;
  const dimensions = checkboxSizes[size];

  const progress = useSharedValue(checked ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    progress.set(withTiming(checked ? 1 : 0, { duration: 200 }));
  }, [checked, progress]);

  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["rgba(0,0,0,0)", accentColor],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.colorBase300, accentColor],
    ),
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.5, 1]) }],
  }));

  return (
    <Pressable
      {...pressableProps}
      disabled={disabled}
      hitSlop={hitSlop ?? (size === "sm" ? 8 : undefined)}
      accessibilityRole="checkbox"
      accessibilityState={{
        ...accessibilityState,
        checked,
        disabled,
      }}
      style={style}
      onPressIn={(e) => {
        if (!disabled) scale.set(withSpring(0.9));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        if (!disabled) scale.set(withSpring(1));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        onCheckedChange?.(!checked);
        onPress?.(e);
      }}
    >
      <Animated.View
        style={[
          styles.box,
          {
            width: dimensions.box,
            height: dimensions.box,
            borderRadius: dimensions.radius,
          },
          boxStyle,
          disabled && styles.disabled,
        ]}
      >
        <Animated.View style={[styles.check, checkStyle]}>
          <Ionicons
            name="checkmark"
            size={dimensions.icon}
            color={colors.colorBase100}
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  check: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default ThemedCheckbox;
