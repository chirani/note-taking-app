import { fontSizes, spacing } from "@/config/ui";
import { useTheme, type ThemeColors } from "@/hooks/theme";
import {
  Ionicons,
  type IoniconsIconName,
} from "@react-native-vector-icons/ionicons";
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import {
  EnrichedMarkdownTextInput,
  type EnrichedMarkdownTextInputInstance,
  type MarkdownShortcutsConfig,
  type MarkdownTextInputStyle,
  type StyleState,
} from "react-native-enriched-markdown";
import { ThemedButton, ThemedText, ThemedTextInput, ThemedView } from "./ui";

/** Imperative handle exposed by {@link MarkdownEditor}. */
export type MarkdownEditorHandle = EnrichedMarkdownTextInputInstance;

export interface MarkdownEditorProps {
  /**
   * Initial Markdown content. Parsed once on mount — changing it later has no
   * effect. Either remount the editor with a new `key` or call
   * `ref.current.setValue(markdown)` to load different content.
   */
  defaultValue?: string;
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean;
  /** Shows the formatting toolbar. Defaults to `true`. */
  showToolbar?: boolean;
  /**
   * Converts typed Markdown prefixes (`# `, `- `, `1. `) into blocks.
   * Defaults to `true`.
   */
  markdownShortcuts?: boolean | MarkdownShortcutsConfig;
  onChangeMarkdown?: (markdown: string) => void;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  /** Style for the outer bordered container. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Style merged into the native Markdown input. */
  inputStyle?: StyleProp<ViewStyle & TextStyle>;
  /** Style merged into the toolbar (the horizontal ScrollView). */
  toolbarStyle?: StyleProp<ViewStyle>;
}

type Command =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "h1"
  | "h2"
  | "bullet"
  | "ordered"
  | "outdent"
  | "indent"
  | "link";

const withAlpha = (hex: string, alpha: number) => {
  const value = hex.replace("#", "");
  if (value.length !== 6) return hex;

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Markdown note editor backed by Software Mansion's
 * `react-native-enriched-markdown`.
 *
 * Rich-text editing (bold, italic, headings, lists, links) with Markdown
 * output, plus a themed formatting toolbar. The native input is uncontrolled:
 * `defaultValue` is only read on mount, so remount (via `key`) or call
 * `setValue()` on the ref when switching notes.
 *
 * ```tsx
 * <MarkdownEditor
 *   key={note.id}
 *   defaultValue={note.body}
 *   onChangeMarkdown={(markdown) => debouncedSave(markdown)}
 * />
 * ```
 *
 * Requires a native development build (it is not available in Expo Go).
 */
const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(
  (
    {
      defaultValue,
      placeholder = "Start writing…",
      editable = true,
      autoFocus,
      showToolbar = true,
      markdownShortcuts = true,
      onChangeMarkdown,
      onChangeText,
      onFocus,
      onBlur,
      containerStyle,
      inputStyle,
      toolbarStyle,
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const inputRef = useRef<EnrichedMarkdownTextInputInstance | null>(null);
    const [styleState, setStyleState] = useState<StyleState | null>(null);
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [linkVisible, setLinkVisible] = useState(false);
    const [linkLabel, setLinkLabel] = useState("");
    const [linkUrl, setLinkUrl] = useState("");

    useImperativeHandle(
      ref,
      () => inputRef.current as MarkdownEditorHandle,
      [],
    );

    const markdownStyle = useMemo<MarkdownTextInputStyle>(
      () => ({
        strong: { color: colors.colorBaseContent },
        em: { color: colors.colorBaseContent },
        link: { color: colors.colorInfo, underline: true },
        spoiler: {
          color: colors.colorBaseContent,
          backgroundColor: colors.colorBase300,
        },
        h1: headingStyle(fontSizes.h1, colors),
        h2: headingStyle(fontSizes.h2, colors),
        h3: headingStyle(fontSizes.h3, colors),
        h4: headingStyle(fontSizes.h3, colors),
        h5: headingStyle(fontSizes.regular, colors),
        h6: headingStyle(fontSizes.small, colors),
        list: { itemSpacing: spacing.xs },
      }),
      [colors],
    );

    const isActive = (command: Command) => {
      if (!styleState) return false;

      switch (command) {
        case "bold":
          return styleState.bold.isActive;
        case "italic":
          return styleState.italic.isActive;
        case "underline":
          return styleState.underline.isActive;
        case "strikethrough":
          return styleState.strikethrough.isActive;
        case "h1":
          return styleState.heading.isActive && styleState.heading.level === 1;
        case "h2":
          return styleState.heading.isActive && styleState.heading.level === 2;
        case "bullet":
          return styleState.unorderedList.isActive;
        case "ordered":
          return styleState.orderedList.isActive;
        case "link":
          return styleState.link.isActive;
        default:
          return false;
      }
    };

    const handleCommand = (command: Command) => {
      if (!editable) return;

      if (command === "link") {
        setLinkLabel("");
        setLinkUrl("");
        setLinkVisible(true);
        return;
      }

      const instance = inputRef.current;
      if (!instance) return;

      switch (command) {
        case "bold":
          instance.toggleBold();
          break;
        case "italic":
          instance.toggleItalic();
          break;
        case "underline":
          instance.toggleUnderline();
          break;
        case "strikethrough":
          instance.toggleStrikethrough();
          break;
        case "h1":
          instance.toggleHeading(1);
          break;
        case "h2":
          instance.toggleHeading(2);
          break;
        case "bullet":
          instance.toggleUnorderedList();
          break;
        case "ordered":
          instance.toggleOrderedList();
          break;
        case "outdent":
          instance.outdentList();
          break;
        case "indent":
          instance.indentList();
          break;
      }
    };

    const applyLink = () => {
      const url = linkUrl.trim();
      if (!url) return;

      const label = linkLabel.trim();
      const hasSelection = selection.end > selection.start;

      if (hasSelection) {
        // The native selection survives the modal, so apply the URL to it.
        inputRef.current?.setLink(url);
      } else if (label) {
        inputRef.current?.insertLink(label, url);
      } else {
        inputRef.current?.insertLink(url, url);
      }

      setLinkVisible(false);
    };

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.colorBase100,
            borderColor: colors.colorBase300,
          },
          containerStyle,
        ]}
      >
        {showToolbar && (
          <Toolbar
            colors={colors}
            disabled={!editable}
            isActive={isActive}
            onCommand={handleCommand}
            style={toolbarStyle}
          />
        )}

        <EnrichedMarkdownTextInput
          ref={inputRef}
          defaultValue={defaultValue}
          placeholder={placeholder}
          placeholderTextColor={withAlpha(colors.colorBaseContent, 0.5)}
          editable={editable}
          autoFocus={autoFocus}
          markdownShortcuts={markdownShortcuts}
          autoCapitalize="none"
          cursorColor={colors.colorPrimary}
          selectionColor={colors.colorSecondary}
          markdownStyle={markdownStyle}
          style={
            StyleSheet.flatten([
              styles.input,
              { color: colors.colorBaseContent },
              inputStyle,
            ]) ?? {}
          }
          onChangeText={onChangeText}
          onChangeMarkdown={onChangeMarkdown}
          onChangeSelection={setSelection}
          onChangeState={setStyleState}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        <Modal
          visible={linkVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLinkVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalBackdrop}
          >
            <Pressable
              style={StyleSheet.absoluteFill}
              accessibilityRole="button"
              accessibilityLabel="Close link dialog"
              onPress={() => setLinkVisible(false)}
            />
            <ThemedView
              style={[styles.modalCard, { borderColor: colors.colorBase300 }]}
            >
              <ThemedText
                size="h3"
                color={colors.colorBaseContent}
                style={styles.modalTitle}
              >
                Insert link
              </ThemedText>

              <ThemedTextInput
                value={linkLabel}
                onChangeText={setLinkLabel}
                editable={selection.end <= selection.start}
                placeholder={
                  selection.end > selection.start
                    ? "Selected text will be linked"
                    : "Text (optional)"
                }
                autoCapitalize="none"
                style={[
                  styles.modalInput,
                  { color: colors.colorBaseContent },
                ]}
              />
              <ThemedTextInput
                value={linkUrl}
                onChangeText={setLinkUrl}
                placeholder="https://example.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                returnKeyType="done"
                onSubmitEditing={applyLink}
                style={[
                  styles.modalInput,
                  { color: colors.colorBaseContent },
                ]}
              />

              <View style={styles.modalActions}>
                <ThemedButton
                  size="sm"
                  variant="outline"
                  onPress={() => setLinkVisible(false)}
                >
                  Cancel
                </ThemedButton>
                <ThemedButton
                  size="sm"
                  onPress={applyLink}
                  disabled={linkUrl.trim().length === 0}
                >
                  Insert
                </ThemedButton>
              </View>
            </ThemedView>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  },
);

MarkdownEditor.displayName = "MarkdownEditor";

interface ToolbarProps {
  colors: ThemeColors;
  disabled: boolean;
  isActive: (command: Command) => boolean;
  onCommand: (command: Command) => void;
  style?: StyleProp<ViewStyle>;
}

const Toolbar: React.FC<ToolbarProps> = ({
  colors,
  disabled,
  isActive,
  onCommand,
  style,
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    keyboardShouldPersistTaps="always"
    style={[
      styles.toolbar,
      {
        backgroundColor: colors.colorBase200,
        borderBottomColor: colors.colorBase300,
      },
      style,
    ]}
    contentContainerStyle={styles.toolbarContent}
  >
    <ToolbarButton
      colors={colors}
      label="B"
      textStyle={styles.labelBold}
      accessibilityLabel="Bold"
      active={isActive("bold")}
      disabled={disabled}
      onPress={() => onCommand("bold")}
    />
    <ToolbarButton
      colors={colors}
      label="I"
      textStyle={styles.labelItalic}
      accessibilityLabel="Italic"
      active={isActive("italic")}
      disabled={disabled}
      onPress={() => onCommand("italic")}
    />
    <ToolbarButton
      colors={colors}
      label="U"
      textStyle={styles.labelUnderline}
      accessibilityLabel="Underline"
      active={isActive("underline")}
      disabled={disabled}
      onPress={() => onCommand("underline")}
    />
    <ToolbarButton
      colors={colors}
      label="S"
      textStyle={styles.labelStrike}
      accessibilityLabel="Strikethrough"
      active={isActive("strikethrough")}
      disabled={disabled}
      onPress={() => onCommand("strikethrough")}
    />

    <ToolbarDivider color={colors.colorBase300} />

    <ToolbarButton
      colors={colors}
      label="H1"
      accessibilityLabel="Heading 1"
      active={isActive("h1")}
      disabled={disabled}
      onPress={() => onCommand("h1")}
    />
    <ToolbarButton
      colors={colors}
      label="H2"
      accessibilityLabel="Heading 2"
      active={isActive("h2")}
      disabled={disabled}
      onPress={() => onCommand("h2")}
    />

    <ToolbarDivider color={colors.colorBase300} />

    <ToolbarButton
      colors={colors}
      icon="list"
      accessibilityLabel="Bullet list"
      active={isActive("bullet")}
      disabled={disabled}
      onPress={() => onCommand("bullet")}
    />
    <ToolbarButton
      colors={colors}
      label="1."
      accessibilityLabel="Numbered list"
      active={isActive("ordered")}
      disabled={disabled}
      onPress={() => onCommand("ordered")}
    />
    <ToolbarButton
      colors={colors}
      icon="return-down-back"
      accessibilityLabel="Outdent list item"
      disabled={disabled}
      onPress={() => onCommand("outdent")}
    />
    <ToolbarButton
      colors={colors}
      icon="return-down-forward"
      accessibilityLabel="Indent list item"
      disabled={disabled}
      onPress={() => onCommand("indent")}
    />

    <ToolbarDivider color={colors.colorBase300} />

    <ToolbarButton
      colors={colors}
      icon="link"
      accessibilityLabel="Insert link"
      active={isActive("link")}
      disabled={disabled}
      onPress={() => onCommand("link")}
    />
  </ScrollView>
);

interface ToolbarButtonProps {
  colors: ThemeColors;
  label?: string;
  icon?: IoniconsIconName;
  textStyle?: TextStyle;
  accessibilityLabel: string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  colors,
  label,
  icon,
  textStyle,
  accessibilityLabel,
  active = false,
  disabled = false,
  onPress,
}) => {
  const color = active ? colors.colorprimaryContent : colors.colorBaseContent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.toolButton,
        active && { backgroundColor: colors.colorPrimary },
        pressed && !active && { backgroundColor: colors.colorBase300 },
        disabled && styles.disabled,
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={18} color={color} />
      ) : (
        <Text style={[styles.toolLabel, textStyle, { color }]}>{label}</Text>
      )}
    </Pressable>
  );
};

const ToolbarDivider: React.FC<{ color: string }> = ({ color }) => (
  <View style={[styles.divider, { backgroundColor: color }]} />
);

const headingStyle = (fontSize: number, colors: ThemeColors) => ({
  fontSize,
  fontWeight: "bold",
  color: colors.colorBaseContent,
});

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 8,
    overflow: "hidden",
  },
  input: {
    minHeight: 220,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    fontSize: fontSizes.regular,
    textAlignVertical: "top",
  },
  toolbar: {
    flexGrow: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toolbarContent: {
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  toolButton: {
    width: 34,
    height: 34,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  toolLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  labelBold: {
    fontWeight: "700",
  },
  labelItalic: {
    fontStyle: "italic",
  },
  labelUnderline: {
    textDecorationLine: "underline",
  },
  labelStrike: {
    textDecorationLine: "line-through",
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 20,
    marginHorizontal: spacing.sm,
  },
  disabled: {
    opacity: 0.4,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  modalCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.md,
  },
  modalTitle: {
    marginBottom: spacing.xs,
  },
  modalInput: {
    height: 46,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.md,
    marginTop: spacing.xs,
  },
});

export default MarkdownEditor;
