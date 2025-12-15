# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an analog film exposure calculator web application designed for manual film cameras. It calculates exposure relationships between Aperture, Shutter Speed, ISO, and Exposure Value (EV).

## Build & Development Commands

```bash
# Build CSS and copy files to dist/
npm run build

# Watch CSS for changes and auto-rebuild
npm run watch:css

# Build CSS only
npm run build:css

# Build HTML with minification only
npm run build:html
```

The build process:
1. Processes `src/styles.css` with PostCSS:
   - Tailwind CSS v4 (@tailwindcss/postcss) - Automatically scans HTML/JS for utility classes
   - postcss-import for @import statements
   - postcss-nested for nested CSS syntax
   - autoprefixer for browser compatibility
   - cssnano for minification (removes all comments, whitespace)
2. Minifies `src/index.html` with html-minifier-terser:
   - Collapses whitespace
   - Removes comments
   - Minifies inline JS/CSS
3. Copies files to `dist/`: index.html, script.js, schemas.js, robots.txt, sitemap.xml, manifest.json
4. Output is in `dist/` directory ready for deployment

**File size optimizations:**
- index.html: 20 KB (39% reduction from extracting schemas + minification)
- schemas.js: 5.3 KB (extracted from HTML, separately cacheable)
- styles.css: 16 KB (minified with cssnano)

**Note**: Tailwind v4 only includes CSS for utility classes actually used in the codebase, resulting in minimal bundle size.

## Architecture

### Single-Page Application Structure
- **No frameworks** - vanilla JavaScript, HTML, and Tailwind CSS v4
- **src/index.html** - Complete UI with inline Tailwind classes and MathJax for formulas
- **src/script.js** - All calculator logic and DOM manipulation
- **src/styles.css** - Tailwind directives + minimal custom CSS (select option backgrounds)
- **tailwind.config.js** - Tailwind v4 configuration (optional, auto-scans all files)
- **postcss.config.js** - PostCSS plugin pipeline with @tailwindcss/postcss
- **dist/** - Build output directory

### Core Calculator Logic (script.js)

The calculator implements the complete exposure formula that relates all four variables:

**Master formula**: `EV = log₂(100 × A² / (ISO × T))`

This is the standard photography exposure formula where the constant 100 is a calibration factor based on light meter standards. All four variables (EV, Aperture, ISO, Time) are mathematically related, allowing any one to be calculated from the other three.

#### Key Functions

**Input Management**:
- Each parameter (EV, Aperture, ISO, Time) has two input methods: direct value display and dropdown selectors
- `clearField()`, `clearTimeFields()`, `clearEVFields()`, `clearISOFields()` - Reset specific inputs

**Calculation Flow** (`calculate()` function):
1. Validates that exactly 3 of 4 values are provided
2. Determines which field to calculate
3. Applies the appropriate formula transformation
4. For Aperture/Time/EV: finds closest standard value from dropdowns
5. Highlights calculated field with visual styling
6. Shows error if calculation is invalid

**Value Matching**:
- `findClosestShutterSpeed()` - Maps calculated time to common analog camera mechanical speeds (1s to 1/1000s)
- `findClosestLightSituation()` - Maps calculated EV to lighting scenarios (EV -2 to EV 15)
- `findClosestFilmSpeed()` - Maps calculated ISO to standard film stocks

#### Important Implementation Details

**Shutter Speeds**:
- Array `shutterSpeeds` contains common analog camera mechanical speeds
- 1/50s is flash sync speed (marked in UI)
- Uses logarithmic difference for closest match

**Aperture Values**:
- Full stops (f/1.0, f/1.4, f/2.0, f/2.8, etc.) marked with ●
- Half stops (f/1.2, f/1.7, f/2.4, etc.) marked with ◐
- Calculated apertures must be within 0.05 of a standard value

**ISO Handling**:
- Can now be calculated from EV, Aperture, and Time
- Can also be selected from film speed dropdown
- Common film stocks from ISO 25 to 3200
- Useful for determining required film speed for specific shooting scenarios

**Visual Feedback**:
- Calculated values get `bg-gray-200 border-gray-700 text-gray-800 font-semibold` classes
- Empty values show `—` placeholder
- Error messages display in red alert box

### Formula Transformations

From `EV = log₂(100 × A² / (ISO × T))`:
- **Calculate Aperture**: `A = √(ISO × T × 2^EV / 100)`
- **Calculate Time**: `T = 100 × A² / (ISO × 2^EV)`
- **Calculate EV**: Direct application of master formula
- **Calculate ISO**: `ISO = 100 × A² / (T × 2^EV)`

## Working with the Code

### Modifying Calculations
- All exposure formulas are in the `calculate()` function (script.js:147-313)
- Each calculation path (ev/aperture/iso/time) is in a separate conditional block
- Formula changes require updating both the calculation logic and the HTML formula displays

### Adding Shutter Speeds or Film Stocks
- Shutter speeds: Update `shutterSpeeds` array (script.js:14-27) and `<select id="timeShutter">` options in HTML
- Film stocks: Update `<select id="isoFilm">` options in HTML
- Aperture values: Update `<select id="aperture">` options in HTML

### Styling
- Tailwind CSS v4 is built via PostCSS using @tailwindcss/postcss (not CDN)
- All utility classes are inline in HTML files
- Custom styles in src/styles.css are minimal (only option backgrounds that Tailwind can't handle)
- PostCSS pipeline: import → @tailwindcss/postcss → nested → autoprefixer → cssnano
- Tailwind v4 automatically scans all files and only includes used classes (tree-shaking by default)

### Dependencies
- **MathJax** - Loaded from CDN for rendering LaTeX formulas
- **PostCSS** - Build-time CSS processing with plugins:
  - @tailwindcss/postcss - Tailwind CSS v4 PostCSS plugin
  - tailwindcss - Tailwind CSS v4 core library
  - postcss-import - @import statement support
  - postcss-nested - Nested CSS syntax
  - autoprefixer - Browser vendor prefixes
  - cssnano - CSS minification
- **html-minifier-terser** - HTML minification for production builds

## Deployment

### GitHub Pages (Automated)

The site automatically deploys to GitHub Pages on every push to the `main` branch.

**Workflow**: `.github/workflows/deploy.yml`
- Triggers on push to `main` or manual dispatch
- Builds the site with `npm run build`
- Deploys `dist/` directory to GitHub Pages
- Typical deployment time: 1-2 minutes

**Setup Instructions**: See `DEPLOYMENT.md` for complete setup guide

**Quick Start**:
1. Enable GitHub Pages in repository Settings > Pages
2. Set Source to "GitHub Actions"
3. Push to main branch
4. Site will be live at `https://[username].github.io/[repository-name]/`

### Update URLs After First Deployment

All files currently use placeholder URLs (`https://yourdomain.com/`). After first deployment:

**Option 1: Use the helper script**
```bash
./update-urls.sh your-github-username your-repo-name
```

**Option 2: Manual find-and-replace**
Replace `https://yourdomain.com/` in these files:
- src/index.html (canonical, Open Graph, Twitter Card tags)
- src/robots.txt (sitemap URL)
- src/sitemap.xml (all URLs)
- src/schemas.js (WebApplication schema URL)

Then commit and push to redeploy with correct URLs.

### SEO Requirements After Deployment

1. **Create Images**: See "Image Assets Needed" section
2. **Submit Sitemap**: Add to Google Search Console
3. **Test Structured Data**: Use Google Rich Results Test
4. **Test Social Sharing**: Facebook Sharing Debugger, Twitter Card Validator
5. **Run Lighthouse Audit**: Should score 95-100 for SEO

### Image Assets Needed

Create these images in `src/images/` before deployment:
- **og-image.jpg** (1200x630px) - Social media sharing image
- **favicon.ico** - Multi-size favicon
- **favicon-16x16.png**, **favicon-32x32.png**
- **favicon-192x192.png**, **favicon-512x512.png** - PWA icons
- **apple-touch-icon.png** (180x180px) - iOS home screen
- **screenshot-mobile.jpg** (390x844px) - PWA screenshot
- **screenshot-desktop.jpg** (1920x1080px) - PWA screenshot

Then update build script to copy images:
```json
"build": "... && cp -r src/images dist/ && cp src/favicon.ico dist/"
```
