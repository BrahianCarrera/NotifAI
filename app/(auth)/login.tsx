import { useAuth } from "@/contexts/AuthContext";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Appbar, Button, Text, TextInput, useTheme } from "react-native-paper";

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await signIn({ email, password });
      router.replace("/home" as Href);
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
    </View>
  );
}
