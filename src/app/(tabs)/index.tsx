import TodoListItem from "@/components/TodoListItem";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { spacing } from "@/config/ui";
import { useDrafts } from "@/hooks/useDrafts";
import { useTheme } from "@/hooks/theme";
import { useTodos } from "@/hooks/useTodos";
import { useQueryClient } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

const ItemSeparator = () => <View style={styles.itemSeparator} />;

export default function Home() {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const todosQuery = useTodos();
  const draftsQuery = useDrafts();
  const firstFocusRef = useRef(true);

  // A todo saved on the New Todo screen must show up when this tab regains
  // focus, and drafts written on the way out must update the button count.
  // The first focus is skipped because the queries already fetch on mount.
  useFocusEffect(
    useCallback(() => {
      if (firstFocusRef.current) {
        firstFocusRef.current = false;
        return;
      }

      void queryClient.refetchQueries({ queryKey: ["todos"], type: "active" });
      void queryClient.refetchQueries({ queryKey: ["drafts"], type: "active" });
    }, [queryClient]),
  );

  const todos = todosQuery.data ?? [];
  const draftCount = draftsQuery.data?.length ?? 0;

  return (
    <ThemedView style={{ flex: 1, gap: spacing.md }}>
      <ThemedView style={styles.header} />
      {draftCount && (
        <View style={styles.draftsBar}>
          <ThemedButton
            variant="outline"
            accessibilityLabel={`Drafts, ${draftCount}`}
            onPress={() => router.navigate("/drafts")}
          >
            {`Drafts (${draftCount})`}
          </ThemedButton>
        </View>
      )}
      {todosQuery.isPending ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.colorPrimary} />
        </View>
      ) : todosQuery.error ? (
        <View style={styles.centered}>
          <ThemedText style={styles.centeredText}>
            Couldn&apos;t load your todos
          </ThemedText>
          <ThemedText
            size="small"
            style={[styles.centeredText, styles.secondary]}
          >
            {todosQuery.error.message}
          </ThemedText>
          <ThemedButton size="sm" onPress={() => void todosQuery.refetch()}>
            Try again
          </ThemedButton>
        </View>
      ) : todos.length === 0 ? (
        <View style={styles.centered}>
          <ThemedText>Your inbox is empty</ThemedText>
          <ThemedText
            size="small"
            style={[styles.centeredText, styles.secondary]}
          >
            Todos will show up here.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(todo) => `todo-${todo.id}`}
          renderItem={({ item }) => <TodoListItem todo={item} />}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.content}
        />
      )}
      <FloatingActionButton
        icon="add"
        accessibilityLabel="New todo"
        offset={spacing.xl}
        onPress={() => router.push("/todos/new")}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    width: "100%",
    borderBottomWidth: 2,
  },
  draftsBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    // Clearance for the floating action button at the end of the list.
    paddingBottom: 96,
  },
  itemSeparator: {
    height: spacing.md,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.xl,
  },
  centeredText: {
    textAlign: "center",
  },
  secondary: {
    opacity: 0.7,
  },
});
