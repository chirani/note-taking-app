import MarkdownEditor from "@/components/MarkdownEditor";
import {
  ThemedButton,
  ThemedCheckbox,
  ThemedIconButton,
  ThemedRadioButton,
  ThemedScrollView,
  ThemedText,
  ThemedTextInput,
  ThemedToggle,
} from "@/components/ui";
import { useTheme } from "@/hooks/theme";
import { useState } from "react";
import { View } from "react-native";

const markdownExample = `# Markdown Editor

Type **bold**, *italic*, or a [link](https://expo.dev).

- Bullet list item
- Another item

1. Numbered item
2. Second item`;

export default function DesignScreen() {
  const { colors } = useTheme();
  const [markdown, setMarkdown] = useState(markdownExample);
  const [toggleValue, setToggleValue] = useState(false);
  const [largeToggleValue, setLargeToggleValue] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [largeCheckboxChecked, setLargeCheckboxChecked] = useState(true);
  const [radioValue, setRadioValue] = useState("one");

  return (
    <View style={{ flex: 1 }}>
      <ThemedScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View style={{ height: 100 }} />
        <View style={{ marginBottom: 16 }}>
          <ThemedText
            size="h3"
            color={colors.colorSecondary}
            style={{ marginBottom: 16 }}
          >
            Markdown Editor Styles
          </ThemedText>
          <MarkdownEditor
            defaultValue={markdownExample}
            onChangeMarkdown={setMarkdown}
          />
          <ThemedText
            size="small"
            color={colors.colorBaseContent}
            style={{ marginTop: 8 }}
          >
            {markdown.length} characters
          </ThemedText>
        </View>
        <View style={{ marginBottom: 16 }}>
          <ThemedText
            size="h3"
            color={colors.colorSecondary}
            style={{ marginBottom: 16 }}
          >
            Text Styles
          </ThemedText>

          <ThemedText size="h1">This is H1 Text_ </ThemedText>
          <ThemedText size="h2">This is H2 Text_ </ThemedText>
          <ThemedText size="h3">This is H3 Text_ </ThemedText>
          <ThemedText size="regular">This is Regular Text_ </ThemedText>
          <ThemedText size="small">This is Small Text_</ThemedText>
        </View>
        <View
          style={{
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          <ThemedText
            size="h3"
            color={colors.colorSecondary}
            style={{ marginBottom: 16 }}
          >
            Button Styles
          </ThemedText>
          <ThemedButton size="xl">Regular X-Large</ThemedButton>
          <ThemedButton size="lg">Regular Large</ThemedButton>
          <ThemedButton size="md">Regular Medium</ThemedButton>
          <ThemedButton size="md" pending>
            Regular Medium
          </ThemedButton>
          <ThemedButton size="md" variant="outline">
            Outline Medium
          </ThemedButton>
          <ThemedButton size="md" variant="transparent">
            Transparent Medium
          </ThemedButton>
          <ThemedButton size="sm">Regular Small</ThemedButton>
        </View>
        <View style={{ height: 16 }} />
        <View style={{ gap: 16, alignItems: "flex-start" }}>
          <ThemedText
            size="h3"
            color={colors.colorSecondary}
            style={{ marginBottom: 16 }}
          >
            Icon Button Styles
          </ThemedText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedIconButton icon="add" accessibilityLabel="Add" />
            <ThemedIconButton
              icon="add"
              accessibilityLabel="Add"
              shape="rounded"
            />
            <ThemedIconButton
              icon="add"
              accessibilityLabel="Add"
              variant="outline"
            />
            <ThemedIconButton
              icon="add"
              accessibilityLabel="Add"
              variant="transparent"
              shape="rounded"
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedIconButton
              icon="heart"
              accessibilityLabel="Favorite"
              size="sm"
            />
            <ThemedIconButton
              icon="heart"
              accessibilityLabel="Favorite"
              size="md"
            />
            <ThemedIconButton
              icon="heart"
              accessibilityLabel="Favorite"
              size="lg"
            />
            <ThemedIconButton
              icon="heart"
              accessibilityLabel="Favorite"
              size="xl"
              shape="rounded"
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedIconButton
              icon="trash"
              accessibilityLabel="Delete"
              disabled
            />
            <ThemedIconButton
              icon="trash"
              accessibilityLabel="Delete"
              shape="rounded"
              disabled
            />
          </View>
        </View>
        <View style={{ height: 16 }} />
        <View style={{ gap: 16, alignItems: "flex-start" }}>
          <ThemedText
            size="h3"
            color={colors.colorSecondary}
            style={{ marginBottom: 16 }}
          >
            Toggle Styles
          </ThemedText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedToggle value={toggleValue} onValueChange={setToggleValue} />
            <ThemedText size="small" color={colors.colorBaseContent}>
              {toggleValue ? "On" : "Off"}
            </ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedToggle
              size="sm"
              value={toggleValue}
              onValueChange={setToggleValue}
            />
            <ThemedText size="small" color={colors.colorBaseContent}>
              Small
            </ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedToggle
              size="lg"
              value={largeToggleValue}
              onValueChange={setLargeToggleValue}
            />
            <ThemedText size="small" color={colors.colorBaseContent}>
              Large
            </ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedToggle value disabled />
            <ThemedText size="small" color={colors.colorBaseContent}>
              Disabled
            </ThemedText>
          </View>
        </View>
        <View style={{ height: 16 }} />
        <View style={{ gap: 16, alignItems: "flex-start" }}>
          <ThemedText
            size="h3"
            color={colors.colorSecondary}
            style={{ marginBottom: 16 }}
          >
            Checkbox Styles
          </ThemedText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedCheckbox
              checked={checkboxChecked}
              onCheckedChange={setCheckboxChecked}
            />
            <ThemedText size="small" color={colors.colorBaseContent}>
              {checkboxChecked ? "Checked" : "Unchecked"}
            </ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedCheckbox
              size="sm"
              checked={checkboxChecked}
              onCheckedChange={setCheckboxChecked}
            />
            <ThemedText size="small" color={colors.colorBaseContent}>
              Small
            </ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedCheckbox
              size="lg"
              checked={largeCheckboxChecked}
              onCheckedChange={setLargeCheckboxChecked}
            />
            <ThemedText size="small" color={colors.colorBaseContent}>
              Large
            </ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedCheckbox checked disabled />
            <ThemedText size="small" color={colors.colorBaseContent}>
              Disabled
            </ThemedText>
          </View>
        </View>
        <View style={{ height: 16 }} />
        <View style={{ gap: 16, alignItems: "flex-start" }}>
          <ThemedText
            size="h3"
            color={colors.colorSecondary}
            style={{ marginBottom: 16 }}
          >
            Radio Button Styles
          </ThemedText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedRadioButton
              checked={radioValue === "one"}
              onCheckedChange={() => setRadioValue("one")}
            />
            <ThemedText size="small" color={colors.colorBaseContent}>
              Option One
            </ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedRadioButton
              size="sm"
              checked={radioValue === "two"}
              onCheckedChange={() => setRadioValue("two")}
            />
            <ThemedText size="small" color={colors.colorBaseContent}>
              Small
            </ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedRadioButton
              size="lg"
              checked={radioValue === "three"}
              onCheckedChange={() => setRadioValue("three")}
            />
            <ThemedText size="small" color={colors.colorBaseContent}>
              Large
            </ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ThemedRadioButton checked disabled />
            <ThemedText size="small" color={colors.colorBaseContent}>
              Disabled
            </ThemedText>
          </View>
        </View>
        <View style={{ height: 16 }} />
        <View style={{ gap: 16, alignItems: "stretch" }}>
          <ThemedText
            size="h3"
            color={colors.colorSecondary}
            style={{ marginBottom: 16 }}
          >
            Input Styles
          </ThemedText>
          <ThemedTextInput placeholder="email" />
          <ThemedTextInput placeholder="username" />
          <View style={{ height: 100 }} />
        </View>
      </ThemedScrollView>
    </View>
  );
}
