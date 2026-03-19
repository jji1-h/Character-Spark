# Character Spark (캐릭터 스파크) Blueprint

## Overview
`Character Spark` is a random character inspiration generator designed for creators. It features a slot-machine-style keyword generator, visual moodboards, and a collection system for saved ideas.

## Features
- **Random Keyword Slot Machine:** Generates combinations across four categories: [Job], [Personality], [Appearance], and [Twist].
- **Genre-Specific Keyword Packs:** Users can switch between 'Standard', 'Fantasy', 'Sci-Fi', and 'Modern Romance' packs.
- **Visual Moodboard Integration:**
  - Dynamic color palette generation based on keyword "vibe".
  - A 3D ambient visual (Three.js) that reacts to the generated character's "energy".
- **My Spark (Storage):** Save and manage favorite character combinations using `localStorage`.
- **Modern Responsive UI:** Built with Web Components and modern CSS (OKLCH, Container Queries, `:has()`).

## Design & Style
- **Aesthetic:** Vibrant, high-contrast "Dark Mode" by default with neon accents.
- **Typography:** Bold headlines, clean sans-serif for content.
- **Interactivity:** Smooth transitions, "glow" effects on buttons, and slot-machine-style spinning animations.

## Implementation Plan
### Phase 1: Core Structure & Data
- [x] Define blueprint.md.
- [x] Define keyword data sets for different genres.
- [x] Set up basic HTML structure with Web Component placeholders.
- [x] Implement `CharacterDataService` to manage keyword selection and packs.

### Phase 2: Web Components & Logic
- [x] `<character-slot-machine>`: The main generator component.
- [x] `<keyword-slot>`: Individual spinning slot for each category.
- [x] `<mood-board>`: Displays the color palette and 3D visual.
- [x] `<my-spark-list>`: Manages and displays saved combinations.
- [x] `<genre-selector>`: Toggles between different keyword packs.

### Phase 3: Visual Polish & 3D
- [x] Implement Three.js ambient visual in the background or as a "soul" icon.
- [ ] Apply modern CSS (OKLCH, gradients, shadows, animations).
- [ ] Ensure mobile responsiveness.

### Phase 4: Persistence & Final Touches
- [x] Implement `localStorage` persistence for "My Spark".
- [ ] Add sound effects (optional) and final animation refinements.

## Verification & Testing
- [ ] Test random generation logic for collisions and variety.
- [ ] Verify "My Spark" data survives page reloads.
- [ ] Test responsiveness on different screen sizes.
- [ ] Audit accessibility (A11Y) labels and keyboard navigation.
