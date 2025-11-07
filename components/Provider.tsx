import { ModalProvider } from "@/context/ModalContext";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider, type TamaguiProviderProps } from "tamagui";
import { tamaguiConfig } from "../tamagui.config";

export function Provider({
  children,
  ...rest
}: Omit<TamaguiProviderProps, "config">) {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ClerkProvider tokenCache={tokenCache}>
        <TamaguiProvider
          config={tamaguiConfig}
          defaultTheme={colorScheme === "dark" ? "dark" : "light"}
          {...rest}
        >
          {" "}
          {/*  Wrap everything that uses portals */}
          <ModalProvider>{children}</ModalProvider>
        </TamaguiProvider>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
