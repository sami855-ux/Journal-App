import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import {
  Button,
  Card,
  H2,
  Paragraph,
  YStack,
  XStack,
  Input,
  Separator,
  Spacer,
} from "tamagui";
import SignInWithGoogle from "../../components/SignInWithGoogle";
import { useModal } from "../../context/ModalContext";

function SignInContent() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { showModal } = useModal();

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
        showModal({
          type: "alert",
          title: "Additional steps required",
          description: "Please follow the next steps to finish signing in.",
          confirmText: "OK",
        });
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      showModal({
        type: "alert",
        title: "Sign in failed",
        description: "Please check your email and password, then try again.",
        confirmText: "OK",
      });
    }
  };

  return (
    <YStack
      style={{
        minHeight: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Card elevate bordered padding={20} width={360}>
        <YStack gap="$4">
          <YStack gap="$2" style={{ alignItems: "center" }}>
            <H2>Welcome back</H2>
            <Paragraph>Sign in to continue</Paragraph>
          </YStack>

          <YStack gap="$3">
            <Input
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email"
              onChangeText={(val) => setEmailAddress(val)}
            />
            <Input
              value={password}
              placeholder="Password"
              secureTextEntry
              onChangeText={(val) => setPassword(val)}
            />
            <Button size="$4" onPress={onSignInPress}>
              Continue
            </Button>
          </YStack>

          <YStack gap="$3">
            <XStack gap="$3" style={{ alignItems: "center" }}>
              <Separator flex={1} />
              <Paragraph>or</Paragraph>
              <Separator flex={1} />
            </XStack>
            <SignInWithGoogle />
          </YStack>

          <Spacer size="$2" />

          <XStack gap="$2" style={{ justifyContent: "center" }}>
            <Paragraph>Don't have an account?</Paragraph>
            <Button unstyled onPress={() => router.push("/")}>
              <Paragraph fontWeight="600">Sign up</Paragraph>
            </Button>
          </XStack>
        </YStack>
      </Card>
    </YStack>
  );
}

export default function Page() {
  return <SignInContent />;
}
