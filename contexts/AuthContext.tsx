import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type User = {
  id: number;
  email: string;
  name: string;
  role: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (params: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

const API_BASE_URL = "http://localhost:3000/api";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error verificando estado de autenticación:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar sesión existente al cargar la app
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Importante para cookies de sesión
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error en el login");
        }

        if (data.success) {
          const userData = data.data.user;
          setUser(userData);
          setIsAuthenticated(true);

          // Guardar usuario en AsyncStorage para persistencia
          await AsyncStorage.setItem("user", JSON.stringify(userData));
        } else {
          throw new Error(data.message || "Error en el login");
        }
      } catch (error) {
        console.error("Error en login:", error);
        throw error;
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      // Llamar al endpoint de logout del backend
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      // Limpiar estado local independientemente del resultado del backend
      setUser(null);
      setIsAuthenticated(false);
      await AsyncStorage.removeItem("user");
    }
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, user, signIn, signOut, loading }),
    [isAuthenticated, user, signIn, signOut, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
