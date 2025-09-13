import * as React from "react";
import { View } from "react-native";
import { Card, Chip, IconButton, Text } from "react-native-paper";

type FeaturedCardProps = {
  article: {
    id: string;
    title: string;
    summary: string;
    category: string;
    image: any;
    views: string;
  };
};

const FeaturedCard: React.FC<FeaturedCardProps> = ({ article }) => (
  <Card mode="elevated" style={{ borderRadius: 16 }}>
    <Card.Cover source={article.image} style={{ height: 180 }} theme={{}} />
    <Card.Content>
      <View style={{ marginTop: 8, marginBottom: 6 }}>
        <Chip compact>{article.category}</Chip>
      </View>
      <Text variant="titleMedium" style={{ marginBottom: 6 }}>
        {article.title}
      </Text>
      <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
        {article.summary}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          marginTop: 8,
        }}
      >
        <IconButton icon="eye-outline" size={16} onPress={() => {}} />
        <Text>{article.views}</Text>
      </View>
    </Card.Content>
  </Card>
);

export default FeaturedCard;
