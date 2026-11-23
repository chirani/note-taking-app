import { ThemedText, ThemedView } from "@/components/ui";
import { spacing } from "@/config/ui";
import type { Draft } from "@/db";
import { useTheme } from "@/hooks/theme";
import { formatDueDateValue, formatEditedAt } from "@/lib/date";
import { markdownPreview } from "@/lib/text";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { StyleSheet, View } from "react-native";

export interface DraftListItemProps {
  draft: Draft;
}

/** A read-only summary row for an unfinished todo draft. */
const DraftListItem: React.FC<DraftListItemProps> = ({ draft }) => {
  const { colors } = useTheme();
  const title = draft.title.trim();
  const preview = draft.body ? markdownPreview(draft.body) : "";
  const editedAt = formatEditedAt(draft.updatedAt);

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: colors.colorBase200,
          borderColor: colors.colorBase300,
        },
      ]}
    >
      <ThemedText
        numberOfLines={1}
        style={title.length === 0 ? styles.untitled : undefined}
      >
        {title.length > 0 ? title : "Untitled draft"}
      </ThemedText>
      {preview.length > 0 && (
        <ThemedText size="x-small" numberOfLines={1} style={styles.secondary}>
          {preview}
        </ThemedText>
      )}
      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Ionicons
            name="calendar-outline"
            size={12}
            color={colors.colorBaseContent}
          />
          <ThemedText size="x-small" style={styles.secondary}>
            {formatDueDateValue(draft.dueDate)}
          </ThemedText>
        </View>
        {editedAt && (
          <View style={styles.meta}>
            <Ionicons
              name="pencil-outline"
              size={12}
              color={colors.colorBaseContent}
            />
            <ThemedText size="x-small" style={styles.secondary}>
              {editedAt}
            </ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.xs,
  },
  secondary: {
    opacity: 0.7,
  },
  untitled: {
    fontStyle: "italic",
    opacity: 0.7,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});

export default DraftListItem;
