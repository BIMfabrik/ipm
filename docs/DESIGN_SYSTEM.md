# IPM Design System

This document is the visual and interaction standard for the IPM frontend.

IPM should look like a precise professional information-management tool and portfolio project. It must not look like a generic AI-generated landing page or dashboard.

## 1. Product direction

### Character

- Professional, restrained and technical
- Content-first and information-dense
- Clear enough for owners, planners, BIM specialists and FM stakeholders
- Visually distinctive through structure, typography and the graph itself
- Suitable for both portfolio presentation and practical exploration

### References

Use these only as directional references, not as visual copies:

- Swiss editorial design for grid, hierarchy and clarity
- Linear for compact application controls and interaction precision
- Apple for restraint and typography
- Technical knowledge tools for structured data presentation

### Core rule

The graph may provide the visual impact. The surrounding interface should stay quiet and structured.

## 2. Design principles

1. **Content before decoration**  
   Every visible element must improve comprehension, navigation or interaction.

2. **Hierarchy through type and spacing**  
   Do not rely on gradients, large cards or effects to create hierarchy.

3. **Borders before shadows**  
   Use subtle borders and surface contrast to separate regions.

4. **Compact, not cramped**  
   The interface should support professional use without excessive whitespace.

5. **One coherent system**  
   Spacing, radii, control heights, typography and colours must be consistent across the site.

6. **Mobile is designed, not stacked**  
   Controls, graph navigation and node details must remain usable on small screens.

7. **The graph is a tool**  
   It must remain readable, controllable and connected to structured information.

## 3. Avoid

Do not introduce:

- Gradient page backgrounds
- Gradient text
- Glassmorphism
- Decorative blobs or glow effects
- Animated decorative backgrounds
- Large generic hero sections
- Oversized headings
- Excessive rounded cards
- Fully rounded buttons and inputs
- Heavy drop shadows
- Decorative metrics without practical value
- Generic “welcome” dashboard content
- Random icons
- Unnecessary animation
- Empty space used only to make the page look premium
- Multiple accent colours competing for attention

## 4. Layout

### Page width

```css
--layout-max: 1440px;
--layout-gutter-desktop: 32px;
--layout-gutter-mobile: 14px;
```

Primary content should use the available width efficiently. Avoid narrow centred marketing-page columns for data-heavy sections.

### Grid

Use a consistent layout grid:

- Desktop: 12 columns
- Tablet: 8 columns
- Mobile: 4 columns

Prefer explicit alignment between section headings, controls, panels and tables.

### Section spacing

```css
--section-space-desktop: 72px;
--section-space-tablet: 56px;
--section-space-mobile: 40px;
```

Do not create large empty gaps between related content.

### Application composition

For graph and data views, prefer:

- Toolbar
- Main graph or table region
- Contextual details panel
- Supporting metadata or legend

Long-term target for the main workspace:

- Upper region: approximately two-thirds graph / visual exploration
- Lower region: approximately one-third structured source tables
- Initial table groups: use cases, products, inputs/outputs, processes and actors

## 5. Spacing system

Use an 8px base with limited intermediate values.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
```

Rules:

- Controls normally use 8–12px internal vertical spacing
- Panels normally use 16–24px internal spacing
- Related labels and values use 4–8px spacing
- Major content groups use 24–32px spacing

## 6. Typography

Use the system font stack unless a locally hosted project font is introduced deliberately.

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system,
  BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Scale

```css
--font-xs: 12px;
--font-sm: 13px;
--font-body: 15px;
--font-lg: 18px;
--font-section: clamp(24px, 3vw, 38px);
--font-page: clamp(34px, 5vw, 58px);
```

### Rules

- Body text: 14–16px
- Tables and compact metadata: 12–14px
- Section headings: 24–38px
- Main page heading: normally no larger than 58px
- Use only necessary font weights: 400, 500, 600 and occasionally 700
- Avoid excessive uppercase text
- Keep line lengths readable
- Use strong headings sparingly

## 7. Colour and theme system

Light and dark are equal product themes. Use the shared semantic tokens in
`ui-system.css`; route-specific styles must not introduce raw theme colours.
Applications expose System, Light and Dark choices, persist the selection and
resolve System from the operating-system preference before first paint.

```css
:root {
  --background: /* page */;
  --foreground: /* primary text */;
  --card: /* grouped surface */;
  --card-foreground: /* text on grouped surface */;
  --primary: /* functional accent */;
  --primary-foreground: /* text on accent */;
  --secondary: /* secondary control surface */;
  --muted: /* muted surface */;
  --muted-foreground: /* supporting text */;
  --accent: /* selected or hover surface */;
  --border: /* standard separator */;
  --input: /* input border */;
  --ring: /* focus indicator */;
  --surface: /* application surface */;
  --surface-subtle: /* low-emphasis grouping */;
  --surface-elevated: /* overlays only */;
  --success: /* positive status */;
  --warning: /* warning status */;
  --info: /* informational status */;
}
```

### Rules

- Use one primary interface accent
- Use semantic colours only for meaning
- Never use a theme-specific colour in a route or component
- Graph node categories may use additional colours, but they should not spread into general UI decoration
- Maintain sufficient contrast for body text and controls
- Avoid pure black as the only background
- Avoid white borders with high opacity

## 8. Geometry

```css
--radius-control: 4px;
--radius-panel: 6px;
--radius-large: 8px;
```

Rules:

- Buttons, selects and inputs: 4px
- Panels and cards: 6px
- Large graph shell: maximum 8px
- Tags and statuses may use a larger radius when semantically appropriate
- Do not use pill shapes for ordinary controls
- Do not use large 20–32px radii

## 9. Borders and elevation

Use borders as the default separation method.

```css
--border-default: 1px solid var(--line);
--shadow-panel: 0 8px 24px rgba(0, 0, 0, 0.18);
```

Rules:

- Most panels should have no shadow
- Use a light shadow only for overlays, menus and node-detail panels
- Avoid glowing shadows
- Avoid stacked shadows

## 10. Controls

### Standard height

```css
--control-height-sm: 32px;
--control-height-md: 38px;
--control-height-touch: 44px;
```

### Buttons

- Primary button: solid accent background, dark readable text
- Secondary button: neutral surface with border
- Tertiary button: transparent with hover surface
- Destructive button: semantic danger treatment only when required
- Use sentence case
- Avoid large promotional CTA styling

### Inputs and selects

- Clear border and visible focus state
- Compact default height
- Placeholder text must not replace a visible label where a label is needed
- Search inputs should not dominate the toolbar

### Focus

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

Never remove visible keyboard focus.

## 11. Navigation

- Sticky navigation is acceptable when compact
- Keep the project name and primary sections visible
- Language switching must remain easy to find
- Avoid oversized navigation bars
- Current page or mode must be visually identifiable
- On mobile, reduce content rather than compressing all desktop navigation into one row

## 12. Hero and introduction

The introduction should explain IPM quickly without becoming a generic marketing hero.

Rules:

- Maximum two-column layout on desktop
- Heading should remain compact
- Do not use gradient text
- Do not use floating metric cards as decoration
- Metrics are allowed only when they describe real project content
- The path from use case to process, information, validation and FM output is more valuable than decorative statistics

## 13. Sections and panels

Prefer:

- Structured sections
- Split panels
- Tables
- Toolbars
- Lists
- Definition lists
- Inline metadata

Use cards only when the content represents a self-contained object or selectable option.

Every card must have a reason to exist. Do not wrap every paragraph in a separate card.

## 14. Graph design

The 3D graph is the main visual identity of IPM.

### Graph shell

- Use a quiet neutral background
- Keep the border subtle and rectangular
- Avoid large glowing container effects
- The graph should fill the available region
- Controls belong in a compact toolbar above or beside it

### Nodes

- Node colours represent categories, not decoration
- Node size should indicate useful hierarchy or importance
- Labels must remain legible at practical zoom levels
- Avoid excessive halo effects
- Avoid labels that resemble oversized floating pills
- Selected nodes must be clearly distinguished

### Links

- Link colour and thickness should encode relation type or selection state
- Unselected relationships may be muted when a node is selected
- Animated particles should be restrained
- Avoid constant high-speed movement
- Graph motion should settle quickly

### Interaction

Required interactions:

- Fit graph
- Reset filter
- Search nodes
- Select scenario
- Select node
- Clear selection
- Open node details
- Language-aware labels

The graph must not rotate, drift or animate indefinitely without user intent.

### Node details

- Use a compact contextual panel
- Prefer a definition-list or structured table
- Include a clear close action
- On desktop: side overlay or side panel
- On mobile: bottom sheet or full-width panel
- Long values must wrap correctly

## 15. Scenarios and filters

Scenario selectors should look like application controls, not promotional cards.

- Use compact segmented controls, tabs or small bordered buttons
- Show active state clearly
- Keep descriptions short
- Avoid large vertical padding
- On mobile, horizontal scrolling is acceptable if the active item remains clear

## 16. Tables and structured data

Future source tables should follow these standards:

- Compact row height
- Sticky header where useful
- Sortable columns
- Clear selected-row state
- Readable empty state
- Search and filtering in a compact toolbar
- Horizontal scrolling only when necessary
- Labels and headers translated in DE and EN
- GitHub JSON remains the editable source of truth unless explicitly changed

Tables should initially cover:

1. Use cases
2. Products
3. Inputs / outputs
4. Processes
5. Actors

## 17. Tags and status indicators

- Use tags only for categories, technologies or status
- Tags should be compact
- Avoid using tags as general decoration
- Use semantic colour only where it adds meaning
- Do not turn ordinary buttons into pills

## 18. Motion

Use motion only to communicate change or spatial context.

Recommended durations:

```css
--motion-fast: 120ms;
--motion-default: 180ms;
--motion-slow: 300ms;
```

Rules:

- Hover and focus: 120–180ms
- Panel entry: 180–240ms
- Graph camera movement: 400–800ms
- Respect `prefers-reduced-motion`
- No infinite decorative animation

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 19. Responsive behaviour

Target widths:

- 390px mobile
- 768px tablet
- 1280px desktop
- 1600px wide desktop

### Mobile rules

- Minimum touch target: 44px where practical
- No page-level horizontal scrolling
- Graph may use most of the viewport height
- Toolbars may wrap into logical rows
- Search may become full width
- Node details become a bottom panel
- Secondary explanatory content may collapse below the graph
- Preserve access to all important information

### Desktop rules

- Use available width
- Keep graph controls compact
- Avoid large unused margins
- Use side-by-side information only when both columns remain readable

## 20. Bilingual content

IPM supports German and English.

Requirements:

- All user-facing text must have both DE and EN versions
- Do not hard-code untranslated labels in new components
- Layouts must tolerate longer German text
- Avoid fixed widths that clip translated content
- Keep terminology consistent across graph, tables and explanatory pages

## 21. Accessibility

Minimum requirements:

- Semantic HTML
- Keyboard-operable controls
- Visible focus state
- Correct button and link semantics
- Labels for icon-only buttons
- Sufficient colour contrast
- Do not use colour as the only indicator
- Respect reduced-motion preference
- Useful empty, loading and error states

## 22. States

Every interactive section should define:

- Default
- Hover
- Focus
- Active / selected
- Disabled
- Loading
- Empty
- Error

Do not add fake sample statistics to fill empty states.

## 23. Recommended reusable components

As the frontend grows, consolidate repeated UI into:

- `AppShell`
- `SiteHeader`
- `PageHeader`
- `SectionHeader`
- `Toolbar`
- `Button`
- `Select`
- `SearchField`
- `ScenarioTabs`
- `GraphShell`
- `GraphLegend`
- `NodeDetailPanel`
- `DataTable`
- `DefinitionList`
- `StatusTag`
- `EmptyState`
- `ErrorState`

Do not create multiple visual variants without a demonstrated need.

## 24. Implementation rules for Codex

Before modifying the frontend:

1. Read this file.
2. Inspect the existing `index.html`, shared CSS and graph logic.
3. Preserve all existing functionality unless the task explicitly changes it.
4. Reuse existing tokens and patterns.
5. Avoid adding dependencies for simple styling changes.
6. Implement changes incrementally.
7. Validate both DE and EN.
8. Validate desktop and mobile.

Completion requires visual verification.

Codex must:

1. Run the application.
2. Open the affected route in a browser.
3. Inspect at 390px, 768px, 1280px and 1600px widths.
4. Check clipping, overlap, alignment and horizontal scrolling.
5. Check graph interaction and node details.
6. Compare the result against this document.
7. Fix visual defects before marking the task complete.

A successful build alone is not sufficient.

## 25. Review checklist

Before merging a frontend change, verify:

- [ ] The result does not resemble a generic AI dashboard
- [ ] No new gradients, glow effects or decorative animation were introduced
- [ ] Typography follows the defined scale
- [ ] Spacing uses the project system
- [ ] Controls use consistent heights and radii
- [ ] Cards are used only when structurally necessary
- [ ] The graph remains the main visual focus
- [ ] Graph movement settles correctly
- [ ] DE and EN are complete
- [ ] Mobile layout is intentionally designed
- [ ] No page-level horizontal scroll exists
- [ ] Keyboard focus is visible
- [ ] Loading, empty and error states are considered
- [ ] Existing data and functionality are preserved

## 26. Current source-of-truth note

The current site is implemented primarily in `index.html`, with graph data loaded from `data/ipm.json`.

Until the frontend is split into modules:

- Keep design tokens near the top of the main stylesheet
- Avoid page-specific duplicate values
- Preserve the graph data model
- Prefer small, reviewable changes
- Keep GitHub JSON as the editable data source
