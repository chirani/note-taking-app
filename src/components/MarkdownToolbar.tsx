import { ThemedText } from "@/components/ui";
import { fontSizes, spacing } from "@/config/ui";
import { useTheme } from "@/hooks/theme";
import type { RefObject } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type TextStyle,
} from "react-native";
import type {
  EnrichedMarkdownTextInputInstance,
  StyleState,
} from "react-native-enriched-markdown";

export interface MarkdownToolbarProps {
  /** Ref to the editor instance the toolbar controls. */
  editorRef: RefObject<EnrichedMarkdownTextInputInstance | null>;
  /** Current editor style state, used to highlight active buttons. */
  state?: StyleState | null;
}

type ToolbarGroup = "inline" | "heading" | "list";

interface ToolbarAction {
  key: string;
  label: string;
  accessibilityLabel: string;
  group: ToolbarGroup;
  labelStyle?: TextStyle;
  isActive: (state: StyleState | null | undefined) => boolean;
  onPress: (editor: EnrichedMarkdownTextInputInstance) => void;
}

const actions: ToolbarAction[] = [
  {
    key: "bold",
    label: "B",
    accessibilityLabel: "Bold",
    group: "inline",
    labelStyle: { fontWeight: "bold" },
    isActive: (state) => state?.bold.isActive ?? false,
    onPress: (editor) => editor.toggleBold(),
  },
  {
    key: "italic",
    label: "I",
    accessibilityLabel: "Italic",
    group: "inline",
    labelStyle: { fontStyle: "italic" },
    isActive: (state) => state?.italic.isActive ?? false,
    onPress: (editor) => editor.toggleItalic(),
  },
  {
    key: "underline",
    label: "U",
    accessibilityLabel: "Underline",
    group: "inline",
    labelStyle: { textDecorationLine: "underline" },
    isActive: (state) => state?.underline.isActive ?? false,
    onPress: (editor) => editor.toggleUnderline(),
  },
  {
    key: "strikethrough",
    label: "S",
    accessibilityLabel: "Strikethrough",
    group: "inline",
    labelStyle: { textDecorationLine: "line-through" },
    isActive: (state) => state?.strikethrough.isActive ?? false,
    onPress: (editor) => editor.toggleStrikethrough(),
  },
  {
    key: "heading1",
    label: "H1",
    accessibilityLabel: "Heading 1",
    group: "heading",
    isActive: (state) =>
      state?.heading.isActive === true && state.heading.level === 1,
    onPress: (editor) => editor.toggleHeading(1),
  },
  {
    key: "heading2",
    label: "H2",
    accessibilityLabel: "Heading 2",
    group: "heading",
    isActive: (state) =>
      state?.heading.isActive === true && state.heading.level === 2,
    onPress: (editor) => editor.toggleHeading(2),
  },
  {
    key: "unorderedList",
    label: "•",
    accessibilityLabel: "Bullet list",
    group: "list",
    isActive: (state) => state?.unorderedList.isActive ?? false,
    onPress: (editor) => editor.toggleUnorderedList(),
  },
  {
    key: "orderedList",
    label: "1.",
    accessibilityLabel: "Numbered list",
    group: "list",
    isActive: (state) => state?.orderedList.isActive ?? false,
    onPress: (editor) => editor.toggleOrderedList(),
  },
];

interface ToolbarButtonProps {
  action: ToolbarAction;
  active: boolean;
  onPress: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  action,
  active,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={action.accessibilityLabel}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        active && { backgroundColor: colors.colorPrimary },
        pressed && !active && { backgroundColor: colors.colorBase200 },
      ]}
    >
      <ThemedText
        size="small"
        color={active ? colors.colorBase100 : colors.colorBaseContent}
        style={[styles.label, action.labelStyle]}
      >
        {action.label}
      </ThemedText>
    </Pressable>
  );
};

/**
 * A compact formatting bar for `MarkdownEditor`. Buttons run the editor's
 * imperative commands and highlight when the cursor sits in the matching style.
 */
const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
  editorRef,
  state,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.toolbar,
        {
          backgroundColor: colors.colorBase100,
          borderColor: colors.colorBase300,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.content}
      >
        {actions.map((action, index) => {
          const showSeparator =
            index > 0 && actions[index - 1].group !== action.group;

          return (
            <View key={action.key} style={styles.item}>
              {showSeparator && (
                <View
                  style={[
                    styles.separator,
                    { backgroundColor: colors.colorBase300 },
                  ]}
                />
              )}
              <ToolbarButton
                action={action}
                active={action.isActive(state)}
                onPress={() => {
                  const editor = editorRef.current;
                  if (!editor) return;
                  editor.focus();
                  action.onPress(editor);
                }}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  content: {
    alignItems: "center",
    padding: spacing.xs,
    gap: spacing.xs,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    minWidth: 34,
    height: 32,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  label: {
    fontSize: fontSizes.small,
  },
  separator: {
    width: 1,
    height: 20,
    marginHorizontal: spacing.xs,
  },
});

export default MarkdownToolbar;
