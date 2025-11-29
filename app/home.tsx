import AppDrawer, { AppDrawerRef } from "@/components/AppDrawer";
import ArticleCard from "@/components/Card";
import FeaturedCard from "@/components/FeaturedCard";
import { apiRequest, handleApiResponse } from "@/utils/api";
import { Href, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Chip,
  Divider,
  IconButton,
  Text,
  TextInput,
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

type Category = {
  id: number;
  name: string;
};

const formatViews = (viewsCount?: number): string => {
  if (!viewsCount) return "0";
  if (viewsCount >= 1000000) return `${(viewsCount / 1000000).toFixed(1)}M`;
  if (viewsCount >= 1000) return `${(viewsCount / 1000).toFixed(1)}K`;
  return String(viewsCount);
};

export default function Index() {
  const theme = useTheme();
  const router = useRouter();
  const drawerRef = useRef<AppDrawerRef>(null);
  const [categories, setCategories] = useState<Category[]>([
    { id: 0, name: "Todo" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: 0,
    name: "Todo",
  });
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<UiArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await apiRequest("/categories");
        const json = await handleApiResponse(res);
        const fetchedCategories: Category[] = (
          json?.data?.categories || []
        ).map((c: any) => ({ id: c.id, name: c.name }));
        if (isMounted)
          setCategories([{ id: 0, name: "Todo" }, ...fetchedCategories]);
      } catch (e: any) {
        if (isMounted) setError(e?.message || "Error cargando categorías");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchArticles = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    if (!silent) setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "10");
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedCategory.id !== 0)
        params.set("category", String(selectedCategory.id));
      params.set("sort", "published_at");
      params.set("order", "desc");

      const res = await apiRequest(`/articles?${params.toString()}`);
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
        isBookmarked: a.is_favorite || false,
        isLiked: a.is_liked || false,
      }));
      setArticles(mapped);
    } catch (e: any) {
      if (!silent) setError(e?.message || "Error cargando artículos");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  // Initial fetch and filter changes (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchArticles();
    }, 300);
    return () => clearTimeout(timeout);
  }, [selectedCategory, searchQuery]);

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchArticles(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedCategory, searchQuery]);

  const handleBookmarkToggle = async (articleId: string) => {
    try {
      await apiRequest(`/articles/${articleId}/favorite`, { method: "POST" });
      // Update the article in the list
      setArticles((prev) =>
        prev.map((a) =>
          a.id === articleId ? { ...a, isBookmarked: !a.isBookmarked } : a
        )
      );
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

  const featured = useMemo<UiArticle | null>(() => {
    if (!articles.length) return null;
    return articles[0];
  }, [articles]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['left', 'right', 'bottom']}>
      <AppDrawer
        ref={drawerRef}
        onProfilePress={() => {
          router.push("/profile" as Href);
        }}
        onHomePress={() => {
          router.push("/home" as Href);
        }}
        onBookmarksPress={() => {
          router.push("/bookmarks" as Href);
        }}
        onHistoryPress={() => {
          router.push("/history" as Href);
        }}
      />

      <Appbar.Header mode="small">
        <Appbar.Action
          icon="menu"
          onPress={() => drawerRef.current?.open()}
          accessibilityLabel="Menu"
        />

        {!showSearch ? (
          <>
          <View style={styles.logoContainer}>
            <IconButton
                icon="newspaper-variant"
                size={32}
                iconColor={theme.colors.primary}
            />
            </View>
            <Appbar.Content title="NotifIA" titleStyle={{ fontWeight: "bold", color: theme.colors.primary }} />
            
            <IconButton
              icon="magnify"
              onPress={() => setShowSearch(true)}
              accessibilityLabel="Buscar"
            />
          </>
        ) : (
          <>
            <View style={{ flex: 1 }}>
              <TextInput
                mode="outlined"
                placeholder="Buscar..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  paddingHorizontal: 8,
                  borderRadius: 8,
                  height: 40,
                }}
                autoFocus
              />
            </View>
            <Appbar.Action
              icon="close"
              onPress={() => {
                setShowSearch(false);
                setSearchQuery("");
              }}
            />
          </>
        )}
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 8,
            paddingTop: 8,
          }}
        >
          {categories.map((c) => (
            <Chip
              key={c.id}
              selected={selectedCategory.id === c.id}
              onPress={() => setSelectedCategory(c)}
            >
              {c.name}
            </Chip>
          ))}
        </ScrollView>

        {featured && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <FeaturedCard
              article={featured}
              onPress={() => router.push(`/article/${featured.id}` as Href)}
              onBookmarkPress={() => handleBookmarkToggle(featured.id)}
              onLikePress={() => handleLikeToggle(featured.id)}
            />
          </View>
        )}

        <Divider style={{ marginHorizontal: 16, marginVertical: 8 }} />

        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {loading && <Text style={{ opacity: 0.6 }}>Cargando artículos…</Text>}
          {!!error && (
            <Text style={{ color: theme.colors.error }}>{error}</Text>
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
                onPress={() => router.push(`/article/${item.id}` as Href)}
                onBookmarkPress={() => handleBookmarkToggle(item.id)}
                onLikePress={() => handleLikeToggle(item.id)}
              />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  logoContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
});