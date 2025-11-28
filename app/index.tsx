import { useAuth } from "@/contexts/AuthContext";
import type { Href } from "expo-router";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function RootIndex() {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar indicador de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Una vez cargado, redirigir según el estado de autenticación
  if (isAuthenticated) {
    return <Redirect href={"/home" as Href} />;
  }
  return <Redirect href={"/(auth)/login" as Href} />;
}
