import { useMyThemeContext } from "@/contexts/ThemeContext";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Animated, ScrollView, TouchableOpacity, View } from "react-native";
import { Drawer, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AppDrawerProps {
  onProfilePress?: () => void;
  onHomePress?: () => void;
  onBookmarksPress?: () => void;
  onHistoryPress?: () => void;
}

export interface AppDrawerRef {
  open: () => void;
  close: () => void;
}

const AppDrawer = forwardRef<AppDrawerRef, AppDrawerProps>(
  ({ onProfilePress, onHomePress, onBookmarksPress, onHistoryPress }, ref) => {
    const theme = useTheme();
    const { isDarkTheme } = useMyThemeContext();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const insets = useSafeAreaInsets();

    const openDrawer = () => {
      setDrawerVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const closeDrawer = () => {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setDrawerVisible(false);
      });
    };

    useImperativeHandle(ref, () => ({
      open: openDrawer,
      close: closeDrawer,
    }));

    const handleDrawerAction = (action?: () => void) => {
      closeDrawer();
      action?.();
    };

    return (
      <>
        {drawerVisible && (
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            activeOpacity={1}
            onPress={closeDrawer}
          />
        )}
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 300,
            backgroundColor: theme.colors.surface,
            zIndex: 1000,
            transform: [{ translateX: slideAnim }],
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
        >
          <View style={{ flex: 1, paddingHorizontal: 16 }}>
            <ScrollView>
              <Drawer.Section title="Menú">
                <Drawer.Item
                  icon="account"
                  label="Perfil"
                  onPress={() => handleDrawerAction(onProfilePress)}
                />
                <Drawer.Item
                  icon="home"
                  label="Inicio"
                  onPress={() => handleDrawerAction(onHomePress)}
                />
                <Drawer.Item
                  icon="bookmark"
                  label="Marcadores"
                  onPress={() => handleDrawerAction(onBookmarksPress)}
                />
                <Drawer.Item
                  icon="history"
                  label="Historial"
                  onPress={() => handleDrawerAction(onHistoryPress)}
                />
              </Drawer.Section>
            </ScrollView>
          </View>
        </Animated.View>
      </>
    );
  }
);

AppDrawer.displayName = "AppDrawer";

export default AppDrawer;
