import * as React from "react";
import { ScrollView, View, Image, StyleSheet } from "react-native";
import {
  Modal,
  Portal,
  Text,
  IconButton,
  Chip,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { apiRequest, handleApiResponse } from "../utils/api";

type Article = {
  id: string;
  title: string;
  content: string;
  summary: string;
  image_url: string;
  published_at: string;
  author_name: string;
  category_name: string;
  category_color: string;
  views_count: number;
  likes_count: number;
  is_favorite: boolean;
  is_liked: boolean;
};

type ArticleModalProps = {
  visible: boolean;
  articleId: string | null;
  onDismiss: () => void;
  onToggleFavorite?: (isFavorite: boolean) => void;
};

const ArticleModal: React.FC<ArticleModalProps> = ({
  visible,
  articleId,
  onDismiss,
  onToggleFavorite,
}) => {
  const theme = useTheme();
  const [article, setArticle] = React.useState<Article | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (visible && articleId) {
      fetchArticle();
    }
  }, [visible, articleId]);

  const fetchArticle = async () => {
    if (!articleId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest(`/articles/${articleId}`, {
        method: "GET",
      });

      const json = await handleApiResponse(response);

      if (json.success && json.data?.article) {
        setArticle(json.data.article);
      } else {
        setError("No se pudo cargar el articulo");
      }
    } catch (err) {
      console.error("Error fetching article:", err);
      setError("Error al cargar el articulo");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!article) return;

    try {
      const response = await apiRequest(`/articles/${article.id}/favorite`, {
        method: "POST",
      });

      if (response.success) {
        const newFavoriteState = response.data?.is_favorite ?? !article.is_favorite;
        setArticle({ ...article, is_favorite: newFavoriteState });
        onToggleFavorite?.(newFavoriteState);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.header}>
          <IconButton
            icon="close"
            size={24}
            onPress={onDismiss}
            style={styles.closeButton}
          />
        </View>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
              {error}
            </Text>
          </View>
        ) : article ? (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {article.image_url && (
              <Image
                source={{ uri: article.image_url }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.content}>
              <View style={styles.categoryRow}>
                <Chip
                  compact
                  mode="flat"
                  style={{ backgroundColor: article.category_color || undefined }}
                >
                  {article.category_name}
                </Chip>
              </View>

              <Text variant="headlineMedium" style={styles.title}>
                {article.title}
              </Text>

              <View style={styles.metadata}>
                <View style={styles.metadataItem}>
                  <IconButton icon="account-outline" size={16} style={{ margin: 0 }} />
                  <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                    {article.author_name}
                  </Text>
                </View>
                <View style={styles.metadataItem}>
                  <IconButton icon="calendar-outline" size={16} style={{ margin: 0 }} />
                  <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                    {formatDate(article.published_at)}
                  </Text>
                </View>
              </View>

              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <IconButton icon="eye-outline" size={18} style={{ margin: 0 }} />
                  <Text variant="bodyMedium">{article.views_count}</Text>
                </View>
                {onToggleFavorite && (
                  <IconButton
                    icon={article.is_favorite ? "heart" : "heart-outline"}
                    iconColor={article.is_favorite ? "#E91E63" : undefined}
                    size={24}
                    onPress={handleToggleFavorite}
                  />
                )}
              </View>

              <Text variant="bodyLarge" style={styles.articleContent}>
                {article.content}
              </Text>
            </View>
          </ScrollView>
        ) : null}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    borderRadius: 16,
    maxHeight: "90%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  closeButton: {
    margin: 0,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  scrollView: {
    flex: 1,
  },
  coverImage: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 20,
  },
  categoryRow: {
    marginBottom: 12,
  },
  title: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  metadata: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  articleContent: {
    lineHeight: 28,
  },
});

export default ArticleModal;
