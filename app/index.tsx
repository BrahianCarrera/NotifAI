import { useAuth } from "@/contexts/AuthContext";
import type { Href } from "expo-router";
import { Redirect } from "expo-router";

export default function RootIndex() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Redirect href={"/home" as Href} />;
  }
  return <Redirect href={"/(auth)/login" as Href} />;
}
