import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from "expo-router/stack";
import { StatusBar } from "react-native";

export default function Layout() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) return <Redirect href={"/sign-in"} />;

  return (
    <>
      <StatusBar />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
