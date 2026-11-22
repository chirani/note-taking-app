import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownToolbar from "@/components/MarkdownToolbar";
import {
  ThemedIconButton,
  ThemedScrollView,
  ThemedText,
  ThemedTextInput,
  ThemedView,
} from "@/components/ui";
import { fontSizes, spacing } from "@/config/ui";
import { createTodo } from "@/db";
import { useDb } from "@/hooks/useDb";
import { useTheme } from "@/hooks/theme";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import type {
  EnrichedMarkdownTextInputInstance,
  StyleState,
} from "react-native-enriched-markdown";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const pad = (value: number) => String(value).padStart(2, "0");

/** Local `YYYY-MM-DDTHH:mm`, matching the format stored in the `due_date` column. */
const toISODateTime = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;

/**
 * The last day of next month at 9:00 AM, matching the database column's default
 * day so an untouched todo behaves the same as one saved explicitly.
 */
const endOfNextMonth = (): Date => {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  date.setHours(9, 0, 0, 0);
  return date;
};

const dueDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const formatDueDate = (date: Date): string => dueDateFormatter.format(date);

/** Whether the device/locale displays times in 24-hour format. */
const uses24HourTime = new Intl.DateTimeFormat(undefined, { hour: "numeric" })
  .formatToParts(new Date(2020, 0, 1, 13))
  .every((part) => part.type !== "dayPeriod");

export default function NewTodoScreen() {
  const db = useDb();
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const editorRef = useRef<EnrichedMarkdownTextInputInstance | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dueDate, setDueDate] = useState(() => endOfNextMonth());
  const [pickerStep, setPickerStep] = useState<"date" | "time" | null>(null);
  const [styleState, setStyleState] = useState<StyleState | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () =>
      setKeyboardVisible(true),
    );
    const hideSubscription = Keyboard.addListener(hideEvent, () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const canSave = title.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;

    setSaving(true);
    try {
      await createTodo(db, {
        title: title.trim(),
        body: body.length > 0 ? body : undefined,
        dueDate: toISODateTime(dueDate),
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
      <MarkdownToolbar
        editorRef={editorRef}
        state={styleState}
        style={styles.toolbar}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
          <View
            style={[
              styles.dueDateRow,
              {
                backgroundColor: colors.colorBase200,
                borderColor: colors.colorBase300,
              },
            ]}
            onTouchStart={Keyboard.dismiss}
          >
            <View style={styles.dueDateLabel}>
              <Ionicons
                name="calendar-outline"
                size={fontSizes.regular}
                color={colors.colorBaseContent}
              />
              <ThemedText size="small">Due date</ThemedText>
            </View>
            {Platform.OS === "ios" ? (
              <DateTimePicker
                mode="datetime"
                display="compact"
                value={dueDate}
                onValueChange={(_event, date) => setDueDate(date)}
                themeVariant={mode}
                accentColor={colors.colorPrimary}
              />
            ) : (
              <Pressable
                style={styles.dueDateTrigger}
                accessibilityRole="button"
                accessibilityLabel={`Due date: ${formatDueDate(dueDate)}`}
                onPress={() => {
                  Keyboard.dismiss();
                  setPickerStep("date");
                }}
              >
                <ThemedText size="small">{formatDueDate(dueDate)}</ThemedText>
                <Ionicons
                  name="chevron-down"
                  size={fontSizes.small}
                  color={colors.colorBaseContent}
                />
              </Pressable>
            )}
          </View>
          <View>
            <MarkdownEditor
              ref={editorRef}
              showToolbar={false}
              onChangeState={setStyleState}
              placeholder="Write about this todo…"
              onChangeMarkdown={setBody}
              style={{ flex: 1, minHeight: 360 }}
            />
          </View>
        </ThemedScrollView>
        <View
          style={[
            styles.toolbarBar,
            {
              backgroundColor: colors.colorBase100,
              borderTopColor: colors.colorBase300,
              paddingBottom: keyboardVisible
                ? spacing.sm
                : insets.bottom + spacing.sm,
            },
          ]}
        ></View>
      </KeyboardAvoidingView>
      {Platform.OS === "android" && pickerStep === "date" && (
        <DateTimePicker
          mode="date"
          presentation="dialog"
          value={dueDate}
          onValueChange={(_event, date) => {
            setDueDate(date);
            setPickerStep("time");
          }}
          onDismiss={() => setPickerStep(null)}
          themeVariant={mode}
          accentColor={colors.colorPrimary}
          positiveButton={{ label: "Next" }}
          negativeButton={{ label: "Cancel" }}
        />
      )}
      {Platform.OS === "android" && pickerStep === "time" && (
        <DateTimePicker
          mode="time"
          presentation="dialog"
          value={dueDate}
          is24Hour={uses24HourTime}
          onValueChange={(_event, date) => {
            setDueDate(date);
            setPickerStep(null);
          }}
          onDismiss={() => setPickerStep(null)}
          themeVariant={mode}
          accentColor={colors.colorPrimary}
          positiveButton={{ label: "Set" }}
          negativeButton={{ label: "Cancel" }}
        />
      )}
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
  toolbarBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
  },
  dueDateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderRadius: 8,
  },
  dueDateLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  dueDateTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  toolbar: {
    marginBottom: 0,
    borderWidth: 0,
  },
});
