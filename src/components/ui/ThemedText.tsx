import { fontSizes } from "@/config/ui";
import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";

export interface ThemedTextProps extends RNTextProps {
  /**
   * Typography preset. Defaults to `regular`.
   * `h1`/`h2`/`h3` are bold; `regular`/`small` are normal weight.
   */
  size?: keyof typeof fontSizes;
  /** Overrides the text color. Applied after `style`, so it wins. */
  color?: string;
}

const ThemedText: React.FC<ThemedTextProps> = ({
  size,
  color,
  style,
  children,
  ...textProps
}) => {
  let fontSize: number;
  let fontWeight: TextStyle["fontWeight"] = "normal";

  switch (size) {
    case "x-small":
      fontSize = fontSizes["x-small"];
      fontWeight = "normal";
      break;
    case "small":
      fontSize = fontSizes.small;
      fontWeight = "normal";
      break;
    case "h1":
      fontSize = fontSizes.h1;
      fontWeight = "bold";
      break;
    case "h2":
      fontSize = fontSizes.h2;
      fontWeight = "bold";
      break;
    case "h3":
      fontSize = fontSizes.h3;
      fontWeight = "bold";
      break;
    default:
      fontSize = fontSizes.regular;
      fontWeight = "normal";
  }
  const textColor = color ? { color } : {};
  return (
    <RNText {...textProps} style={[{ fontSize, fontWeight }, style, textColor]}>
      {children}
    </RNText>
  );
};

export default ThemedText;
