# Analog Film Exposure Calculator

A free, interactive web-based tool for calculating proper exposure settings for analog film photography using analog cameras.

## Core Concept

This exposure calculator helps photographers determine the correct combination of **aperture**, **shutter speed**, and **ISO** for any given lighting situation. The tool is built around the fundamental exposure triangle equation:

**EV = log₂(f²/t) + log₂(ISO/100)**

Where:
- **EV** (Exposure Value) represents the amount of light in a scene
- **f** is the aperture (f-stop)
- **t** is the shutter speed in seconds
- **ISO** is the film sensitivity

### Key Features

- **Interactive Calculator**: Enter any three values to calculate the fourth
- **Film Speed Presets**: Common film ISO values (50, 100, 200, 400, 800, 1600, 3200)
- **Lighting Situation Guide**: Pre-defined EV values for common lighting conditions
- **Real-time Validation**: Instant feedback on valid exposure combinations
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Capable**: PWA (Progressive Web App) functionality

## How It Works

1. **Choose Your Known Values**: Select any three of the four exposure parameters
2. **Calculate Missing Value**: The calculator automatically computes the unknown parameter
3. **Visual Feedback**: Color-coded fields show which values are set vs. calculated
4. **Validation**: Built-in error checking ensures realistic exposure combinations

## Technical Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Tailwind CSS 4.x with custom configuration
- **Build Tools**: PostCSS, Autoprefixer, CSS Nano
- **Optimization**: HTML minification, CSS optimization
- **SEO**: Complete meta tags, structured data, sitemap
- **PWA**: Service worker, manifest, offline functionality

## Project Structure

```
exposure_calc/
├── src/                    # Source files
│   ├── index.html         # Main HTML file with meta tags and structure
│   ├── script.js          # Core calculator logic and DOM manipulation
│   ├── schemas.js         # Structured data for SEO
│   ├── styles.css         # Tailwind CSS source
│   ├── manifest.json      # PWA manifest
│   ├── robots.txt         # SEO robots file
│   └── sitemap.xml        # XML sitemap
├── dist/                  # Built files (generated)
├── package.json           # Dependencies and build scripts
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── DEPLOYMENT.md          # Deployment guide
└── README.md             # This file
```

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd exposure_calc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development with live reload**
   ```bash
   npm run watch:css
   ```
   This watches for CSS changes and rebuilds automatically.

4. **Build for production**
   ```bash
   npm run build
   ```

### Build Scripts

- `npm run build:css` - Compile and optimize CSS with Tailwind
- `npm run build:html` - Minify HTML files
- `npm run watch:css` - Watch CSS files for changes during development
- `npm run build` - Complete production build (CSS + HTML + assets)

## Deployment

The project is designed for easy deployment to static hosting platforms.

### GitHub Pages (Recommended)

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete GitHub Pages setup with GitHub Actions.

**Quick Setup:**
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select "GitHub Actions" as source
4. The included workflow will automatically build and deploy

### Other Platforms

The built files in `/dist` can be deployed to any static hosting service:

- **Netlify**: Drag and drop `/dist` folder or connect GitHub repo
- **Vercel**: Import GitHub repository with build command `npm run build`
- **Firebase Hosting**: Deploy `/dist` folder with Firebase CLI
- **AWS S3**: Upload `/dist` contents to S3 bucket with static hosting

### Build Output

After running `npm run build`, the `/dist` folder contains:
- Minified HTML, CSS, and JavaScript
- Optimized assets (manifest, robots.txt, sitemap)
- All files ready for production deployment

## Configuration

### Tailwind CSS

Tailwind is configured in [tailwind.config.js](tailwind.config.js) with:
- Custom color palette optimized for photography tools
- Responsive breakpoints
- Custom component classes for calculator elements

### SEO Optimization

The project includes comprehensive SEO setup:
- Meta tags for search engines and social media
- Structured data (JSON-LD) for rich snippets
- XML sitemap for search engine indexing
- Optimized for photography and calculator keywords

### PWA Features

Progressive Web App capabilities include:
- Offline functionality
- Add to home screen on mobile
- App-like experience
- Fast loading with service worker caching

## Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 60+, Safari 12+, Edge 79+
- **Mobile**: iOS Safari 12+, Chrome Mobile 60+
- **Features**: ES6+ JavaScript, CSS Grid, Flexbox, PWA APIs

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test the build: `npm run build`
5. Commit changes: `git commit -m "Add feature"`
6. Push to branch: `git push origin feature-name`
7. Create Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Photography Resources

For more information about exposure and film photography:
- Understanding the exposure triangle
- Analog camera manual and specifications
- Film photography techniques and tips
- Light metering and EV system explanation

## Development Notes

This project was developed with assistance from AI coding tools:
- **GitHub Copilot** - Code completion and suggestions
- **Claude (Anthropic)** - Architecture planning and code generation

The combination of human expertise and AI assistance enabled rapid development of a robust, well-documented exposure calculator.