import * as React from "react";
import { View } from "react-native";
import { Card, Chip, IconButton, Text, useTheme } from "react-native-paper";

type FeaturedCardProps = {
  article: {
    id: string;
    title: string;
    summary: string;
    category: string;
    imageUrl: string;
    views: string;
    likes?: number;
    isBookmarked?: boolean;
    isLiked?: boolean;
  };
  onPress?: () => void;
  onBookmarkPress?: () => void;
  onLikePress?: () => void;
};

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  article,
  onPress,
  onBookmarkPress,
  onLikePress,
}) => {
  const theme = useTheme();

  return (
    <Card mode="elevated" style={{ borderRadius: 16 }} onPress={onPress}>
      <Card.Cover
        source={{ uri: article.imageUrl }}
        style={{
          height: 220,
          borderBottomEndRadius: 0,
          borderBottomStartRadius: 0,
        }}
      />
      <Card.Content style={{ paddingTop: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Chip compact mode="flat">
            {article.category}
          </Chip>
          {onBookmarkPress && (
            <IconButton
              icon={article.isBookmarked ? "bookmark" : "bookmark-outline"}
              size={22}
              onPress={(e) => {
                e?.stopPropagation?.();
                onBookmarkPress();
              }}
              style={{ margin: 0 }}
            />
          )}
        </View>

        <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
          {article.title}
        </Text>
        <Text variant="bodyMedium" style={{ opacity: 0.7 }} numberOfLines={3}>
          {article.summary}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            marginTop: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <IconButton
              icon="eye-outline"
              size={18}
              onPress={() => {}}
              style={{ margin: 0 }}
            />
            <Text variant="bodyMedium">{article.views}</Text>
          </View>
          {onLikePress && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <IconButton
                icon={article.isLiked ? "heart" : "heart-outline"}
                size={18}
                iconColor={article.isLiked ? theme.colors.error : undefined}
                onPress={(e) => {
                  e?.stopPropagation?.();
                  onLikePress();
                }}
                style={{ margin: 0 }}
              />
              <Text variant="bodyMedium">{article.likes || 0}</Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

export default FeaturedCard;
