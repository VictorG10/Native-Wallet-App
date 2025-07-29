import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/clerk-expo";
import SafeScreen from "@/components/SafeScreen";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <StatusBar style="dark" />
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  );
}
