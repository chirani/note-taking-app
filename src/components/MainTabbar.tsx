import { useTheme } from "@/hooks/theme";
import {
  Ionicons,
  IoniconsIconName,
} from "@react-native-vector-icons/ionicons";
import type { BottomTabBarProps } from "expo-router/tabs";
import { useEffect } from "react";
import { Dimensions, Text, TouchableOpacity } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { ThemedView } from "./ui";

const windowWidth = Dimensions.get("window").width;

const RouteInfo: Record<string, { icon: IoniconsIconName; title: string }> = {
  index: {
    icon: "home",
    title: "home",
  },
  profile: {
    icon: "person",
    title: "profile",
  },
};

const MainTabbar = ({
  state,
  descriptors,
  emitter,
  navigateToTab,
}: BottomTabBarProps) => {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(
      (windowWidth / state.routes.length) * state.index,
      {
        duration: 300,
      },
    );
  }, [state.index, state.routes.length, translateX]);

  return (
    <>
      <ThemedView
        style={{
          height: 4,
          width: "100%",
          backgroundColor: colors.colorBase100,
          flexDirection: "row",
        }}
      >
        <Animated.View
          style={{
            marginStart: translateX,
            backgroundColor: colors.colorPrimary,
            height: 4,
            width: "50%", // 100% divided by the number of tabs
            paddingHorizontal: 12,
          }}
        />
      </ThemedView>
      <ThemedView
        style={{
          flexDirection: "row",
          backgroundColor: colors.colorBase100,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = emitter.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigateToTab(route.key);
            }
          };

          const onLongPress = () => {
            emitter.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.6}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                alignItems: "center",
                padding: 10,
                flex: 1,
              }}
            >
              <Ionicons
                name={RouteInfo[route.name].icon}
                size={20}
                color={
                  isFocused ? colors.colorPrimary : colors.colorBaseContent
                }
              />
              <Text
                style={{
                  color: isFocused
                    ? colors.colorPrimary
                    : colors.colorBaseContent,
                  marginTop: 3,
                }}
              >
                {RouteInfo[route.name].title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ThemedView>
    </>
  );
};

export default MainTabbar;
