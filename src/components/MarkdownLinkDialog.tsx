import { ThemedButton, ThemedText, ThemedTextInput } from "@/components/ui";
import { spacing } from "@/config/ui";
import { useTheme } from "@/hooks/theme";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

export type MarkdownLinkDialogMode = "insert" | "edit";

export interface MarkdownLinkDialogProps {
  /**
   * `insert` creates a new link and asks for optional link text.
   * `edit` changes the URL of the link at the caret.
   */
  mode: MarkdownLinkDialogMode;
  /** Existing destination, prefilled when editing a link. */
  initialUrl?: string;
  onCancel: () => void;
  /** `text` is empty in edit mode; the caller falls back to the URL. */
  onSubmit: (text: string, url: string) => void;
}

const hasScheme = /^[a-zA-Z][a-zA-Z\d+.-]*:/;
const isRelativeTarget = /^[#/.]/;

/** Adds `https://` to bare targets while leaving schemes and anchors intact. */
const normalizeUrl = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (hasScheme.test(trimmed) || isRelativeTarget.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

/**
 * A small themed dialog for inserting or editing a Markdown link. React Native
 * has no cross-platform prompt (`Alert.prompt` is iOS-only), so this is an
 * in-app modal instead.
 *
 * Mount this component to open it; the fields are initialized from the props
 * once per mount, so conditional rendering resets them for every link session.
 */
const MarkdownLinkDialog: React.FC<MarkdownLinkDialogProps> = ({
  mode,
  initialUrl = "",
  onCancel,
  onSubmit,
}) => {
  const { colors } = useTheme();
  const [text, setText] = useState("");
  const [url, setUrl] = useState(initialUrl);

  const canSubmit = url.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const destination = normalizeUrl(url);
    onSubmit(text.trim() || destination, destination);
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.fill}
      >
        <Pressable style={styles.backdrop} onPress={onCancel}>
          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: colors.colorBase100,
                borderColor: colors.colorBase300,
              },
            ]}
            onPress={(event) => event.stopPropagation()}
          >
            <ThemedText size="h3">
              {mode === "edit" ? "Edit link" : "Insert link"}
            </ThemedText>

            {mode === "insert" && (
              <View style={styles.field}>
                <ThemedText size="small">Text</ThemedText>
                <ThemedTextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="Link text (optional)"
                  autoFocus
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            )}

            <View style={styles.field}>
              <ThemedText size="small">URL</ThemedText>
              <ThemedTextInput
                value={url}
                onChangeText={setUrl}
                placeholder="https://example.com"
                autoFocus={mode === "edit"}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </View>

            <View style={styles.actions}>
              <ThemedButton size="sm" variant="transparent" onPress={onCancel}>
                Cancel
              </ThemedButton>
              <ThemedButton
                size="sm"
                onPress={handleSubmit}
                disabled={!canSubmit}
              >
                {mode === "edit" ? "Save" : "Insert"}
              </ThemedButton>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderRadius: 12,
  },
  field: {
    gap: spacing.xs,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.md,
  },
});

export default MarkdownLinkDialog;
