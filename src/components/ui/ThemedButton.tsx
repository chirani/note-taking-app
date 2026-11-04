import { buttonFontSizes, fontSizes, spacing } from "@/config/ui";
import { useTheme } from "@/hooks/theme";
import {
  Ionicons,
  IoniconsIconName,
} from "@react-native-vector-icons/ionicons";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export interface ThemedButtonProps extends PressableProps {
  /** Fully round the corners (borderRadius: 100). */
  rounded?: boolean;
  /** Label text. */
  children?: string;
  /** Extra styles merged into the label `Text`. */
  textStyle?: TextStyle;
  /** Padding/radius/font-size preset. Defaults to `md`. */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Visual variant. Defaults to `regular`.
   * - `regular`: filled with `color`.
   * - `outline`: transparent fill, `color` border and label.
   * - `transparent`: muted fill, no border, `color` label.
   */
  variant?: "regular" | "outline" | "transparent";
  /** Accent color. Defaults to the theme's `colorPrimary`. */
  color?: string;
  /** Optional leading Ionicon. */
  icon?: IoniconsIconName;
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
  rounded,
  children,
  textStyle,
  size,
  variant = "regular",
  color,
  icon,
  style,
  onPressIn,
  onPressOut,
  ...pressableProps
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const accentColor = color ?? colors.colorPrimary;
  // Filled buttons put the label on the accent fill; all other variants
  // render the label in the accent color itself.
  const labelColor =
    variant === "regular" ? colors.colorBase100 : accentColor;

  const buttonStyles = generateStyles(accentColor);
  const textStyles = generateTextStyles(labelColor);
  const typeStyles = generateTypeStyles(colors.colorsecondaryContent);

  const getButtonStyle = () => {
    switch (size) {
      case "sm":
        return buttonStyles.smallButton;
      case "lg":
        return buttonStyles.largeButton;
      case "xl":
        return buttonStyles.xlargeButton;
      default:
        return {};
    }
  };

  const getButtonTextStyle = () => {
    switch (size) {
      case "sm":
        return textStyles.smallButtonText;
      case "lg":
        return textStyles.largeButtonText;
      case "xl":
        return textStyles.xlargeButtonText;
      default:
        return {};
    }
  };

  const getButtonTypeStyle = () => {
    switch (variant) {
      case "outline":
        return typeStyles.outline;
      case "transparent":
        return typeStyles.transparent;
      default:
        return typeStyles.regular;
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const roundedBorder = rounded ? { borderRadius: 100 } : {};
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...pressableProps}
        style={(state) => [
          buttonStyles.button,
          getButtonStyle(),
          getButtonTypeStyle(),
          roundedBorder,
          typeof style === "function" ? style(state) : style,
        ]}
        onPressIn={(e) => {
          handlePressIn();
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          handlePressOut();
          onPressOut?.(e);
        }}
      >
        {icon && (
          <Ionicons size={fontSizes.regular} color={labelColor} name={icon} />
        )}
        <Text
          style={[
            textStyles.buttonText,
            getButtonTextStyle(),
            textStyle,
          ]}
        >
          {children}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const generateStyles = (accentColor: string) =>
  StyleSheet.create({
    button: {
      borderRadius: 6,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: accentColor,
      borderWidth: 2,
      borderColor: accentColor,
      paddingHorizontal: 16,
      paddingVertical: 10,
      flexDirection: "row",

      gap: spacing.md,
    },
    smallButton: {
      borderRadius: 4,
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    largeButton: {
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    xlargeButton: {
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 28,
    },
  });

const generateTextStyles = (labelColor: string) =>
  StyleSheet.create({
    buttonText: {
      fontSize: buttonFontSizes.medium,
      fontWeight: "400",
      color: labelColor,
    },
    smallButtonText: {
      fontSize: buttonFontSizes.small,
    },
    largeButtonText: {
      fontSize: buttonFontSizes.large,
    },
    xlargeButtonText: {
      fontSize: buttonFontSizes.xlarge,
    },
  });

const generateTypeStyles = (transparentFill: string) =>
  StyleSheet.create({
    regular: {},
    outline: {
      backgroundColor: "transparent",
    },
    transparent: {
      backgroundColor: transparentFill,
      borderColor: "transparent",
    },
  });

export default ThemedButton;
