import { useTheme } from "@/hooks/theme";
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

type RadioButtonSize = "sm" | "md" | "lg";

interface RadioButtonDimensions {
  circle: number;
  dot: number;
  border: number;
}

const radioButtonSizes: Record<RadioButtonSize, RadioButtonDimensions> = {
  sm: { circle: 20, dot: 8, border: 2 },
  md: { circle: 24, dot: 10, border: 2 },
  lg: { circle: 30, dot: 12, border: 2 },
};

export interface ThemedRadioButtonProps extends PressableProps {
  /** Whether the radio button is checked. Defaults to `false`. */
  checked?: boolean;
  /** Called with the next checked state when the button is pressed. */
  onCheckedChange?: (checked: boolean) => void;
  /** Circle preset. Defaults to `md`. */
  size?: RadioButtonSize;
  /** Ring and fill color when checked. Defaults to the theme's `colorPrimary`. */
  color?: string;
}

/**
 * A circular radio button. Unchecked it shows a `colorBase300` outline; checked
 * it fills with the accent color and animates a dot into view.
 */
const ThemedRadioButton: React.FC<ThemedRadioButtonProps> = ({
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
  const dimensions = radioButtonSizes[size];

  const progress = useSharedValue(checked ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    progress.set(withTiming(checked ? 1 : 0, { duration: 200 }));
  }, [checked, progress]);

  const circleStyle = useAnimatedStyle(() => ({
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

  const dotStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.5, 1]) }],
  }));

  return (
    <Pressable
      {...pressableProps}
      disabled={disabled}
      hitSlop={hitSlop ?? (size === "sm" ? 8 : undefined)}
      accessibilityRole="radio"
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
          styles.circle,
          {
            width: dimensions.circle,
            height: dimensions.circle,
            borderRadius: dimensions.circle / 2,
            borderWidth: dimensions.border,
          },
          circleStyle,
          disabled && styles.disabled,
        ]}
      >
        <Animated.View
          style={[
            {
              width: dimensions.dot,
              height: dimensions.dot,
              borderRadius: dimensions.dot / 2,
              backgroundColor: colors.colorBase100,
            },
            dotStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default ThemedRadioButton;
