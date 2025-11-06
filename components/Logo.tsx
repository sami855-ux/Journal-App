import { Feather } from "@tamagui/lucide-icons";
import { Text, XStack, YStack } from "tamagui";
import React from "react";

export default function Logo({ hasText = false }: { hasText?: boolean }) {
  return (
    <YStack gap={"$3"} style={{ alignItems: "center" }} mb={"$4"}>
      <XStack
        bg={"$purple10"}
        p="$3"
        style={{
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
        }}
      >
        <Feather size={32} color="white" />
      </XStack>

      {hasText && (
        <Text fontSize={"$7"} fontWeight="bold" color="$color">
          Journal AI
        </Text>
      )}
    </YStack>
  );
}
