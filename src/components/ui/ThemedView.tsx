import { useTheme } from "@/hooks/theme";
import { View, type ViewProps } from "react-native";

const ThemedView: React.FC<ViewProps> = (props) => {
  const { colors } = useTheme();

  return (
    <View
      {...props}
      style={{ backgroundColor: colors.colorBase100, ...props.style }}
    >
      {props.children}
    </View>
  );
};

export default ThemedView;
