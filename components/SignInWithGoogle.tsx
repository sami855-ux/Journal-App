import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { Button } from "tamagui";

// Preload browser on Android to reduce login delay
const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS === "android") {
      WebBrowser.warmUpAsync();
    }
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);
};

// Required for deep linking auth flow
WebBrowser.maybeCompleteAuthSession();

const SignInWithGoogle = () => {
  useWarmUpBrowser();

  const router = useRouter();

  const { startSSOFlow } = useSSO();

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",

        redirectUrl: AuthSession.makeRedirectUri({}),
      });

      if (createdSessionId) {
        await setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);

              return;
            }
          },
        });
      } else {
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
    }
  }, [router, startSSOFlow]);

  return (
    <Button
      onPress={handleGoogleSignIn}
      theme="blue"
      size="$4"
      variant="outlined"
      borderWidth={1}
      borderColor={"#904BFF"}
      color={"#904BFF"}
    >
      Sign in with Google
    </Button>
  );
};

export default SignInWithGoogle;
