# Design System Specification: The Ethereal Academic

## 1. Overview & Creative North Star

### Creative North Star: "The Cognitive Sanctuary"
This design system rejects the clinical, rigid structures of traditional data dashboards in favor of a "breathing" interface that mirrors the fluidity of the human mind. We are building a **Cognitive Sanctuary**—an editorial-inspired digital environment that uses light, depth, and organic transitions to transform stress analysis into a moment of mindful reflection.

By utilizing intentional asymmetry and overlapping "Liquid Glass" surfaces, we move away from "template" design. We prioritize high-contrast typography scales (Plus Jakarta Sans for impact, Manrope for utility) to create a hierarchy that feels both authoritative and deeply personal. This is not a spreadsheet; it is a curated visual narrative of a student's well-being.

---

## 2. Colors & Surface Philosophy

The color palette is rooted in deep teals and vibrant purples, balanced by a neutral, airy background.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Structural boundaries must be achieved through:
1.  **Tonal Shifts:** Placing a `surface-container-low` panel on a `surface` background.
2.  **Atmospheric Depth:** Using semi-transparent surfaces with backdrop blurs to let background colors bleed through.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of frosted glass. 
*   **Base:** `surface` (#f7f9fb).
*   **Primary Containers:** `surface-container-low` (#f1f4f6) for major dashboard sections.
*   **Nested Elements:** Use `surface-container-highest` (#dde3e7) for cards that need to "pop" or `surface-container-lowest` (#ffffff) for high-focus input areas.

### The "Glass & Gradient" Rule
To achieve the "Liquid Glass" aesthetic, use semi-transparent white overlays (using `surface` at 60-80% opacity) combined with a `backdrop-filter: blur(20px)`. 
*   **Signature Textures:** Main CTAs and data highlights should utilize gradients transitioning from `primary` (#006b60) to `primary-container` (#5bf4de) or `secondary` (#6e3bd8) to `tertiary` (#a53173) to provide a "soulful" professional polish.

---

## 3. Typography

The typographic system relies on the interplay between the geometric elegance of **Plus Jakarta Sans** and the functional clarity of **Manrope**.

*   **Display & Headlines (Plus Jakarta Sans):** These are your "Editorial Anchors." Use `display-lg` (3.5rem) and `headline-md` (1.75rem) to create clear, unmissable entry points for data sections.
*   **Titles & Body (Manrope):** Use `title-lg` (1.375rem) for card headers to maintain a professional, approachable tone. `body-md` (0.875rem) is the workhorse for all analytical descriptions and data labels.
*   **The Identity Gap:** We achieve a "premium" feel by using a significant scale jump between headlines and body text, creating a rhythmic, asymmetrical layout that feels custom-designed for the content.

---

## 4. Elevation & Depth

We convey importance through **Tonal Layering** rather than traditional drop shadows.

*   **The Layering Principle:** Depth is "stacked." A `surface-container-lowest` card sitting on a `surface-container-low` section creates a natural, soft lift.
*   **Ambient Shadows:** Where a "floating" effect is necessary (e.g., a modal or hover state), shadows must be extra-diffused. Use a blur of `24px` to `48px` at a mere 4% opacity, using the `on-surface` color (#2d3337) to mimic natural light.
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use the `outline-variant` token (#acb3b7) at **15% opacity**. This creates a suggestion of a boundary without breaking the "Liquid Glass" flow.
*   **Backdrop Blur:** All floating panels must use a `backdrop-blur` to integrate the UI with the soft gradients beneath, preventing the "pasted-on" look of standard dashboards.

---

## 5. Components

### Cards & Data Panels
*   **Styling:** Use `rounded-xl` (1.5rem) for all dashboard cards. 
*   **Constraint:** Forbid the use of divider lines. Separate content using `spacing-6` (2rem) or `spacing-8` (2.75rem).
*   **Header:** Card titles should use `title-md` in `on-surface-variant`.

### Buttons
*   **Primary:** A gradient fill from `primary` to `primary-fixed-dim`. Roundedness: `full` (9999px). 
*   **Secondary:** `surface-container-highest` background with `on-primary-fixed` text. No border.

### Chart Visualizations (Signature Component)
*   **Area Charts:** Use "Liquid" fills—gradients from `primary` at 40% opacity to 0% at the baseline. Lines should be `primary` with a 3px stroke width.
*   **Radar/Doughnut Charts:** Use the `secondary`, `tertiary`, and `primary-container` tokens to represent different stress vectors. Ensure "frosted" overlaps where data points intersect.
*   **Calendar Heatmap:** Use a color ramp from `primary-container` (Low) to `error` (High), with `rounded-sm` (0.25rem) nodes and `spacing-1` (0.35rem) gaps.

### Input Fields
*   **Style:** `surface-container-lowest` background. Only use a "Ghost Border" on focus, tinted with `primary`.
*   **Labels:** Use `label-md` in `on-surface-variant`, positioned with `spacing-1.5` (0.5rem) of vertical breathing room.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use extreme whitespace. Use `spacing-12` (4rem) and `spacing-16` (5.5rem) to separate major modules.
*   **Do** overlap elements. Let a glass card partially obscure a background gradient to emphasize the "Liquid" theme.
*   **Do** use `primary-fixed-dim` for subtle interactive states.
*   **Do** ensure all charts have a `backdrop-filter` if they sit over background gradients.

### Don’t
*   **Don’t** use 1px solid borders at 100% opacity. It shatters the "Liquid Glass" illusion.
*   **Don’t** use pure black (#000000) for shadows. Use tinted `on-surface` values.
*   **Don’t** crowd the interface. If a screen feels busy, increase the spacing scale by two increments.
*   **Don’t** use standard "Alert Red." Use the `error` (#ac3434) and `error-container` (#f56965) tokens for a more sophisticated, student-friendly warning.