import ArticleCard from "@/components/Card";
import FeaturedCard from "@/components/FeaturedCard";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Appbar,
  Chip,
  Divider,
  IconButton,
  TextInput,
  useTheme,
} from "react-native-paper";

type Article = {
  id: string;
  title: string;
  summary: string;
  category: string;
  image: any;
  views: string;
};

const categories = [
  "Todo",
  "Nuevo",
  "Política",
  "Deportes",
  "Tecnología",
  "Salud",
  "Naturaleza",
];

const featured: Article = {
  id: "featured",
  title: "Eclipse que solo ocurre cada 100 años",
  summary:
    "Este viernes 14 de octubre un suceso que solo ocurre cada 100 años será visible a vista plana…",
  category: "Naturaleza",
  image: require("../assets/images/react-logo.png"),
  views: "12.5K",
};

const articles: Article[] = [
  {
    id: "1",
    title: "Meditar es el secreto para la salud",
    summary: "Científicos descubren que meditar es beneficioso para…",
    category: "Salud",
    image: "https://placecats.com/300/200",
    views: "8.2K",
  },
  {
    id: "2",
    title: "Nuevo superconductor descubierto en China",
    summary: "Científicos descubren de la universidad de Hong Kong…",
    category: "Tecnología",
    image: "https://placecats.com/300/200",
    views: "22.1K",
  },
  {
    id: "3",
    title: "El clásico termina en empate y polémica",
    summary: "Un partido vibrante mantiene la tabla apretada",
    category: "Deportes",
    image: "https://placecats.com/300/200",
    views: "15.7K",
  },
];

export default function Index() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter((article) => {
    const matchCategory =
      selectedCategory === "Todo" || article.category === selectedCategory;
    const matchSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const filteredFeatured =
    (selectedCategory === "Todo" || featured.category === selectedCategory) &&
    featured.title.toLowerCase().includes(searchQuery.toLowerCase())
      ? featured
      : null;

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
          {categories.map((c, index) => (
            <Chip
              key={c}
              selected={selectedCategory === c}
              onPress={() => setSelectedCategory(c)}
            >
              {c}
            </Chip>
          ))}
        </ScrollView>

        {filteredFeatured && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <FeaturedCard article={filteredFeatured} />
          </View>
        )}

        <Divider style={{ marginHorizontal: 16, marginVertical: 8 }} />

        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {filteredArticles.map((item) => (
            <ArticleCard
              key={item.id}
              id={item.id}
              title={item.title}
              summary={item.summary}
              category={item.category}
              image="https://placecats.com/300/200"
              views={item.views}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
