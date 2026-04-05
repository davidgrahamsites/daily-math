# Changelog

All notable changes to the **DailyMath** project will be documented in this file.

## [Versioning System] - 2025-12-31
- Added built-in versioning and rollback support via Git.
- New terminal commands:
  - `npm run checkpoint -- "your message"`: Creates a save point of the current code.
  - `npm run history`: Displays the last 10 save points.
  - `npm run rollback`: Reverts the entire codebase to the previous save point.


## [Unreleased] - 2025-12-27

### Added
- **AI Integration**: Connected to OpenAI API (GPT-4o) to generate unique daily calculus and logic problems.
- **Theme Switcher**: Added support for multiple color schemes:
    - `Cosmic` (Default Dark)
    - `Dawn` (Light Mode)
    - `Matrix` (High Contrast Green/Black)
- **Scientific Calculator Extended**:
    - Added `Basic`, `Calculus`, and `Logic` keyboard modes.
    - Added support for symbols like $\int, \lim, \forall, \exists$.
    - Implemented KaTeX rendering for keyboard keys.
- **Dynamic Copyright**: Footer now automatically displays the current year.
- **Settings & Preferences**: Introduced a comprehensive settings modal for API Key input, Difficulty selection (Beginner -> Advanced), and Theme selection.

### Changed
- **UI Overhaul & Accessibility**:
    - Migrated manual CSS to **Tailwind CSS** with a custom configuration.
    - Improved button visibility and touch targets.
    - Moved the Theme quick-toggle button to the main header for faster access.
    - Replaced hardcoded `bg-white/10` and `text-white` across the Keyboard and Hint overlays with dynamic, theme-aware tokens (`bg-bg-secondary`, `text-text-primary`) to fully support the Light Theme without invisible text issues.
- **Modals & Tooltips**:
    - Transitioned `HintOverlay` and `ConceptExplainer` modals into React Portals to fix Z-index and drag event interception issues causing "rubber-banding."
    - Tooltips now anchor below highlighted terms (`rect.bottom`) and use `whitespace-nowrap` to prevent jumping upon KaTeX initialization.
- **Math Rendering**:
    - Fixed "red text" errors by stripping raw LaTeX delimiters from AI responses.
    - Improved font smoothing and layout sizes.
    - Expanded `InlineMathText` usage into Hint definitions and Tooltips.

### Fixed
- **Critical Math Rendering**:
    - Implemented auto-correction for "sqrt" -> "$\sqrt{}$" symbol.
    - Regex normalizer implemented for double backslashes in AI outputs (e.g., `\\equiv` -> `\equiv`) to fix missing newlines parsing errors in modulo math.
    - Added regex sanitizers to strip raw delimiters from AI response.
    - Forced AI to use strict LaTeX syntax via system prompt.
- **UI & Accessibility**:
    - Fixed "Black on White" transparent text bugs in Light mode.
    - Prevented backdrop intercept errors causing dragging constraints to fail.
    - Fixed "Start Solving" button visibility by enforcing high-contrast styling.
    - Fixed Date Hallucinations by forcing client-side date generation.
- **Build**: Resolved PostCSS/Tailwind plugin compatibility issues.

## [0.1.0] - 2025-12-27
### Initial Release
- Basic React + Vite setup.
- Core "Daily Problem" view with Mock Data.
- Interactive Solver Interface.
- Basic Math Validation Engine (`mathjs`).
