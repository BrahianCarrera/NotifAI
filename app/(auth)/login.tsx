import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  Snackbar,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      // Redirección manejada por _layout.tsx
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Logo/Icon Section */}
          <View style={styles.logoContainer}>
            <Surface
              style={[
                styles.logoSurface,
                {
                  backgroundColor: theme.colors.primaryContainer,
                },
              ]}
              elevation={2}
            >
              <IconButton
                icon="newspaper-variant"
                size={64}
                iconColor={theme.colors.primary}
              />
            </Surface>
            <Text
              variant="displaySmall"
              style={[styles.title, { color: theme.colors.primary }]}
            >
              NotifIA
            </Text>
            <Text
              variant="bodyLarge"
              style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
            >
              Noticias inteligentes al instante
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <Text variant="headlineSmall" style={styles.formTitle}>
              Iniciar sesión
            </Text>

            <TextInput
              mode="outlined"
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              inputMode="email"
              autoCapitalize="none"
              autoComplete="email"
              left={<TextInput.Icon icon="email-outline" />}
              style={styles.input}
              disabled={submitting}
            />

            <TextInput
              mode="outlined"
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
              disabled={submitting}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={submitting}
              disabled={submitting}
              style={styles.loginButton}
              contentStyle={styles.loginButtonContent}
            >
              Entrar
            </Button>

            <Button
              mode="text"
              onPress={() => {
                // TODO: Navigate to forgot password screen
                console.log("Forgot password");
              }}
              style={styles.forgotButton}
              disabled={submitting}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              ¿No tienes una cuenta?
            </Text>
            <Button
              mode="text"
              onPress={() => {
                // TODO: Navigate to register screen
                console.log("Register");
              }}
              disabled={submitting}
            >
              Regístrate
            </Button>
          </View>
        </View>
      </ScrollView>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoSurface: {
    borderRadius: 80,
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 32,
  },
  formTitle: {
    marginBottom: 24,
    fontWeight: "600",
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  forgotButton: {
    alignSelf: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});
