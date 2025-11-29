import ArticleCard from "@/components/Card";
import { clearHistory, getHistory, HistoryItem } from "@/utils/history";
import { Href, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import {
    Appbar,
    Button,
    Dialog,
    Portal,
    Text,
    useTheme
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const loadHistory = useCallback(async () => {
    const items = await getHistory();
    setHistory(items);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setHistory([]);
    setShowClearDialog(false);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["left", "right", "bottom"]}
    >
      <Appbar.Header mode="small">
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Historial" />
        {history.length > 0 && (
          <Appbar.Action
            icon="delete-outline"
            onPress={() => setShowClearDialog(true)}
          />
        )}
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {history.length === 0 && (
          <View style={{ paddingVertical: 32, alignItems: "center" }}>
            <Text variant="titleMedium" style={{ opacity: 0.6 }}>
              No hay historial reciente
            </Text>
            <Text variant="bodyMedium" style={{ opacity: 0.5, marginTop: 8 }}>
              Los artículos que leas aparecerán aquí
            </Text>
          </View>
        )}

        {history.map((item) => (
          <ArticleCard
            key={`${item.id}-${item.viewedAt}`}
            id={item.id}
            title={item.title}
            summary={`Visto el ${new Date(item.viewedAt).toLocaleDateString()} a las ${new Date(item.viewedAt).toLocaleTimeString()}`}
            category={item.category}
            imageUrl={item.imageUrl}
            views="" // Not needed for history
            likes={0} // Not needed for history
            isBookmarked={false} // Not needed for history
            isLiked={false} // Not needed for history
            onPress={() => router.push(`/article/${item.id}` as Href)}
            onBookmarkPress={() => {}} // Disable bookmark in history view
            onLikePress={() => {}} // Disable like in history view
          />
        ))}
      </ScrollView>

      <Portal>
        <Dialog
          visible={showClearDialog}
          onDismiss={() => setShowClearDialog(false)}
        >
          <Dialog.Title>Borrar historial</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              ¿Estás seguro de que quieres borrar todo el historial de lectura?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClearDialog(false)}>Cancelar</Button>
            <Button onPress={handleClearHistory} textColor={theme.colors.error}>
              Borrar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}
