import { fontSizes, spacing } from "@/config/ui";
import { useTheme } from "@/hooks/theme";
import { useMemo, useRef, useState, type RefObject } from "react";
import { StyleSheet, View } from "react-native";
import {
  EnrichedMarkdownTextInput,
  type EnrichedMarkdownTextInputInstance,
  type EnrichedMarkdownTextInputProps,
  type StyleState,
} from "react-native-enriched-markdown";
import MarkdownToolbar from "./MarkdownToolbar";

export interface MarkdownEditorProps extends EnrichedMarkdownTextInputProps {
  /** Show the formatting toolbar above the input. Defaults to `true`. */
  showToolbar?: boolean;
}

/**
 * A minimal, theme-aware Markdown editor backed by
 * `react-native-enriched-markdown`.
 *
 * The input is uncontrolled: use `defaultValue` for initial content,
 * `onChangeMarkdown` to track edits, and the forwarded `ref` for imperative
 * actions (e.g. `ref.current?.toggleBold()`). A formatting toolbar is shown
 * above the input by default; set `showToolbar={false}` to hide it.
 */
const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  ref: forwardedRef,
  placeholder = "Start writing…",
  placeholderTextColor,
  markdownShortcuts = true,
  markdownStyle,
  style,
  showToolbar = true,
  onChangeMarkdown,
  onChangeState,
  ...inputProps
}) => {
  const { colors } = useTheme();
  const inputRef = useRef<EnrichedMarkdownTextInputInstance | null>(null);
  const [styleState, setStyleState] = useState<StyleState | null>(null);

  // Keep an internal ref for the toolbar while still updating the caller's ref.
  const mergedRef = useMemo<
    RefObject<EnrichedMarkdownTextInputInstance | null>
  >(
    () => ({
      get current() {
        return inputRef.current;
      },
      set current(instance) {
        inputRef.current = instance;
        if (forwardedRef) forwardedRef.current = instance;
      },
    }),
    [forwardedRef],
  );

  return (
    <View>
      {showToolbar && (
        <MarkdownToolbar editorRef={inputRef} state={styleState} />
      )}
      <EnrichedMarkdownTextInput
        {...inputProps}
        ref={mergedRef}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor ?? colors.colorNeutral}
        markdownShortcuts={markdownShortcuts}
        onChangeMarkdown={onChangeMarkdown}
        onChangeState={(state) => {
          setStyleState(state);
          onChangeState?.(state);
        }}
        markdownStyle={{
          strong: { color: colors.colorPrimary },
          em: { color: colors.colorSecondary },
          link: { color: colors.colorInfo },
          ...markdownStyle,
        }}
        style={
          StyleSheet.flatten([
            styles.input,
            {
              color: colors.colorBaseContent,
              backgroundColor: colors.colorBase100,
              borderColor: colors.colorBase300,
            },
            style,
          ]) ?? undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    minHeight: 200,
    padding: spacing.lg,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: fontSizes.regular,
    lineHeight: fontSizes.regular * 1.4,
    textAlignVertical: "top",
  },
});

export default MarkdownEditor;
