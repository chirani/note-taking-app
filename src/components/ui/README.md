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
  ThemedCheckbox,
  ThemedIconButton,
  ThemedRadioButton,
  ThemedScrollView,
  ThemedText,
  ThemedTextInput,
  ThemedToggle,
  ThemedView,
} from "@/components/ui";

// Types
import type {
  ThemedButtonProps,
  ThemedCheckboxProps,
  ThemedIconButtonProps,
  ThemedRadioButtonProps,
  ThemedTextInputProps,
  ThemedTextProps,
  ThemedToggleProps,
} from "@/components/ui";
```

Individual files also default-export their component (`@/components/ui/ThemedText`,
etc.), but prefer the barrel.

## Theme tokens used

| Token                   | Used by                                                                                                                     | Purpose                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `colorBase100`          | `ThemedView`, `ThemedScrollView`, `ThemedButton`, `ThemedIconButton`, `ThemedToggle`, `ThemedCheckbox`, `ThemedRadioButton` | Screen surface; label color on a filled button; filled icon-button icon; toggle thumb; checkmark; radio dot |
| `colorBaseContent`      | `ThemedTextInput`                                                                                                           | Placeholder text                                                                                            |
| `colorBase300`          | `ThemedTextInput`, `ThemedToggle`, `ThemedCheckbox`, `ThemedRadioButton`                                                    | Resting border; toggle track when off; checkbox/radio border when unchecked                                 |
| `colorSecondary`        | `ThemedTextInput`                                                                                                           | Focused border                                                                                              |
| `colorPrimary`          | `ThemedButton`, `ThemedIconButton`, `ThemedToggle`, `ThemedCheckbox`, `ThemedRadioButton`                                   | Default accent when no `color` prop is given                                                                |
| `colorsecondaryContent` | `ThemedButton`, `ThemedIconButton`                                                                                          | Fill for the `transparent` variant                                                                          |
| `colorError`            | `ThemedTextInput`                                                                                                           | Border when `hasError` is set                                                                               |

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
- Size vocabularies differ by component on purpose: buttons, icon buttons, and
  toggles/checkboxes use `sm | md | lg | xl` / `sm | md | lg`, text uses the
  typography scale `small | regular | h3 | h2 | h1`.
- Controls are controlled-only: toggles expect `value` + `onValueChange`, and
  checkboxes and radio buttons expect `checked` + `onCheckedChange`.
- One-off helpers are named `generate*` and return `StyleSheet.create` output.

`src/constants/theme.ts` is a separate, legacy token system (`Colors`, `Fonts`,
`Spacing`) used by older screens. New work in this folder should use
`useTheme()` and `@/config/ui` instead.

---

## ThemedText

A `Text` with a small set of typography presets. It does **not** read the theme;
set `color` explicitly (usually from `useTheme().colors`) when you need a
non-default color.

| Prop    | Type                                           | Default   | Description                      |
| ------- | ---------------------------------------------- | --------- | -------------------------------- |
| `size`  | `"small" \| "regular" \| "h3" \| "h2" \| "h1"` | `regular` | Font size + weight preset        |
| `color` | `string`                                       | —         | Text color override              |
| …rest   | `TextProps`                                    | —         | Forwarded to React Native `Text` |

| `size`    | Font size (`fontSizes`) | Weight |
| --------- | ----------------------- | ------ |
| `small`   | 14                      | normal |
| `regular` | 18                      | normal |
| `h3`      | 20                      | bold   |
| `h2`      | 24                      | bold   |
| `h1`      | 32                      | bold   |

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

| Prop  | Type        | Default | Description                      |
| ----- | ----------- | ------- | -------------------------------- |
| …rest | `ViewProps` | —       | Forwarded to React Native `View` |

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

| Prop  | Type              | Default | Description                            |
| ----- | ----------------- | ------- | -------------------------------------- |
| …rest | `ScrollViewProps` | —       | Forwarded to React Native `ScrollView` |

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

| Prop        | Type                                      | Default               | Description                                                           |
| ----------- | ----------------------------------------- | --------------------- | --------------------------------------------------------------------- |
| `children`  | `string`                                  | —                     | Label text                                                            |
| `size`      | `"sm" \| "md" \| "lg" \| "xl"`            | `md`                  | Padding, radius and font-size preset                                  |
| `variant`   | `"regular" \| "outline" \| "transparent"` | `regular`             | Visual variant                                                        |
| `color`     | `string`                                  | `colors.colorPrimary` | Accent used for fill/border/label                                     |
| `icon`      | `IoniconsIconName`                        | —                     | Leading icon, sized `fontSizes.regular`                               |
| `pending`   | `boolean`                                 | `false`               | Shows a centered spinner instead of the icon/label and blocks presses |
| `rounded`   | `boolean`                                 | `false`               | `borderRadius: 100`                                                   |
| `textStyle` | `TextStyle`                               | —                     | Extra styles for the label                                            |
| …rest       | `PressableProps`                          | —                     | Forwarded to `Pressable` (including `style`)                          |

Sizes:

| `size` | Border radius | Padding (V × H) | Font size                     |
| ------ | ------------- | --------------- | ----------------------------- |
| `sm`   | 4             | 5 × 10          | 14 (`buttonFontSizes.small`)  |
| `md`   | 6             | 10 × 16         | 18 (`buttonFontSizes.medium`) |
| `lg`   | 8             | 12 × 24         | 20 (`buttonFontSizes.large`)  |
| `xl`   | 10            | 14 × 28         | 22 (`buttonFontSizes.xlarge`) |

Variants:

| `variant`     | Background              | Border               | Label          |
| ------------- | ----------------------- | -------------------- | -------------- |
| `regular`     | accent `color`          | accent `color`, 2 px | `colorBase100` |
| `outline`     | transparent             | accent `color`, 2 px | accent `color` |
| `transparent` | `colorsecondaryContent` | transparent          | accent `color` |

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

## ThemedIconButton

An icon-only `Pressable` with the same variants and press animation as
`ThemedButton`. It is always equal width and height, and takes an Ionicon
instead of a label.

| Prop                 | Type                                      | Default               | Description                                                        |
| -------------------- | ----------------------------------------- | --------------------- | ------------------------------------------------------------------ |
| `icon`               | `IoniconsIconName`                        | —                     | Required Ionicon name                                              |
| `shape`              | `"square" \| "rounded"`                   | `square`              | `square` keeps the size's small radius; `rounded` is a full circle |
| `size`               | `"sm" \| "md" \| "lg" \| "xl"`            | `md`                  | Box/icon preset                                                    |
| `variant`            | `"regular" \| "outline" \| "transparent"` | `regular`             | Visual variant                                                     |
| `color`              | `string`                                  | `colors.colorPrimary` | Accent used for fill/border/icon                                   |
| `disabled`           | `boolean`                                 | `false`               | Blocks presses and dims the button to 50% opacity                  |
| `accessibilityLabel` | `string`                                  | —                     | Required; icon-only buttons have no visible text                   |
| …rest                | `PressableProps`                          | —                     | Forwarded to `Pressable` (including `style`)                       |

Sizes:

| `size` | Box | Square radius | Icon |
| ------ | --- | ------------- | ---- |
| `sm`   | 32  | 4             | 16   |
| `md`   | 40  | 6             | 20   |
| `lg`   | 48  | 8             | 24   |
| `xl`   | 56  | 10            | 28   |

Variants:

| `variant`     | Background              | Border               | Icon           |
| ------------- | ----------------------- | -------------------- | -------------- |
| `regular`     | accent `color`          | accent `color`, 2 px | `colorBase100` |
| `outline`     | transparent             | accent `color`, 2 px | accent `color` |
| `transparent` | `colorsecondaryContent` | transparent          | accent `color` |

Behavior notes:

- On press-in the button springs to `scale: 0.9`, and back to `1` on press-out.
  Your own `onPressIn` / `onPressOut` still run, after the animation is started.
- `style` may be a plain style object or a `Pressable` state callback; both are
  merged after the internal styles.
- `accessibilityRole="button"` is set automatically, and `accessibilityLabel` is
  required in the prop type so every icon button has an accessible name.
- Like `ThemedButton`, the animated scale lives on an outer `Animated.View`, so
  layout styles passed via `style` size the inner `Pressable`.

```tsx
<ThemedIconButton icon="add" accessibilityLabel="Add note" />

<ThemedIconButton
  icon="heart"
  accessibilityLabel="Favorite"
  shape="rounded"
  variant="outline"
  color={colors.colorAccent}
/>

<ThemedIconButton
  icon="trash"
  accessibilityLabel="Delete entry"
  size="sm"
  variant="transparent"
  disabled
/>
```

---

## ThemedToggle

A `Pressable` pill switch with a sliding thumb. The track eases between
`colorBase300` when off and the accent color when on; the whole control springs
to `0.96` while pressed.

| Prop            | Type                       | Default               | Description                                             |
| --------------- | -------------------------- | --------------------- | ------------------------------------------------------- |
| `value`         | `boolean`                  | `false`               | Current value (controlled)                              |
| `onValueChange` | `(value: boolean) => void` | —                     | Called with the next value on press                     |
| `size`          | `"sm" \| "md" \| "lg"`     | `md`                  | Track/thumb preset                                      |
| `color`         | `string`                   | `colors.colorPrimary` | Track color when on                                     |
| `disabled`      | `boolean`                  | `false`               | Blocks presses and dims the control to 50% opacity      |
| …rest           | `PressableProps`           | —                     | Forwarded to `Pressable` (including `style`, `onPress`) |

Sizes:

| `size` | Track (W × H) | Thumb | Inset |
| ------ | ------------- | ----- | ----- |
| `sm`   | 40 × 24       | 18    | 3     |
| `md`   | 50 × 28       | 22    | 3     |
| `lg`   | 60 × 34       | 28    | 3     |

Behavior notes:

- Controlled-only: pass `value` and update it from `onValueChange`. Without a
  state update the toggle will not move.
- The thumb is `colorBase100` and slides with `withSpring`; the track color uses
  `interpolateColor` over 200 ms.
- `accessibilityRole="switch"` and `accessibilityState.checked` are set from
  `value`; `disabled` is reflected in `accessibilityState` and blocks presses.

```tsx
<ThemedToggle value={notifications} onValueChange={setNotifications} />
<ThemedToggle size="lg" value={true} onValueChange={setEnabled} />
<ThemedToggle value={false} disabled />
```

---

## ThemedCheckbox

A `Pressable` checkbox with an animated checkmark. Unchecked it shows a
`colorBase300` outline; checked it fills with the accent color and springs the
checkmark into view.

| Prop              | Type                         | Default               | Description                                             |
| ----------------- | ---------------------------- | --------------------- | ------------------------------------------------------- |
| `checked`         | `boolean`                    | `false`               | Whether the box is checked (controlled)                 |
| `onCheckedChange` | `(checked: boolean) => void` | —                     | Called with the next state on press                     |
| `size`            | `"sm" \| "md" \| "lg"`       | `md`                  | Box preset                                              |
| `color`           | `string`                     | `colors.colorPrimary` | Fill and border color when checked                      |
| `disabled`        | `boolean`                    | `false`               | Blocks presses and dims the control to 50% opacity      |
| …rest             | `PressableProps`             | —                     | Forwarded to `Pressable` (including `style`, `hitSlop`) |

Sizes:

| `size` | Box | Radius | Icon |
| ------ | --- | ------ | ---- |
| `sm`   | 20  | 5      | 14   |
| `md`   | 24  | 6      | 16   |
| `lg`   | 30  | 8      | 20   |

Behavior notes:

- Controlled-only: pass `checked` and update it from `onCheckedChange`. Without a
  state update the box will not change.
- The fill and border animate with `interpolateColor` over 200 ms; the Ionicons
  `checkmark` fades in and scales from `0.5` to `1`.
- `sm` boxes get `hitSlop: 8` by default so the touch target stays usable; pass
  your own `hitSlop` to override it.
- `accessibilityRole="checkbox"` and `accessibilityState.checked` are set from
  `checked`; `disabled` is reflected in `accessibilityState` and blocks presses.

```tsx
<ThemedCheckbox checked={rememberMe} onCheckedChange={setRememberMe} />
<ThemedCheckbox size="lg" checked={selected} onCheckedChange={setSelected} />
<ThemedCheckbox checked={true} disabled />
```

---

## ThemedRadioButton

A `Pressable` radio button with an animated dot. Unchecked it shows a
`colorBase300` outline; checked it fills with the accent color and springs the
dot into view. It is control-only — place a `ThemedText` next to it for a label.

| Prop              | Type                         | Default               | Description                                             |
| ----------------- | ---------------------------- | --------------------- | ------------------------------------------------------- |
| `checked`         | `boolean`                    | `false`               | Whether the radio button is checked (controlled)        |
| `onCheckedChange` | `(checked: boolean) => void` | —                     | Called with the next state on press                     |
| `size`            | `"sm" \| "md" \| "lg"`       | `md`                  | Circle preset                                           |
| `color`           | `string`                     | `colors.colorPrimary` | Ring and fill color when checked                        |
| `disabled`        | `boolean`                    | `false`               | Blocks presses and dims the control to 50% opacity      |
| …rest             | `PressableProps`             | —                     | Forwarded to `Pressable` (including `style`, `hitSlop`) |

Sizes:

| `size` | Circle | Dot | Border |
| ------ | ------ | --- | ------ |
| `sm`   | 20     | 8   | 2      |
| `md`   | 24     | 10  | 2      |
| `lg`   | 30     | 12  | 2      |

Behavior notes:

- Controlled-only: pass `checked` and update it from `onCheckedChange`. Without a
  state update the circle will not change.
- The fill and border animate with `interpolateColor` over 200 ms; the dot fades
  in and scales from `0.5` to `1`.
- In a group, keep a single selected value and check each option against it:
  `onCheckedChange={() => setValue(option)}`.
- `sm` circles get `hitSlop: 8` by default so the touch target stays usable; pass
  your own `hitSlop` to override it.
- `accessibilityRole="radio"` and `accessibilityState.checked` are set from
  `checked`; `disabled` is reflected in `accessibilityState` and blocks presses.

```tsx
<ThemedRadioButton checked={plan === "free"} onCheckedChange={() => setPlan("free")} />
<ThemedRadioButton size="lg" checked={selected} onCheckedChange={setSelected} />
<ThemedRadioButton checked={true} disabled />
```

---

## ThemedTextInput

A `TextInput` inside an animated border wrapper. The border color eases from the
resting color to the theme's secondary color on focus, and back on blur.

| Prop       | Type             | Default | Description                                   |
| ---------- | ---------------- | ------- | --------------------------------------------- |
| `hasError` | `boolean`        | `false` | Uses `colorError` as the resting border color |
| …rest      | `TextInputProps` | —       | Forwarded to React Native `TextInput`         |

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
