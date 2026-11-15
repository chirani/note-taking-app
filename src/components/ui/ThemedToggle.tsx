import { useTheme } from "@/hooks/theme";
import { useEffect } from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type ToggleSize = "sm" | "md" | "lg";

interface ToggleDimensions {
  width: number;
  height: number;
  thumb: number;
  inset: number;
}

const toggleSizes: Record<ToggleSize, ToggleDimensions> = {
  sm: { width: 40, height: 24, thumb: 18, inset: 3 },
  md: { width: 50, height: 28, thumb: 22, inset: 3 },
  lg: { width: 60, height: 34, thumb: 28, inset: 3 },
};

export interface ThemedToggleProps extends PressableProps {
  /** Current value. Defaults to `false`. */
  value?: boolean;
  /** Called with the next value when the toggle is pressed. */
  onValueChange?: (value: boolean) => void;
  /** Track/thumb preset. Defaults to `md`. */
  size?: ToggleSize;
  /** Track color when on. Defaults to the theme's `colorPrimary`. */
  color?: string;
}

/**
 * A pill switch with a sliding thumb. The track eases between
 * `colorBase300` (off) and the accent color (on).
 */
const ThemedToggle: React.FC<ThemedToggleProps> = ({
  value = false,
  onValueChange,
  size = "md",
  color,
  disabled = false,
  style,
  onPress,
  onPressIn,
  onPressOut,
  accessibilityState,
  ...pressableProps
}) => {
  const { colors } = useTheme();
  const accentColor = color ?? colors.colorPrimary;
  const dimensions = toggleSizes[size];
  const travel = dimensions.width - dimensions.thumb - dimensions.inset * 2;

  const progress = useSharedValue(value ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    progress.set(withTiming(value ? 1 : 0, { duration: 200 }));
  }, [progress, value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.colorBase300, accentColor],
    ),
    transform: [{ scale: scale.value }],
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * travel }],
  }));

  return (
    <Pressable
      {...pressableProps}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{
        ...accessibilityState,
        checked: value,
        disabled,
      }}
      style={style}
      onPressIn={(e) => {
        if (!disabled) scale.set(withSpring(0.96));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        if (!disabled) scale.set(withSpring(1));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        onValueChange?.(!value);
        onPress?.(e);
      }}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: dimensions.width,
            height: dimensions.height,
            borderRadius: dimensions.height / 2,
          },
          trackStyle,
          disabled && styles.disabled,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: dimensions.thumb,
              height: dimensions.thumb,
              borderRadius: dimensions.thumb / 2,
              left: dimensions.inset,
              top: dimensions.inset,
              backgroundColor: colors.colorBase100,
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    justifyContent: "center",
  },
  thumb: {
    position: "absolute",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default ThemedToggle;
