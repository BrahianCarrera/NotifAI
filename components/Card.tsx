import * as React from "react";
import { Image, View } from "react-native";
import { Card, Chip, IconButton, Text } from "react-native-paper";

type ArticleCardProps = {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  views: string;
  isFavorite?: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  summary,
  category,
  imageUrl,
  views,
  isFavorite = false,
  onPress,
  onToggleFavorite,
}) => {
  return (
    <Card
      key={id}
      mode="outlined"
      style={{ borderRadius: 16 }}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: "row",
          padding: 12,
          gap: 12,
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 96, height: 72, borderRadius: 12 }}
          resizeMode="cover"
        />
        <View style={{ flex: 1 }}>
          <View style={{ marginBottom: 4 }}>
            <Chip compact mode="flat">
              {category}
            </Chip>
          </View>
          <Text variant="titleSmall">{title}</Text>
          <Text variant="bodySmall" style={{ opacity: 0.7 }} numberOfLines={2}>
            {summary}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <IconButton icon="eye-outline" size={16} onPress={() => {}} />
              <Text>{views}</Text>
            </View>
            {onToggleFavorite && (
              <IconButton
                icon={isFavorite ? "heart" : "heart-outline"}
                iconColor={isFavorite ? "#E91E63" : undefined}
                size={20}
                onPress={onToggleFavorite}
              />
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

export default ArticleCard;
