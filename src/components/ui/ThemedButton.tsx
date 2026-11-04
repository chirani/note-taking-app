import { buttonFontSize, fontSizes, spacing } from "@/config/ui";
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

interface ButtonProps extends PressableProps {
  rounded?: boolean;
  title?: string;
  children?: string;
  textStyle?: TextStyle;
  size?: "sm" | "md" | "lg" | "xl";
  type?: "regular" | "outline" | "transparent";
  color?: string;
  icon?: IoniconsIconName;
}

const ThemedButton: React.FC<ButtonProps> = (props) => {
  const { colors } = useTheme();
  const isPressed = useSharedValue(false);
  const scale = useSharedValue(1);

  const buttonStyles = generateStyles(props.color ?? colors.colorPrimary);
  const buttonTextTypeStyles = generateButtonTextTypeStyle(
    props.color ?? colors.colorPrimary,
  );

  const buttonTypeStyles = generateButtonTypeStyles(
    colors.colorsecondaryContent,
  );

  const buttonTextColor = () => {
    switch (props.type) {
      case "regular":
        return colors.colorBase100;
      case "transparent":
        return colors.colorBaseContent;
      case "outline":
        return colors.colorBaseContent;
      default:
        return colors.colorBase100;
    }
  };

  const textStyles = generateTextStyles(buttonTextColor());

  const getButtonStyle = () => {
    switch (props.size) {
      case "sm":
        return buttonStyles.smallButton;
      case "md":
        return {};
      case "lg":
        return buttonStyles.largeButton;
      case "xl":
        return buttonStyles.xlargeButton;
      default:
        return {};
    }
  };

  const getButtonTextStyle = () => {
    switch (props.size) {
      case "sm":
        return textStyles.smallButtonText;
      case "md":
        return {};
      case "lg":
        return textStyles.largeButtonText;
      case "xl":
        return textStyles.xlargeButtonText;
      default:
        return {};
    }
  };

  const getButtonTypeStyle = () => {
    switch (props.type) {
      case "regular":
        return buttonTypeStyles.regular;
      case "transparent":
        return buttonTypeStyles.transparent;
      case "outline":
        return buttonTypeStyles.outline;
      default:
        return {};
    }
  };

  const getButtonTextTypeStyle = () => {
    switch (props.type) {
      case "regular":
        return buttonTextTypeStyles.regular;
      case "transparent":
        return buttonTextTypeStyles.transparent;
      case "outline":
        return buttonTextTypeStyles.outline;
      default:
        return {};
    }
  };

  const handlePressIn = () => {
    isPressed.value = true;
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    isPressed.value = false;
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const roundedBorder = props?.rounded ? { borderRadius: 100 } : {};
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...props}
        style={[
          buttonStyles.button,
          getButtonStyle(),
          getButtonTypeStyle(),
          roundedBorder,
          { ...props.style },
        ]}
        onPressIn={(e) => {
          handlePressIn();
          props.onPressIn && props.onPressIn(e);
        }}
        onPressOut={(e) => {
          handlePressOut();
          props.onPressOut && props.onPressOut(e);
        }}
      >
        {props.icon && (
          <Ionicons
            size={fontSizes.regular}
            color={buttonTextColor()}
            name={props.icon}
          />
        )}
        <Text
          style={[
            textStyles.buttonText,
            getButtonTextStyle(),
            getButtonTextTypeStyle(),
            props.textStyle,
          ]}
        >
          {props.children ?? props.title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const generateStyles = (primaryColor: string) =>
  StyleSheet.create({
    button: {
      borderRadius: 6,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: primaryColor,
      borderWidth: 2,
      borderColor: primaryColor,
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

const generateTextStyles = (buttonTextColor: string) =>
  StyleSheet.create({
    buttonText: {
      fontSize: buttonFontSize.medium,
      fontWeight: "400",
      color: buttonTextColor,
    },
    smallButtonText: {
      fontSize: buttonFontSize.small,
    },
    largeButtonText: {
      fontSize: buttonFontSize.large,
    },
    xlargeButtonText: {
      fontSize: 20,
    },
  });

const generateButtonTypeStyles = (accentColor: string) =>
  StyleSheet.create({
    regular: {},
    outline: {
      backgroundColor: "transparent",
    },
    transparent: {
      backgroundColor: accentColor,
      borderColor: "transparent",
    },
  });

const generateButtonTextTypeStyle = (primaryColor: string) =>
  StyleSheet.create({
    regular: {},
    outline: {
      color: primaryColor,
    },
    transparent: {
      color: primaryColor,
    },
  });

export default ThemedButton;
