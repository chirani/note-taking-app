import DraftListItem from "@/components/DraftListItem";
import {
  ThemedButton,
  ThemedIconButton,
  ThemedText,
  ThemedView,
} from "@/components/ui";
import { spacing } from "@/config/ui";
import { useDrafts } from "@/hooks/useDrafts";
import { useTheme } from "@/hooks/theme";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

const ItemSeparator = () => <View style={styles.itemSeparator} />;

export default function DraftsScreen() {
  const { colors } = useTheme();
  const draftsQuery = useDrafts();
  const drafts = draftsQuery.data ?? [];

  const close = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
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
          accessibilityLabel="Back"
          onPress={close}
        />
        <ThemedText size="h3">Drafts</ThemedText>
        <View style={styles.headerSpacer} />
      </ThemedView>
      {draftsQuery.isPending ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.colorPrimary} />
        </View>
      ) : draftsQuery.error ? (
        <View style={styles.centered}>
          <ThemedText style={styles.centeredText}>
            Couldn&apos;t load your drafts
          </ThemedText>
          <ThemedText
            size="small"
            style={[styles.centeredText, styles.secondary]}
          >
            {draftsQuery.error.message}
          </ThemedText>
          <ThemedButton size="sm" onPress={() => void draftsQuery.refetch()}>
            Try again
          </ThemedButton>
        </View>
      ) : drafts.length === 0 ? (
        <View style={styles.centered}>
          <ThemedText>No drafts yet</ThemedText>
          <ThemedText
            size="small"
            style={[styles.centeredText, styles.secondary]}
          >
            Leaving a new todo without saving keeps it as a draft.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={drafts}
          keyExtractor={(draft) => `draft-${draft.id}`}
          renderItem={({ item }) => <DraftListItem draft={item} />}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.content}
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
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
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
