# GitHub Copilot Instructions

This file provides guidance to GitHub Copilot when working with code in this repository.

## Project Overview

This is an analog film exposure calculator web application designed for manual film cameras. It calculates exposure relationships between Aperture, Shutter Speed, ISO, and Exposure Value (EV) using the standard photography exposure formula.

**Core Technology:**
- Vanilla JavaScript (no frameworks)
- HTML5 with inline Tailwind CSS v4 utility classes
- PostCSS build pipeline for CSS processing
- Single-page application architecture

## Repository Structure

```
analog-exposure-calculator/
├── src/
│   ├── index.html      # Main UI with MathJax formulas and Tailwind classes
│   ├── script.js       # Calculator logic and DOM manipulation
│   ├── schemas.js      # Structured data for SEO
│   ├── styles.css      # Tailwind directives + minimal custom CSS
│   ├── manifest.json   # PWA manifest
│   ├── robots.txt      # SEO robots file
│   └── sitemap.xml     # XML sitemap
├── dist/               # Build output (auto-generated)
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions deployment workflow
└── [config files]      # package.json, tailwind.config.js, postcss.config.js
```

## Build & Development Commands

```bash
# Build for production (CSS + HTML minification + copy assets)
npm run build

# Watch CSS for changes during development
npm run watch:css

# Build CSS only
npm run build:css

# Build HTML with minification only
npm run build:html
```

**Build Pipeline:**
1. PostCSS processes `src/styles.css` with Tailwind CSS v4, imports, nesting, autoprefixer, and minification
2. HTML minification with html-minifier-terser
3. Copy files to `dist/`: index.html, styles.css, script.js, schemas.js, robots.txt, sitemap.xml, manifest.json

## Architecture & Core Logic

### Calculator Implementation

The calculator is built around the photography exposure formula that relates all four variables:

**Master Formula:** `EV = log₂(100 × A² / (ISO × T))`

Where:
- EV = Exposure Value (lighting condition)
- A = Aperture (f-stop number)
- ISO = Film sensitivity
- T = Time (shutter speed in seconds)

**Formula Transformations:**
```javascript
// Calculate Aperture: A = √(ISO × T × 2^EV / 100)
// Calculate Time: T = 100 × A² / (ISO × 2^EV)
// Calculate EV: EV = log₂(100 × A² / (ISO × T))
// Calculate ISO: ISO = 100 × A² / (T × 2^EV)
```

### Key Functions (script.js)

**`calculate()` function (lines 147-313):**
- Validates exactly 3 of 4 values are provided
- Determines which field to calculate
- Applies appropriate formula transformation
- Finds closest standard value from arrays
- Provides visual feedback via CSS classes

**Value Matching Functions:**
- `findClosestShutterSpeed()` - Maps to mechanical camera speeds (1s to 1/1000s)
- `findClosestLightSituation()` - Maps to EV scenarios (EV -2 to EV 15)
- `findClosestFilmSpeed()` - Maps to standard film stocks (ISO 25-3200)

**Input Management:**
- `clearField()`, `clearTimeFields()`, `clearEVFields()`, `clearISOFields()`
- Each parameter has two inputs: display field + dropdown selector

### Important Arrays

```javascript
// script.js:14-27
shutterSpeeds = [1, 1/2, 1/4, 1/8, 1/15, 1/30, 1/50, 1/60, 1/125, 1/250, 1/500, 1/1000]
// Note: 1/50s is flash sync speed (marked in UI)

// Aperture values in HTML <select id="aperture">
// Full stops marked with ●: f/1.0, f/1.4, f/2.0, f/2.8, f/4, f/5.6, f/8, f/11, f/16, f/22
// Half stops marked with ◐: f/1.2, f/1.7, f/2.4, f/3.4, f/4.8, f/6.7, f/9.5, f/13, f/19

// Film speeds in HTML <select id="isoFilm">
// ISO: 25, 50, 100, 200, 400, 800, 1600, 3200
```

## Coding Conventions

### HTML
- Use inline Tailwind CSS v4 utility classes for all styling
- Maintain semantic HTML5 structure
- Include proper ARIA labels and meta tags for accessibility and SEO

### JavaScript
- Vanilla JavaScript (ES6+)
- No dependencies beyond MathJax for formula rendering
- Direct DOM manipulation via `getElementById()` and `querySelector()`
- Functional programming style for calculations

### CSS
- **Primary:** Tailwind CSS v4 utility classes in HTML
- **Custom CSS:** Only in `src/styles.css` for cases Tailwind can't handle
  - Currently: option background colors for select dropdowns
- Build via PostCSS with @tailwindcss/postcss plugin
- Tailwind v4 automatically tree-shakes unused classes

### Visual Feedback Classes
Calculated fields receive these classes:
```css
bg-gray-200 border-gray-700 text-gray-800 font-semibold
```

## Making Changes

### Modifying Calculations
1. Update formulas in `calculate()` function (script.js:147-313)
2. Update corresponding LaTeX formulas in HTML if needed
3. Test with known exposure values

### Adding Options
- **Shutter Speeds:** Update `shutterSpeeds` array (script.js:14-27) AND `<select id="timeShutter">` in HTML
- **Film Stocks:** Update `<select id="isoFilm">` options in HTML
- **Apertures:** Update `<select id="aperture">` options in HTML
- **Keep arrays and dropdowns synchronized**

### Styling Changes
1. Prefer Tailwind utility classes in HTML
2. Only add custom CSS to `src/styles.css` if Tailwind can't handle it
3. Run `npm run build:css` to compile changes
4. Tailwind v4 auto-scans files and only includes used classes

## Dependencies

**Production:**
- MathJax (CDN) - LaTeX formula rendering

**Development:**
- @tailwindcss/postcss - Tailwind CSS v4 PostCSS plugin
- tailwindcss - Tailwind CSS v4 core
- postcss-import - @import support
- postcss-nested - Nested CSS syntax
- autoprefixer - Browser prefixes
- cssnano - CSS minification
- html-minifier-terser - HTML minification

## Deployment

**Automated GitHub Pages:**
- Workflow: `.github/workflows/deploy.yml`
- Triggers on push to `main` branch
- Runs `npm run build` and deploys `dist/` directory
- See `DEPLOYMENT.md` for setup instructions

**Manual Deployment:**
- Any static hosting service (Netlify, Vercel, Firebase, AWS S3)
- Deploy contents of `dist/` folder after running `npm run build`

## Testing

This project currently has no automated tests. Changes should be manually verified by:
1. Building the project: `npm run build`
2. Opening `dist/index.html` in a browser
3. Testing calculator with known exposure values:
   - Example: ISO 400, f/8, 1/125s should give EV 13
   - Example: EV 12, f/5.6, 1/250s should calculate ISO ~200

## Important Notes

- **No test files to run** - Manual testing required
- **No frameworks** - Pure vanilla JavaScript
- **Tailwind v4** - Uses PostCSS plugin, not CDN
- **Build required** - Always run `npm run build` before deployment
- **Minimal changes** - Project is feature-complete, maintain simplicity
- **Formula accuracy** - Photography calculations must be mathematically correct
- **Browser compatibility** - ES6+ required, modern browsers only

## SEO & PWA

Files include comprehensive SEO optimization:
- Meta tags for search and social media in `index.html`
- Structured data in `schemas.js` (WebApplication schema)
- XML sitemap in `sitemap.xml`
- Robots.txt for crawler directives
- PWA manifest for offline functionality

## Common Tasks

**Add a new shutter speed:**
1. Add value to `shutterSpeeds` array in script.js
2. Add corresponding `<option>` to `<select id="timeShutter">` in index.html
3. Maintain chronological order

**Change calculator styling:**
1. Update Tailwind classes in HTML elements
2. Run `npm run build:css` to rebuild

**Update exposure formula display:**
1. Update LaTeX syntax in `<span class="formula">` tags in index.html
2. MathJax will auto-render on page load

**Debug calculation errors:**
1. Open browser console
2. Check `calculate()` function logic
3. Verify all four formula transformations are mathematically equivalent
