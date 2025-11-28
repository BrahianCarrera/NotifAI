import AppDrawer, { AppDrawerRef } from "@/components/AppDrawer";
import ArticleCard from "@/components/Card";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, handleApiResponse } from "@/utils/api";
import { Href, useRouter, Redirect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import {
  Appbar,
  Text,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";

type UiArticle = {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  views: string;
  isFavorite: boolean;
};

const formatViews = (viewsCount?: number): string => {
  if (!viewsCount) return "0";
  if (viewsCount >= 1000000) return `${(viewsCount / 1000000).toFixed(1)}M`;
  if (viewsCount >= 1000) return `${(viewsCount / 1000).toFixed(1)}K`;
  return String(viewsCount);
};

export default function BookmarksScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const drawerRef = useRef<AppDrawerRef>(null);
  const [articles, setArticles] = useState<UiArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const fetchBookmarkedArticles = useCallback(async (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true);
    setError(null);

    try {
      const res = await apiRequest("/articles/bookmarks");

      // Log para debugging
      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);

      const json = await handleApiResponse(res);
      const apiArticles: any[] = json?.data?.articles || [];

      const mapped: UiArticle[] = apiArticles.map((a: any) => ({
        id: String(a.id),
        title: a.title,
        summary: a.summary,
        category: a.category_name || "",
        imageUrl: a.image_url || "https://placehold.co/600x400/png",
        views: formatViews(a.views_count),
        isFavorite: true, // All articles in bookmarks are favorites
      }));

      setArticles(mapped);
    } catch (e: any) {
      setError(e?.message || "Error cargando favoritos");
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchBookmarkedArticles();
  }, [fetchBookmarkedArticles]);

  const handleToggleFavorite = async (articleId: string) => {
    try {
      await apiRequest(`/articles/${articleId}/favorite`, {
        method: "POST",
      });

      // Remove from local state
      setArticles((prev) => prev.filter((article) => article.id !== articleId));
    } catch (e: any) {
      console.error("Error removing favorite:", e);
      setError("Error al eliminar de favoritos");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookmarkedArticles(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppDrawer
        ref={drawerRef}
        onProfilePress={() => {
          console.log("Navegar a Perfil");
        }}
        onHomePress={() => {
          router.push("/home" as Href);
        }}
        onBookmarksPress={() => {
          drawerRef.current?.close();
        }}
        onHistoryPress={() => {
          console.log("Navegar a Historial");
        }}
      />

      <Appbar.Header mode="small">
        <Appbar.Action
          icon="menu"
          onPress={() => drawerRef.current?.open()}
          accessibilityLabel="Menu"
        />
        <Appbar.Content title="Favoritos" />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 12 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && (
          <View style={{ paddingVertical: 20, alignItems: "center" }}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 12, opacity: 0.6 }}>
              Cargando favoritos...
            </Text>
          </View>
        )}

        {!loading && error && (
          <View style={{ paddingVertical: 20, alignItems: "center" }}>
            <Text style={{ color: theme.colors.error }}>{error}</Text>
          </View>
        )}

        {!loading && !error && articles.length === 0 && (
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
              No tienes favoritos
            </Text>
            <Text style={{ opacity: 0.6, textAlign: "center" }}>
              Guarda artículos presionando el corazón para verlos aquí
            </Text>
          </View>
        )}

        {!loading &&
          !error &&
          articles.map((item) => (
            <ArticleCard
              key={item.id}
              id={item.id}
              title={item.title}
              summary={item.summary}
              category={item.category}
              imageUrl={item.imageUrl}
              views={item.views}
              isFavorite={item.isFavorite}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
            />
          ))}
      </ScrollView>
    </View>
  );
}
