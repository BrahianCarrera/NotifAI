import ArticleCard from "@/components/Card";
import FeaturedCard from "@/components/FeaturedCard";
import { apiRequest, handleApiResponse } from "@/utils/api";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Appbar,
  Chip,
  Divider,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

type UiArticle = {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  views: string;
};

const formatViews = (viewsCount?: number): string => {
  if (!viewsCount) return "0";
  if (viewsCount >= 1000000) return `${(viewsCount / 1000000).toFixed(1)}M`;
  if (viewsCount >= 1000) return `${(viewsCount / 1000).toFixed(1)}K`;
  return String(viewsCount);
};

export default function Index() {
  const theme = useTheme();
  const [categories, setCategories] = useState<string[]>(["Todo"]);
  const [selectedCategory, setSelectedCategory] = useState("Todo");
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
        const names: string[] = (json?.data?.categories || []).map(
          (c: any) => c.name
        );
        if (isMounted) setCategories(["Todo", ...names]);
      } catch (e: any) {
        // Keep default categories on error
        if (isMounted) setError(e?.message || "Error cargando categorías");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch articles when filters change (debounced)
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("limit", "10");
        if (searchQuery.trim()) params.set("search", searchQuery.trim());
        if (selectedCategory !== "Todo")
          params.set("category", selectedCategory);
        params.set("sort", "published_at");
        params.set("order", "desc");

        const res = await apiRequest(`/articles?${params.toString()}`, {
          signal: controller.signal as any,
        });
        const json = await handleApiResponse(res);
        const apiArticles: any[] = json?.data?.articles || [];
        const mapped: UiArticle[] = apiArticles.map((a: any) => ({
          id: String(a.id),
          title: a.title,
          summary: a.summary,
          category: a.category_name || "",
          imageUrl: a.image_url || "https://placehold.co/600x400/png",
          views: formatViews(a.views_count),
        }));
        if (isMounted) setArticles(mapped);
      } catch (e: any) {
        if (isMounted) setError(e?.message || "Error cargando artículos");
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [selectedCategory, searchQuery]);

  const featured = useMemo<UiArticle | null>(() => {
    if (!articles.length) return null;
    return articles[0];
  }, [articles]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header mode="small">
        <IconButton icon="menu" onPress={() => {}} accessibilityLabel="Menu" />

        {!showSearch ? (
          <>
            <Appbar.Content title="NotifIA" />
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
              key={c}
              selected={selectedCategory === c}
              onPress={() => setSelectedCategory(c)}
            >
              {c}
            </Chip>
          ))}
        </ScrollView>

        {featured && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <FeaturedCard article={featured} />
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
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
