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

### Changed
- **UI Overhaul**:
    - Migrated manual CSS to **Tailwind CSS** with a custom configuration.
    - Fixed layout issues on mobile devices.
    - Improved button visibility and touch targets.
- **Math Rendering**:
    - Fixed "red text" errors by stripping raw LaTeX delimiters from AI responses.
    - Improved font smoothing and display sizes.

### Fixed
- **Critical Math Rendering**:
    - Implemented auto-correction for "sqrt" -> "$\sqrt{}$" symbol.
    - Added regex sanitizers to strip raw delimiters from AI response.
    - Forced AI to use strict LaTeX syntax via system prompt.
- **UI & Accessibility**:
    - Fixed "Black on Black" header buttons by forcing White/Transparent styling.
    - Fixed "Start Solving" button visibility by enforcing high-contrast Blue background.
    - Fixed Date Hallucinations by forcing client-side date generation.
- **Build**: Resolved PostCSS/Tailwind plugin compatibility issues.

## [0.1.0] - 2025-12-27
### Initial Release
- Basic React + Vite setup.
- Core "Daily Problem" view with Mock Data.
- Interactive Solver Interface.
- Basic Math Validation Engine (`mathjs`).
