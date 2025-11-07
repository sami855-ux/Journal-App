import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import {
  Button,
  Card,
  H2,
  Input,
  Paragraph,
  Separator,
  Spacer,
  XStack,
  YStack,
} from "tamagui";
import SignInWithGoogle from "../../components/SignInWithGoogle";
import { useModal } from "../../context/ModalContext";

function SignUpContent() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const { showModal } = useModal();

  // Handle the submission of the sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start the sign-up process using the email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set pending verification to true to show the code input
      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      showModal({
        type: "alert",
        title: "Sign up failed",
        description:
          err?.errors?.[0]?.message ||
          "Please check your email and password, then try again.",
        confirmText: "OK",
      });
    }
  };

  // Handle the submission of the verification code
  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      // Verify the email address with the code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification is complete, set the session as active
      // and redirect the user
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why
        console.error(JSON.stringify(completeSignUp, null, 2));
        showModal({
          type: "alert",
          title: "Verification failed",
          description: "Please check your verification code and try again.",
          confirmText: "OK",
        });
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      showModal({
        type: "alert",
        title: "Verification failed",
        description:
          err?.errors?.[0]?.message ||
          "Please check your verification code and try again.",
        confirmText: "OK",
      });
    }
  };

  // If pending verification, show the code input form
  if (pendingVerification) {
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
              <H2>Verify your email</H2>
              <Paragraph>
                We sent a verification code to {emailAddress}
              </Paragraph>
            </YStack>

            <YStack gap="$3">
              <Input
                value={code}
                placeholder="Verification code"
                onChangeText={(val) => setCode(val)}
                keyboardType="number-pad"
              />
              <Button size="$4" onPress={onPressVerify}>
                Verify
              </Button>
            </YStack>

            <Spacer size="$2" />

            <XStack gap="$2" style={{ justifyContent: "center" }}>
              <Paragraph>Didn't receive a code?</Paragraph>
              <Button
                unstyled
                onPress={async () => {
                  if (isLoaded) {
                    await signUp.prepareEmailAddressVerification({
                      strategy: "email_code",
                    });
                  }
                }}
              >
                <Paragraph fontWeight="600">Resend</Paragraph>
              </Button>
            </XStack>
          </YStack>
        </Card>
      </YStack>
    );
  }

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
            <H2>Create an account</H2>
            <Paragraph>Sign up to get started</Paragraph>
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
            <Button size="$4" onPress={onSignUpPress}>
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
            <Paragraph>Already have an account?</Paragraph>
            <Button unstyled onPress={() => router.push("/sign-in")}>
              <Paragraph fontWeight="600">Sign in</Paragraph>
            </Button>
          </XStack>
        </YStack>
      </Card>
    </YStack>
  );
}

export default function Page() {
  return <SignUpContent />;
}
