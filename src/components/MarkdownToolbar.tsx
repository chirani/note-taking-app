import { spacing } from "@/config/ui";
import { useTheme } from "@/hooks/theme";
import {
  MaterialDesignIcons,
  type MaterialDesignIconsIconName,
} from "@react-native-vector-icons/material-design-icons";
import { useState, type RefObject } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type {
  EnrichedMarkdownTextInputInstance,
  StyleState,
} from "react-native-enriched-markdown";
import MarkdownLinkDialog, {
  type MarkdownLinkDialogMode,
} from "./MarkdownLinkDialog";

export interface MarkdownToolbarProps {
  /** Ref to the editor instance the toolbar controls. */
  editorRef: RefObject<EnrichedMarkdownTextInputInstance | null>;
  /** Current editor style state, used to highlight active buttons. */
  state?: StyleState | null;
  /** Extra styles for the toolbar container. */
  style?: StyleProp<ViewStyle>;
}

type ToolbarGroup = "inline" | "heading" | "list" | "link" | "history";

interface ToolbarAction {
  key: string;
  icon: MaterialDesignIconsIconName;
  accessibilityLabel: string;
  group: ToolbarGroup;
  isActive?: (state: StyleState | null | undefined) => boolean;
  isDisabled?: (state: StyleState | null | undefined) => boolean;
  /** Hidden on iOS/Android, where the underlying command is a no-op. */
  webOnly?: boolean;
  /** Opens the link dialog instead of running an editor command. */
  opensLinkDialog?: boolean;
  onPress?: (editor: EnrichedMarkdownTextInputInstance) => void;
}

const inList = (state: StyleState | null | undefined) =>
  (state?.unorderedList.isActive ?? false) ||
  (state?.orderedList.isActive ?? false);

const actions: ToolbarAction[] = [
  {
    key: "bold",
    icon: "format-bold",
    accessibilityLabel: "Bold",
    group: "inline",
    isActive: (state) => state?.bold.isActive ?? false,
    onPress: (editor) => editor.toggleBold(),
  },
  {
    key: "italic",
    icon: "format-italic",
    accessibilityLabel: "Italic",
    group: "inline",
    isActive: (state) => state?.italic.isActive ?? false,
    onPress: (editor) => editor.toggleItalic(),
  },
  {
    key: "underline",
    icon: "format-underline",
    accessibilityLabel: "Underline",
    group: "inline",
    isActive: (state) => state?.underline.isActive ?? false,
    onPress: (editor) => editor.toggleUnderline(),
  },
  {
    key: "strikethrough",
    icon: "format-strikethrough",
    accessibilityLabel: "Strikethrough",
    group: "inline",
    isActive: (state) => state?.strikethrough.isActive ?? false,
    onPress: (editor) => editor.toggleStrikethrough(),
  },
  {
    key: "spoiler",
    icon: "eye-off-outline",
    accessibilityLabel: "Spoiler",
    group: "inline",
    isActive: (state) => state?.spoiler.isActive ?? false,
    onPress: (editor) => editor.toggleSpoiler(),
  },
  {
    key: "heading1",
    icon: "format-header-1",
    accessibilityLabel: "Heading 1",
    group: "heading",
    isActive: (state) =>
      state?.heading.isActive === true && state.heading.level === 1,
    onPress: (editor) => editor.toggleHeading(1),
  },
  {
    key: "heading2",
    icon: "format-header-2",
    accessibilityLabel: "Heading 2",
    group: "heading",
    isActive: (state) =>
      state?.heading.isActive === true && state.heading.level === 2,
    onPress: (editor) => editor.toggleHeading(2),
  },
  {
    key: "heading3",
    icon: "format-header-3",
    accessibilityLabel: "Heading 3",
    group: "heading",
    isActive: (state) =>
      state?.heading.isActive === true && state.heading.level === 3,
    onPress: (editor) => editor.toggleHeading(3),
  },
  {
    key: "heading4",
    icon: "format-header-4",
    accessibilityLabel: "Heading 4",
    group: "heading",
    isActive: (state) =>
      state?.heading.isActive === true && state.heading.level === 4,
    onPress: (editor) => editor.toggleHeading(4),
  },
  {
    key: "heading5",
    icon: "format-header-5",
    accessibilityLabel: "Heading 5",
    group: "heading",
    isActive: (state) =>
      state?.heading.isActive === true && state.heading.level === 5,
    onPress: (editor) => editor.toggleHeading(5),
  },
  {
    key: "heading6",
    icon: "format-header-6",
    accessibilityLabel: "Heading 6",
    group: "heading",
    isActive: (state) =>
      state?.heading.isActive === true && state.heading.level === 6,
    onPress: (editor) => editor.toggleHeading(6),
  },
  {
    key: "unorderedList",
    icon: "format-list-bulleted",
    accessibilityLabel: "Bullet list",
    group: "list",
    isActive: (state) => state?.unorderedList.isActive ?? false,
    onPress: (editor) => editor.toggleUnorderedList(),
  },
  {
    key: "orderedList",
    icon: "format-list-numbered",
    accessibilityLabel: "Numbered list",
    group: "list",
    isActive: (state) => state?.orderedList.isActive ?? false,
    onPress: (editor) => editor.toggleOrderedList(),
  },
  {
    key: "indentList",
    icon: "format-indent-increase",
    accessibilityLabel: "Indent list item",
    group: "list",
    isDisabled: (state) => !inList(state),
    onPress: (editor) => editor.indentList(),
  },
  {
    key: "outdentList",
    icon: "format-indent-decrease",
    accessibilityLabel: "Outdent list item",
    group: "list",
    isDisabled: (state) => !inList(state),
    onPress: (editor) => editor.outdentList(),
  },
  {
    key: "link",
    icon: "link-variant",
    accessibilityLabel: "Insert or edit link",
    group: "link",
    isActive: (state) => state?.link.isActive ?? false,
    opensLinkDialog: true,
  },
  {
    key: "unlink",
    icon: "link-variant-off",
    accessibilityLabel: "Remove link",
    group: "link",
    isDisabled: (state) => !(state?.link.isActive ?? false),
    onPress: (editor) => editor.removeLink(),
  },
  {
    key: "undo",
    icon: "undo",
    accessibilityLabel: "Undo",
    group: "history",
    webOnly: true,
    onPress: (editor) => editor.undo(),
  },
  {
    key: "redo",
    icon: "redo",
    accessibilityLabel: "Redo",
    group: "history",
    webOnly: true,
    onPress: (editor) => editor.redo(),
  },
  {
    key: "copy",
    icon: "content-copy",
    accessibilityLabel: "Copy whole note as Markdown",
    group: "history",
    onPress: (editor) => editor.copyToClipboard(),
  },
];

interface ToolbarButtonProps {
  action: ToolbarAction;
  active: boolean;
  disabled: boolean;
  onPress: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  action,
  active,
  disabled,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={action.accessibilityLabel}
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        active && { backgroundColor: colors.colorPrimary },
        pressed && !active && { backgroundColor: colors.colorBase200 },
        disabled && styles.disabled,
      ]}
    >
      <MaterialDesignIcons
        name={action.icon}
        size={20}
        color={active ? colors.colorBase100 : colors.colorBaseContent}
      />
    </Pressable>
  );
};

interface LinkDialogState {
  mode: MarkdownLinkDialogMode;
  initialUrl: string;
}

/**
 * A compact formatting bar for `MarkdownEditor`. Buttons run the editor's
 * imperative commands and highlight when the cursor sits in the matching style.
 */
const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
  editorRef,
  state,
  style,
}) => {
  const { colors } = useTheme();
  const [linkDialog, setLinkDialog] = useState<LinkDialogState | null>(null);

  const visibleActions = actions.filter(
    (action) => !action.webOnly || Platform.OS === "web",
  );

  const handleActionPress = (action: ToolbarAction) => {
    if (action.opensLinkDialog) {
      const isEditing = state?.link.isActive ?? false;
      setLinkDialog({
        mode: isEditing ? "edit" : "insert",
        initialUrl: isEditing ? (state?.link.destination ?? "") : "",
      });
      return;
    }

    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    action.onPress?.(editor);
  };

  const handleLinkSubmit = (text: string, url: string) => {
    const mode = linkDialog?.mode;
    setLinkDialog(null);

    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    if (mode === "edit") {
      editor.setLink(url);
    } else {
      editor.insertLink(text, url);
    }
  };

  return (
    <View
      style={[
        styles.toolbar,
        {
          backgroundColor: colors.colorBase100,
          borderColor: colors.colorBase300,
        },
        style,
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.content}
      >
        {visibleActions.map((action, index) => {
          const showSeparator =
            index > 0 && visibleActions[index - 1].group !== action.group;

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
                active={action.isActive?.(state) ?? false}
                disabled={action.isDisabled?.(state) ?? false}
                onPress={() => handleActionPress(action)}
              />
            </View>
          );
        })}
      </ScrollView>
      {linkDialog && (
        <MarkdownLinkDialog
          mode={linkDialog.mode}
          initialUrl={linkDialog.initialUrl}
          onCancel={() => setLinkDialog(null)}
          onSubmit={handleLinkSubmit}
        />
      )}
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
    width: 44,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  disabled: {
    opacity: 0.35,
  },
  separator: {
    width: 1,
    height: 20,
    marginHorizontal: spacing.xs,
  },
});

export default MarkdownToolbar;
