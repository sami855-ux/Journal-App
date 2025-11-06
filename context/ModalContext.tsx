import { AlertTriangle, Info } from "@tamagui/lucide-icons";
import React, { createContext, useContext, useState } from "react";
import { AlertDialog, Button, Dialog, XStack, YStack } from "tamagui";

type ModalType = "dialog" | "alert";

interface ModalConfig {
  type: ModalType;
  title: string;
  description?: string;
  context?: React.ReactNode;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ModalContextValue {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [open, setOpen] = useState(false);

  const showModal = (config: ModalConfig) => {
    setModalConfig(config);
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);

    setTimeout(() => setModalConfig(null), 300);
  };

  const handleConfirm = async () => {
    if (modalConfig?.onConfirm) {
      await modalConfig.onConfirm();
    }

    hideModal();
  };

  const handleCancel = () => {
    modalConfig?.onCancel?.();
    hideModal();
  };

  return (
    <ModalContext.Provider
      value={{
        showModal,
        hideModal,
      }}
    >
      {children}

      {modalConfig?.type === "dialog" && (
        <Dialog modal open={open} onOpenChange={setOpen}>
          <Dialog.Overlay
            key={"dialog-overlay"}
            animation={"quick"}
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            onPress={hideModal}
          />
          <Dialog.Content bordered elevate>
            <YStack gap="$3">
              <XStack style={{ alignItems: "center" }} gap="$2">
                <Info size={20} />
                <Dialog.Title>{modalConfig.title}</Dialog.Title>
              </XStack>
              {modalConfig.description ? (
                <Dialog.Description>
                  {modalConfig.description}
                </Dialog.Description>
              ) : null}
              {modalConfig.context}
              <XStack style={{ justifyContent: "flex-end" }} gap="$3" mt="$2">
                <Button size="$3" variant="outlined" onPress={handleCancel}>
                  {modalConfig.cancelText ?? "Cancel"}
                </Button>
                <Button size="$3" onPress={handleConfirm}>
                  {modalConfig.confirmText ?? "OK"}
                </Button>
              </XStack>
            </YStack>
          </Dialog.Content>
        </Dialog>
      )}

      {modalConfig?.type === "alert" && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialog.Overlay
            key={"alert-overlay"}
            animation={"quick"}
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content bordered elevate>
            <YStack gap="$3">
              <XStack style={{ alignItems: "center" }} gap="$2">
                <AlertTriangle size={20} />
                <AlertDialog.Title>{modalConfig.title}</AlertDialog.Title>
              </XStack>
              {modalConfig.description ? (
                <AlertDialog.Description>
                  {modalConfig.description}
                </AlertDialog.Description>
              ) : null}
              {modalConfig.context}
              <XStack style={{ justifyContent: "flex-end" }} gap="$3" mt="$2">
                <AlertDialog.Cancel asChild>
                  <Button size="$3" variant="outlined" onPress={handleCancel}>
                    {modalConfig.cancelText ?? "Cancel"}
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button size="$3" onPress={handleConfirm}>
                    {modalConfig.confirmText ?? "Confirm"}
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
