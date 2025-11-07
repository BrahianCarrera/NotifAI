import { useMyThemeContext } from "@/contexts/ThemeContext";
import { useState } from "react";
import { IconButton, Menu } from "react-native-paper";

interface AppbarMenuProps {
  onProfilePress?: () => void;
  onHomePress?: () => void;
  onBookmarksPress?: () => void;
  onHistoryPress?: () => void;
}

export default function AppbarMenu({
  onProfilePress,
  onHomePress,
  onBookmarksPress,
  onHistoryPress,
}: AppbarMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { toggleTheme } = useMyThemeContext();

  const handleMenuAction = (action?: () => void) => {
    setMenuVisible(false);
    action?.();
  };

  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <IconButton
          icon="menu"
          onPress={() => setMenuVisible(true)}
          accessibilityLabel="Menu"
        />
      }
    >
      <Menu.Item
        onPress={() => handleMenuAction(onProfilePress)}
        title="Perfil"
      />
      <Menu.Item onPress={() => handleMenuAction(onHomePress)} title="Inicio" />
      <Menu.Item
        onPress={() => handleMenuAction(onBookmarksPress)}
        title="Marcadores"
      />
      <Menu.Item
        onPress={() => handleMenuAction(onHistoryPress)}
        title="Historial"
      />
      <Menu.Item
        onPress={() => {
          setMenuVisible(false);
          toggleTheme();
        }}
        title="Modo Oscuro"
      />
    </Menu>
  );
}
