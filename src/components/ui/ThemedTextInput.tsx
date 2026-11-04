import { fontSizes } from "@/config/ui";
import { useTheme } from "@/hooks/theme";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ThemedTextInput: React.FC<TextInputProps> = (props) => {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.colorBase300, colors.colorSecondary],
    );

    return { borderColor };
  });

  const toggleColor = (progressValue: number) => {
    progress.value = withTiming(progressValue, {
      duration: 500,
    });
  };

  const textInputStyles = generateTextInputStyles(
    colors.coloraccentContent,
    colors.colorError,
  );

  return (
    <Animated.View
      {...props}
      style={[{ borderWidth: 1.5, borderRadius: 8 }, animatedStyle]}
    >
      <TextInput
        {...props}
        placeholderTextColor={colors.colorBaseContent}
        onFocus={(e) => {
          toggleColor(1);
          props.onFocus && props.onFocus(e);
        }}
        onBlur={(e) => {
          toggleColor(0);
          props.onBlur && props.onBlur(e);
        }}
        style={[textInputStyles.input, props.style]}
      />
    </Animated.View>
  );
};

const generateTextInputStyles = (colorBase300: string, colorError: string) =>
  StyleSheet.create({
    input: {
      height: 50,
      borderColor: colorBase300,

      paddingHorizontal: 14,
      fontSize: fontSizes.regular,
    },
    inputError: {
      borderColor: colorError,
    },
  });

export default ThemedTextInput;
