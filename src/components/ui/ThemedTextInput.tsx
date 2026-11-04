import { fontSizes } from "@/config/ui";
import { useTheme } from "@/hooks/theme";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface ThemedTextInputProps extends TextInputProps {
  /** Renders the border in the theme's error color. */
  hasError?: boolean;
}

const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  hasError,
  style,
  onFocus,
  onBlur,
  ...inputProps
}) => {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const restingColor = hasError ? colors.colorError : colors.colorBase300;
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [restingColor, colors.colorSecondary],
    );

    return { borderColor };
  });

  const toggleColor = (progressValue: number) => {
    progress.value = withTiming(progressValue, {
      duration: 500,
    });
  };

  return (
    <Animated.View
      style={[textInputStyles.container, animatedStyle]}
    >
      <TextInput
        {...inputProps}
        placeholderTextColor={colors.colorBaseContent}
        onFocus={(e) => {
          toggleColor(1);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          toggleColor(0);
          onBlur?.(e);
        }}
        style={[textInputStyles.input, style]}
      />
    </Animated.View>
  );
};

const textInputStyles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 8,
  },
  input: {
    height: 50,
    paddingHorizontal: 14,
    fontSize: fontSizes.regular,
  },
});

export default ThemedTextInput;
