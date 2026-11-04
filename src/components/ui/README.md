# Themed UI Components

Small, dependency-light building blocks for the app's screens. Every component
except `ThemedText` reads its colors from the theme store, so no component takes
a `theme` prop and every one re-renders automatically when the theme changes.

- Theme store: [`src/hooks/theme.ts`](../../hooks/theme.ts) — Zustand, exposes `mode`, `colors`, `setMode`, `toggleTheme`, `setCustomTheme`
- Size/spacing tokens: [`src/config/ui.ts`](../../config/ui.ts) — `spacing`, `fontSizes`, `buttonFontSizes`

## Importing

Everything is re-exported from the folder's barrel:

```tsx
import {
  ThemedButton,
  ThemedScrollView,
  ThemedText,
  ThemedTextInput,
  ThemedView,
} from "@/components/ui";

// Types
import type {
  ThemedButtonProps,
  ThemedTextInputProps,
  ThemedTextProps,
} from "@/components/ui";
```

Individual files also default-export their component (`@/components/ui/ThemedText`,
etc.), but prefer the barrel.

## Theme tokens used

| Token | Used by | Purpose |
| --- | --- | --- |
| `colorBase100` | `ThemedView`, `ThemedScrollView`, `ThemedButton` | Screen surface; label color on a filled button |
| `colorBaseContent` | `ThemedTextInput` | Placeholder text |
| `colorBase300` | `ThemedTextInput` | Resting (blurred) border |
| `colorSecondary` | `ThemedTextInput` | Focused border |
| `colorPrimary` | `ThemedButton` | Default accent when no `color` prop is given |
| `colorsecondaryContent` | `ThemedButton` | Fill for the `transparent` variant |
| `colorError` | `ThemedTextInput` | Border when `hasError` is set |

Full token list (including ones not yet used here): `ThemeColors` in
[`src/hooks/theme.ts`](../../hooks/theme.ts).

## Naming conventions

- Components are `Themed*` and live in `PascalCaseName.tsx` matching their
  default export. Their public prop types are `Themed*Props`
  (`ThemedButtonProps`, `ThemedTextProps`, `ThemedTextInputProps`).
- Visual modes use `variant`, not `type`, so the prop never looks like a native
  DOM/React attribute.
- Boolean props read as predicates: `hasError`, `rounded`. Prefer `hasError`
  over `error` so the name cannot be mistaken for an error object.
- Size vocabularies differ by component on purpose: buttons use
  `sm | md | lg | xl`, text uses the typography scale
  `small | regular | h3 | h2 | h1`.
- One-off helpers are named `generate*` and return `StyleSheet.create` output.

`src/constants/theme.ts` is a separate, legacy token system (`Colors`, `Fonts`,
`Spacing`) used by older screens. New work in this folder should use
`useTheme()` and `@/config/ui` instead.

---

## ThemedText

A `Text` with a small set of typography presets. It does **not** read the theme;
set `color` explicitly (usually from `useTheme().colors`) when you need a
non-default color.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `"small" \| "regular" \| "h3" \| "h2" \| "h1"` | `regular` | Font size + weight preset |
| `color` | `string` | — | Text color override |
| …rest | `TextProps` | — | Forwarded to React Native `Text` |

| `size` | Font size (`fontSizes`) | Weight |
| --- | --- | --- |
| `small` | 14 | normal |
| `regular` | 18 | normal |
| `h3` | 20 | bold |
| `h2` | 24 | bold |
| `h1` | 32 | bold |

Style precedence is `{ fontSize, fontWeight }` → `style` → `{ color }`, so the
`color` prop always wins over a `color` set inside `style`.

```tsx
<ThemedText size="h2">Journal</ThemedText>
<ThemedText size="small" color={colors.colorBaseContent}>
  Last edited today
</ThemedText>
```

---

## ThemedView

A `View` with the theme surface color as its background.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| …rest | `ViewProps` | — | Forwarded to React Native `View` |

The background is applied first, then your `style`, so anything you pass can
override it (including `backgroundColor`).

```tsx
<ThemedView style={{ flex: 1, padding: spacing.lg }}>
  <ThemedText>Hello</ThemedText>
</ThemedView>
```

---

## ThemedScrollView

Same idea as `ThemedView`, for a `ScrollView`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| …rest | `ScrollViewProps` | — | Forwarded to React Native `ScrollView` |

```tsx
<ThemedScrollView
  style={{ paddingHorizontal: 16 }}
  contentContainerStyle={{ paddingBottom: 32 }}
>
  {/* … */}
</ThemedScrollView>
```

---

## ThemedButton

A `Pressable` with size presets, three visual variants, an optional leading
Ionicon, and a spring scale animation on press.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `string` | — | Label text |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `md` | Padding, radius and font-size preset |
| `variant` | `"regular" \| "outline" \| "transparent"` | `regular` | Visual variant |
| `color` | `string` | `colors.colorPrimary` | Accent used for fill/border/label |
| `icon` | `IoniconsIconName` | — | Leading icon, sized `fontSizes.regular` |
| `pending` | `boolean` | `false` | Shows a centered spinner instead of the icon/label and blocks presses |
| `rounded` | `boolean` | `false` | `borderRadius: 100` |
| `textStyle` | `TextStyle` | — | Extra styles for the label |
| …rest | `PressableProps` | — | Forwarded to `Pressable` (including `style`) |

Sizes:

| `size` | Border radius | Padding (V × H) | Font size |
| --- | --- | --- | --- |
| `sm` | 4 | 5 × 10 | 14 (`buttonFontSizes.small`) |
| `md` | 6 | 10 × 16 | 18 (`buttonFontSizes.medium`) |
| `lg` | 8 | 12 × 24 | 20 (`buttonFontSizes.large`) |
| `xl` | 10 | 14 × 28 | 22 (`buttonFontSizes.xlarge`) |

Variants:

| `variant` | Background | Border | Label |
| --- | --- | --- | --- |
| `regular` | accent `color` | accent `color`, 2 px | `colorBase100` |
| `outline` | transparent | accent `color`, 2 px | accent `color` |
| `transparent` | `colorsecondaryContent` | transparent | accent `color` |

Behavior notes:

- The label is `children`. Only a string is supported (no nested elements).
- On press-in the button springs to `scale: 0.9`, and back to `1` on press-out.
  Your own `onPressIn` / `onPressOut` still run, after the animation is started.
- `style` may be a plain style object or a `Pressable` state callback; both are
  merged after the internal styles.
- `pending` keeps the icon and label mounted at `opacity: 0` and draws an
  `ActivityIndicator` centered on top, so the button does not resize when work
  starts or finishes. Presses are disabled and `accessibilityState.busy` is set
  while pending; the hidden label still provides the accessible name.
- Icon and label are laid out in a row with `spacing.md` (8 px) between them.

```tsx
<ThemedButton size="lg" onPress={save}>Save entry</ThemedButton>

<ThemedButton size="lg" pending>Saving…</ThemedButton>

<ThemedButton variant="outline" icon="add-outline" color={colors.colorAccent}>
  New note
</ThemedButton>

<ThemedButton variant="transparent" size="sm" rounded>
  Cancel
</ThemedButton>
```

---

## ThemedTextInput

A `TextInput` inside an animated border wrapper. The border color eases from the
resting color to the theme's secondary color on focus, and back on blur.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hasError` | `boolean` | `false` | Uses `colorError` as the resting border color |
| …rest | `TextInputProps` | — | Forwarded to React Native `TextInput` |

Structure and metrics:

- Wrapper: `Animated.View`, `borderWidth: 1.5`, `borderRadius: 8`
- Resting border: `colorError` when `hasError`, otherwise `colorBase300`
- Focused border: `colorSecondary`, animated with `withTiming` over 500 ms
- Input: `height: 50`, `paddingHorizontal: 14`, `fontSize: fontSizes.regular` (18)
- Placeholder color: `colorBaseContent`
- `style` applies to the inner `TextInput`; `hasError`, `onFocus` and `onBlur` are
  consumed by the component and not forwarded as native props

```tsx
<ThemedTextInput placeholder="email" keyboardType="email-address" />
<ThemedTextInput placeholder="password" secureTextEntry hasError={isInvalid} />
```

---

## Caveats

- **No ref forwarding.** Components are plain function components, so
  `ref` does not reach the underlying `View` / `TextInput` / `Pressable` /
  `ScrollView`. Add `forwardRef` if you need imperative focus or scrolling.
- **`ThemedButton` layout styles land on the inner `Pressable`.** The animated
  scale lives on an outer `Animated.View`, so `flex`, `width`, or margins passed
  via `style` size the `Pressable`, not the wrapper. Wrap the button in a `View`
  if you need the animated wrapper itself to participate in layout.
- **`ThemedText` has no theme default.** It only provides presets; pass `color`
  from `useTheme().colors` when the text is not the platform default.
- **Theme is in-memory.** `useTheme` starts in `light` and does not persist;
  `mode` resets on reload unless you add storage.
- **`ThemedView` / `ThemedScrollView` set only the background.** Text color,
  status bar, and scroll indicators are left to the calling screen.

## Adding a component

1. Create `PascalCaseName.tsx` in this folder, default-export the component.
2. Export any public prop interface (`export interface XProps`).
3. Read colors with `useTheme()` instead of hardcoding hex values.
4. Re-export component and types from `index.ts`.
5. Document it here, including which theme tokens it uses.
