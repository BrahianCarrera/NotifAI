import { apiRequest, handleApiResponse } from "@/utils/api";
import { addToHistory } from "@/utils/history";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Linking, ScrollView, Share, View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Chip,
  Divider,
  IconButton,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type ArticleDetail = {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  imageUrl: string;
  sourceUrl: string;
  publishedAt: string;
  views: number;
  likes: number;
  isBookmarked: boolean;
  isLiked: boolean;
  tags: string[];
};

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchArticleDetails();
      
      // Poll every 5 seconds for real-time updates
      const interval = setInterval(() => {
        fetchArticleDetails(true);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [id]);

  const fetchArticleDetails = async (silent = false) => {
    if (!silent) setLoading(true);
    // Don't clear error on silent refresh to avoid UI jump if it fails transiently
    if (!silent) setError(null);
    
    try {
      const res = await apiRequest(`/articles/${id}`);
      const json = await handleApiResponse(res);
      const data = json?.data?.article;

      if (data) {
        setArticle({
          id: String(data.id),
          title: data.title,
          content: data.content,
          summary: data.summary,
          category: data.category_name || "",
          imageUrl: data.image_url || "https://placehold.co/600x400/png",
          sourceUrl: data.source_url,
          publishedAt: new Date(data.published_at).toLocaleDateString(),
          views: data.views_count,
          likes: data.likes_count || 0,
          isBookmarked: data.is_favorite || false,
          isLiked: data.is_liked || false,
          tags: Array.isArray(data.tags)
            ? data.tags
            : typeof data.tags === "string"
            ? data.tags.split(",")
            : [],
        });
        
        // Add to history
        addToHistory({
          id: String(data.id),
          title: data.title,
          imageUrl: data.image_url || "https://placehold.co/600x400/png",
          category: data.category_name || "",
        });
      } else {
        if (!silent) setError("Artículo no encontrado");
      }
    } catch (e: any) {
      if (!silent) setError(e?.message || "Error cargando el artículo");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!article) return;
    try {
      await apiRequest(`/articles/${article.id}/favorite`, { method: "POST" });
      setArticle((prev) =>
        prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null
      );
    } catch (e) {
      console.error("Error toggling bookmark:", e);
    }
  };

  const handleLikeToggle = async () => {
    if (!article) return;
    try {
      const res = await apiRequest(`/articles/${article.id}/like`, {
        method: "POST",
      });
      const json = await handleApiResponse(res);
      setArticle((prev) =>
        prev
          ? {
              ...prev,
              isLiked: json?.data?.is_liked || false,
              likes: json?.data?.likes_count || prev.likes,
            }
          : null
      );
    } catch (e) {
      console.error("Error toggling like:", e);
    }
  };

  const handleShare = async () => {
    if (!article) return;
    try {
      await Share.share({
        message: `Mira este artículo: ${article.title}\n\n${article.summary}\n\nLeelo en NotifIA`,
        url: article.sourceUrl, // iOS only
        title: article.title, // Android only
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenSource = () => {
    if (article?.sourceUrl) {
      Linking.openURL(article.sourceUrl);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !article) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        edges={["left", "right", "bottom"]}
      >
        <Appbar.Header mode="small">
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Error" />
        </Appbar.Header>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}
        >
          <Text style={{ color: theme.colors.error, marginBottom: 16, textAlign: "center" }}>
            {error || "No se pudo cargar el artículo"}
          </Text>
          <Button mode="contained" onPress={() => fetchArticleDetails()}>
            Reintentar
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["left", "right", "bottom"]}
    >
      <Appbar.Header mode="small" elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="" />
        <Appbar.Action
          icon={article.isBookmarked ? "bookmark" : "bookmark-outline"}
          onPress={handleBookmarkToggle}
        />
        <Appbar.Action icon="share-variant" onPress={handleShare} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Image
          source={{ uri: article.imageUrl }}
          style={{ width: "100%", height: 250 }}
          resizeMode="cover"
        />

        <View style={{ padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Chip mode="flat" style={{ backgroundColor: theme.colors.secondaryContainer }}>
              {article.category}
            </Chip>
            <Text variant="bodySmall" style={{ opacity: 0.6 }}>
              {article.publishedAt}
            </Text>
          </View>

          <Text variant="headlineMedium" style={{ fontWeight: "bold", marginBottom: 16 }}>
            {article.title}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 24,
              gap: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <IconButton icon="eye-outline" size={20} style={{ margin: 0 }} />
              <Text variant="bodyMedium">{article.views} vistas</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <IconButton
                icon={article.isLiked ? "heart" : "heart-outline"}
                size={20}
                iconColor={article.isLiked ? theme.colors.error : undefined}
                onPress={handleLikeToggle}
                style={{ margin: 0 }}
              />
              <Text variant="bodyMedium">{article.likes} likes</Text>
            </View>
          </View>

          <Surface
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: theme.colors.surfaceVariant,
              marginBottom: 24,
            }}
            elevation={0}
          >
            <Text variant="bodyLarge" style={{ fontWeight: "bold", marginBottom: 8 }}>
              Resumen:
            </Text>
            <Text variant="bodyLarge" style={{ fontStyle: "italic" }}>
              {article.summary}
            </Text>
          </Surface>

          <Text variant="bodyLarge" style={{ lineHeight: 24, marginBottom: 24 }}>
            {article.content}
          </Text>

          {article.tags.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {article.tags.map((tag, index) => (
                <Chip key={index} mode="outlined" compact>
                  #{tag.trim()}
                </Chip>
              ))}
            </View>
          )}

          <Divider style={{ marginBottom: 24 }} />

          {article.sourceUrl && (
            <Button
              mode="contained"
              icon="open-in-new"
              onPress={handleOpenSource}
              style={{ marginBottom: 16 }}
            >
              Leer fuente original
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
