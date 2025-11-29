import * as React from "react";
import { Image, View } from "react-native";
import { Card, Chip, IconButton, Text, useTheme } from "react-native-paper";

type ArticleCardProps = {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  views: string;
  likes?: number;
  isBookmarked?: boolean;
  isLiked?: boolean;
  onPress?: () => void;
  onBookmarkPress?: () => void;
  onLikePress?: () => void;
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  summary,
  category,
  imageUrl,
  views,
  likes = 0,
  isBookmarked = false,
  isLiked = false,
  onPress,
  onBookmarkPress,
  onLikePress,
}) => {
  const theme = useTheme();

  return (
    <Card
      key={id}
      mode="elevated"
      style={{
        borderRadius: 16,
        overflow: "hidden",
      }}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: "row",
          padding: 12,
          gap: 12,
        }}
      >
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 12,
          }}
          resizeMode="cover"
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Chip
              compact
              mode="flat"
              textStyle={{ fontSize: 11 }}
              style={{ marginBottom: 8 }}
            >
              {category}
            </Chip>
            {onBookmarkPress && (
              <IconButton
                icon={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={20}
                onPress={(e) => {
                  e?.stopPropagation?.();
                  onBookmarkPress();
                }}
                style={{ margin: 0 }}
              />
            )}
          </View>

          <Text variant="titleMedium" numberOfLines={2} style={{ marginBottom: 4 }}>
            {title}
          </Text>
          <Text variant="bodySmall" style={{ opacity: 0.7 }} numberOfLines={2}>
            {summary}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginTop: 8,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <IconButton
                icon="eye-outline"
                size={16}
                onPress={() => {}}
                style={{ margin: 0 }}
              />
              <Text variant="bodySmall">{views}</Text>
            </View>
            {onLikePress && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <IconButton
                  icon={isLiked ? "heart" : "heart-outline"}
                  size={16}
                  iconColor={isLiked ? theme.colors.error : undefined}
                  onPress={(e) => {
                    e?.stopPropagation?.();
                    onLikePress();
                  }}
                  style={{ margin: 0 }}
                />
                <Text variant="bodySmall">{likes}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

export default ArticleCard;
