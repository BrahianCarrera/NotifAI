import AsyncStorage from "@react-native-async-storage/async-storage";

export type HistoryItem = {
    id: string;
    title: string;
    imageUrl: string;
    category: string;
    viewedAt: number;
};

const HISTORY_KEY = "article_history";
const MAX_HISTORY_ITEMS = 50;

export const addToHistory = async (article: Omit<HistoryItem, "viewedAt">) => {
    try {
        const history = await getHistory();

        // Remove if already exists (to move to top)
        const filtered = history.filter((item) => item.id !== article.id);

        // Add new item to beginning
        const newItem: HistoryItem = { ...article, viewedAt: Date.now() };
        const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
        console.error("Error adding to history:", e);
    }
};

export const getHistory = async (): Promise<HistoryItem[]> => {
    try {
        const json = await AsyncStorage.getItem(HISTORY_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.error("Error getting history:", e);
        return [];
    }
};

export const clearHistory = async () => {
    try {
        await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (e) {
        console.error("Error clearing history:", e);
    }
};
