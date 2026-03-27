# Kivun UI Redesign — Typography Facelift

## Summary

Transform Kivun from a generic "hospital blue" Tailwind app into an editorial, personality-driven tool using B&W + Amber accent, strong typography, and the ⇄ symbol as a signature element.

## Design Decisions

- **Style:** Editorial / Typography-first
- **Palette:** Pure B&W base (`#0a0a0a` / `#fff`) + Amber accent `#D97706`
- **Signature:** `⇄` symbol in amber — embedded in logo, main button, and copy button
- **Fonts:** Playfair Display (headings), IBM Plex Mono (labels/mono), Inter (body)
- **Aesthetic:** Square corners (no border-radius), strong borders, newspaper-like hierarchy

## What Changes

### Nav
- Remove blue rounded icon, replace with `Playfair Display` text "Kivun ⇄"
- Badge: monospace uppercase with solid border (not rounded pill)
- Theme toggle: square button
- Bottom border: 2px solid black

### Hero Section
- Eyebrow: `IBM Plex Mono` uppercase amber text "Smart BiDi Fixer"
- Title: `Playfair Display` 64-80px bold "תיקון כיווניות"
- Description: right border 2px amber, max-width 280px
- Remove colored icon cards from hero

### Editor Area (Input/Output)
- Labels: `IBM Plex Mono` uppercase tracking-wider, e.g. `// INPUT — MIXED TEXT`
- Input: 1.5px solid black border, no border-radius
- Output: same + 4px left amber border (visual distinction)
- View toggle: square monospace buttons (formatted/unicode raw)

### Main Action Button
- Full black, no border-radius
- `IBM Plex Mono` uppercase tracking
- ⇄ arrow in amber as leading icon
- Text: "Fix Hebrew Direction"

### Copy Buttons
- Primary "Copy to Word": black fill, ⇄ amber icon
- Secondary buttons: white fill, black border
- All square, monospace text

### Features Section
- 3-column grid separated by 1px borders (not cards)
- `Playfair Display` headings
- Simple text icons or Unicode symbols instead of Lucide colored circles

### Stats Section
- 2px top black border
- Header: mono uppercase "// SYSTEM STATS — LIVE DATA" + amber "Connected" dot
- 5-column grid: Playfair Display numbers, mono labels
- First stat number in amber for emphasis

### Footer
- Black background bar
- "Kivun ⇄" in white, "Created by Amit Hacoon" in amber mono

### Dark Mode
- Invert: `#0a0a0a` background, `#f5f5f5` text
- Amber stays `#D97706`
- Borders become `#333`

## What Does NOT Change

- Algorithm logic (already fixed separately)
- Component structure (BidiFixer.tsx, GlobalStats.tsx)
- Server/API code
- Functionality: contentEditable, copy modes, stats fetching
- State management and service layer

## Files to Modify

1. `App.tsx` — nav, hero, features, theme logic
2. `components/BidiFixer.tsx` — editor, button, output, copy buttons, stats dashboard
3. `components/GlobalStats.tsx` — stats grid, footer
4. `index.html` — add Google Fonts links
5. `tailwind.config.js` — add font families, extend colors with amber
