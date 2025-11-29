import ArticleCard from "@/components/Card";
import { apiRequest, handleApiResponse } from "@/utils/api";
import { Href, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import {
    ActivityIndicator,
    Appbar,
    IconButton,
    Text,
    useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type UiArticle = {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  views: string;
  likes: number;
  isBookmarked: boolean;
  isLiked: boolean;
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
  const [articles, setArticles] = useState<UiArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await apiRequest("/articles/bookmarks");
      const json = await handleApiResponse(res);
      const apiArticles: any[] = json?.data?.articles || [];
      const mapped: UiArticle[] = apiArticles.map((a: any) => ({
        id: String(a.id),
        title: a.title,
        summary: a.summary,
        category: a.category_name || "",
        imageUrl: a.image_url || "https://placehold.co/600x400/png",
        views: formatViews(a.views_count),
        likes: a.likes_count || 0,
        isBookmarked: true, // All items in bookmarks are bookmarked
        isLiked: a.isLiked || false,
      }));
      setArticles(mapped);
    } catch (e: any) {
      setError(e?.message || "Error cargando marcadores");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleBookmarkToggle = async (articleId: string) => {
    try {
      await apiRequest(`/articles/${articleId}/favorite`, { method: "POST" });
      // Remove from list since we toggled off the bookmark
      setArticles((prev) => prev.filter((a) => a.id !== articleId));
    } catch (e: any) {
      console.error("Error toggling bookmark:", e);
    }
  };

  const handleLikeToggle = async (articleId: string) => {
    try {
      const res = await apiRequest(`/articles/${articleId}/like`, {
        method: "POST",
      });
      const json = await handleApiResponse(res);

      // Update the article in the list
      setArticles((prev) =>
        prev.map((a) =>
          a.id === articleId
            ? {
                ...a,
                isLiked: json?.data?.is_liked || false,
                likes: json?.data?.likes_count || a.likes,
              }
            : a
        )
      );
    } catch (e: any) {
      console.error("Error toggling like:", e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['left', 'right', 'bottom']}>
      <Appbar.Header mode="small">
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Marcadores" />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchBookmarks(true)} />
        }
      >
        {loading && (
          <View style={{ paddingVertical: 32, alignItems: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        )}

        {!loading && !!error && (
          <View style={{ paddingVertical: 32, alignItems: "center" }}>
            <Text style={{ color: theme.colors.error, marginBottom: 16 }}>
              {error}
            </Text>
            <IconButton
              icon="refresh"
              size={32}
              onPress={() => fetchBookmarks()}
            />
          </View>
        )}

        {!loading && !error && articles.length === 0 && (
          <View style={{ paddingVertical: 32, alignItems: "center" }}>
            <Text variant="titleMedium" style={{ opacity: 0.6 }}>
              No tienes marcadores aún
            </Text>
            <Text variant="bodyMedium" style={{ opacity: 0.5, marginTop: 8 }}>
              Guarda artículos para leerlos más tarde
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
              likes={item.likes}
              isBookmarked={item.isBookmarked}
              isLiked={item.isLiked}
              onPress={() => {
                router.push(`/article/${item.id}` as Href);
              }}
              onBookmarkPress={() => handleBookmarkToggle(item.id)}
              onLikePress={() => handleLikeToggle(item.id)}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
