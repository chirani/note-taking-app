import { useTheme } from "@/hooks/theme";
import { ScrollView, type ScrollViewProps } from "react-native";

const ThemedScrollView: React.FC<ScrollViewProps> = (props) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      {...props}
      style={{ backgroundColor: colors.colorBase100, ...props.style }}
    >
      {props.children}
    </ScrollView>
  );
};

export default ThemedScrollView;
