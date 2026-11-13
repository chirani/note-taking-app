import { useTheme } from "@/hooks/theme";
import {
  Ionicons,
  IoniconsIconName,
} from "@react-native-vector-icons/ionicons";
import type { BottomTabBarProps } from "expo-router/tabs";
import { useEffect } from "react";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { ThemedText as Text, ThemedView } from "./ui";

const RouteInfo: Record<
  string,
  { icon: IoniconsIconName; selectedIcon: IoniconsIconName; title: string }
> = {
  index: {
    icon: "albums-outline",
    title: "inbox",
    selectedIcon: "albums",
  },
  today: {
    icon: "sunny-outline",
    title: "today",
    selectedIcon: "sunny",
  },

  upcoming: {
    icon: "calendar-clear-outline",
    title: "upcoming",
    selectedIcon: "calendar-clear",
  },
  profile: {
    icon: "apps-sharp",
    title: "profile",
    selectedIcon: "apps-sharp",
  },
};

const MainTabbar = ({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
}: BottomTabBarProps) => {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const tabWidth = windowWidth / state.routes.length;
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.set(withSpring(tabWidth * state.index, { duration: 300 }));
  }, [state.index, tabWidth, translateX]);

  return (
    <ThemedView
      style={{
        backgroundColor: colors.colorBase100,
        paddingBottom: insets.bottom,
      }}
    >
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
            width: `${100 / state.routes.length}%`,
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
          const info = RouteInfo[route.name];
          const icon = info?.icon ?? "ellipse";
          const selectedIcon = info?.selectedIcon ?? "ellipse";
          const title = info?.title ?? options.title ?? route.name;

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
              key={route.key}
              activeOpacity={0.6}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? title}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                alignItems: "center",
                paddingTop: 10,
                paddingBottom: 12,
                flex: 1,
              }}
            >
              <Ionicons
                name={isFocused ? selectedIcon : icon}
                size={20}
                color={
                  isFocused ? colors.colorPrimary : colors.colorBaseContent
                }
              />
              <Text
                size="x-small"
                style={{
                  color: isFocused
                    ? colors.colorPrimary
                    : colors.colorBaseContent,
                  marginTop: 0,
                }}
              >
                {title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ThemedView>
    </ThemedView>
  );
};

export default MainTabbar;
