import { useAuth } from "@/contexts/AuthContext";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import {
  Appbar,
  Button,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleLogin = async () => {
    if (submitting) return;

    // Validación básica
    if (!email.trim() || !password.trim()) {
      setError("Por favor completa todos los campos");
      setShowSnackbar(true);
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor ingresa un email válido");
      setShowSnackbar(true);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await signIn({ email, password });
      router.replace("/home" as Href);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      setShowSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header>
        <Appbar.Content title="Iniciar sesión" />
      </Appbar.Header>

      <View style={{ padding: 16, gap: 12 }}>
        <Text variant="headlineMedium" style={{ marginBottom: 8 }}>
          Bienvenido a NotifIA
        </Text>
        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          inputMode="email"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextInput
          mode="outlined"
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />
        <Button mode="contained" onPress={handleLogin} loading={submitting}>
          Entrar
        </Button>
      </View>

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={4000}
        action={{
          label: "Cerrar",
          onPress: () => setShowSnackbar(false),
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
}
