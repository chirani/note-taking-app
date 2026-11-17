import MarkdownEditor from "@/components/MarkdownEditor";
import {
  ThemedIconButton,
  ThemedScrollView,
  ThemedText,
  ThemedTextInput,
  ThemedView,
} from "@/components/ui";
import { spacing } from "@/config/ui";
import { createTodo } from "@/db";
import { useDb } from "@/hooks/useDb";
import { useTheme } from "@/hooks/theme";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

export default function NewTodoScreen() {
  const db = useDb();
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const canSave = title.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;

    setSaving(true);
    try {
      await createTodo(db, {
        title: title.trim(),
        body: body.length > 0 ? body : undefined,
      });
      router.back();
    } catch (error) {
      console.error("Failed to create todo", error);
      Alert.alert("Couldn't save todo", "Please try again.");
      setSaving(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView
        style={[styles.header, { borderBottomColor: colors.colorBase300 }]}
      >
        <ThemedIconButton
          icon="chevron-back"
          variant="transparent"
          accessibilityLabel="Cancel"
          onPress={() => router.back()}
        />
        <ThemedText size="h3">New todo</ThemedText>
        <ThemedIconButton
          icon="checkmark"
          variant="transparent"
          accessibilityLabel="Save todo"
          disabled={!canSave}
          onPress={handleSave}
        />
      </ThemedView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ThemedScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <ThemedTextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            autoFocus
            maxLength={200}
            returnKeyType="next"
          />
          <MarkdownEditor
            placeholder="Write about this todo…"
            onChangeMarkdown={setBody}
            style={{ flex: 1, minHeight: 360 }}
          />
        </ThemedScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
    flex: 1,
  },
});
