import { useAuth } from "@clerk/clerk-expo";
import { Spinner } from "tamagui";
import { Stack } from "expo-router";

export default function Layout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <Spinner />;
  }

  return (
    <Stack>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}
