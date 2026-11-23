import { ThemedText, ThemedView } from "@/components/ui";
import { spacing } from "@/config/ui";
import type { Todo } from "@/db";
import { useTheme } from "@/hooks/theme";
import { formatDueDateValue } from "@/lib/date";
import { markdownPreview } from "@/lib/text";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { StyleSheet, View } from "react-native";

export interface TodoListItemProps {
  todo: Todo;
}

/** A read-only summary row for a todo: title, body preview, due date, tags. */
const TodoListItem: React.FC<TodoListItemProps> = ({ todo }) => {
  const { colors } = useTheme();
  const preview = todo.body ? markdownPreview(todo.body) : "";

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
      <ThemedText numberOfLines={1}>{todo.title}</ThemedText>
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
            {formatDueDateValue(todo.dueDate)}
          </ThemedText>
        </View>
      </View>
      {todo.tags.length > 0 && (
        <View style={styles.tags}>
          {todo.tags.map((tag, index) => (
            <ThemedView
              key={`${tag}-${index}`}
              style={[styles.tag, { backgroundColor: colors.colorBase300 }]}
            >
              <ThemedText size="x-small">{tag}</ThemedText>
            </ThemedView>
          ))}
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderRadius: 8,
    gap: spacing.xs,
  },
  secondary: {
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
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default TodoListItem;
