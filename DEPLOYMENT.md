# Deployment Guide - GitHub Pages

This guide explains how to deploy the Analog Film Exposure Calculator to GitHub Pages.

## Prerequisites

- GitHub account
- Repository pushed to GitHub
- Node.js installed locally (for local testing)

## GitHub Pages Setup

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under **Build and deployment**:
   - **Source**: Select "GitHub Actions"
   - (Do NOT select "Deploy from a branch")

### Step 2: Push Your Code

The GitHub Action will automatically run when you push to the `main` branch:

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### Step 3: Monitor Deployment

1. Go to the **Actions** tab in your repository
2. Click on the running workflow "Deploy to GitHub Pages"
3. Wait for both "build" and "deploy" jobs to complete (usually 1-2 minutes)
4. Once complete, your site will be live!

### Step 4: Access Your Site

Your site will be available at:
```
https://[username].github.io/[repository-name]/
```

For example:
- If your username is `johndoe` and repository is `exposure-calculator`
- Your site will be at: `https://johndoe.github.io/exposure-calculator/`

## Update URLs in Your Site

After your first deployment, you need to update placeholder URLs to your actual GitHub Pages URL.

### Files to Update:

1. **src/index.html** - Replace all instances of `https://yourdomain.com/` with your GitHub Pages URL

   Find and replace in these locations:
   - Line 17: `<link rel="canonical" href="...">`
   - Line 21: `<meta property="og:url" content="...">`
   - Line 24: `<meta property="og:image" content="...">`
   - Line 32: `<meta name="twitter:url" content="...">`
   - Line 35: `<meta name="twitter:image" content="...">`

2. **src/robots.txt** - Update sitemap URL
   ```
   Sitemap: https://[username].github.io/[repository-name]/sitemap.xml
   ```

3. **src/sitemap.xml** - Update all URLs
   ```xml
   <loc>https://[username].github.io/[repository-name]/</loc>
   <image:loc>https://[username].github.io/[repository-name]/images/og-image.jpg</image:loc>
   ```

4. **src/schemas.js** - Update the URL in WebApplication schema
   ```javascript
   "url": "https://[username].github.io/[repository-name]"
   ```

### Quick Find & Replace

Use this command to find all placeholder URLs:
```bash
grep -r "yourdomain.com" src/
```

Then replace with your actual URL using your editor's find-and-replace feature.

## Rebuild and Redeploy

After updating URLs:

```bash
git add .
git commit -m "Update URLs to GitHub Pages domain"
git push origin main
```

The GitHub Action will automatically rebuild and redeploy.

## Workflow Details

The `.github/workflows/deploy.yml` file contains the deployment configuration:

- **Trigger**: Runs on every push to `main` branch
- **Manual trigger**: Can also be run manually from Actions tab
- **Build process**:
  1. Checkout code
  2. Setup Node.js 20
  3. Install dependencies with `npm ci`
  4. Build site with `npm run build`
  5. Upload `dist/` directory
  6. Deploy to GitHub Pages

## Custom Domain (Optional)

If you want to use a custom domain (e.g., `exposurecalculator.com`):

1. In GitHub Settings > Pages:
   - Enter your custom domain
   - Wait for DNS check to pass

2. Add DNS records at your domain registrar:
   ```
   CNAME record:
   www.yourdomain.com → [username].github.io

   A records for apex domain:
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

3. Update all URLs in the project to your custom domain

4. Commit and push changes

## Local Testing

Before deploying, test locally:

```bash
# Build the site
npm run build

# Serve the dist directory
npx http-server dist

# Open http://localhost:8080 in your browser
```

## Troubleshooting

### Build Fails

If the GitHub Action fails:

1. Check the **Actions** tab for error details
2. Ensure all dependencies are in `package.json`
3. Test build locally: `npm run build`
4. Check Node.js version compatibility

### Site Shows 404

1. Verify GitHub Pages is enabled in Settings
2. Check that "Source" is set to "GitHub Actions"
3. Ensure the workflow completed successfully
4. Wait a few minutes for DNS propagation

### Styles/Scripts Not Loading

If CSS/JS doesn't load, you may need to update asset paths:

1. Check browser console for 404 errors
2. Ensure paths are relative (e.g., `href="styles.css"` not `href="/styles.css"`)
3. Current setup uses relative paths, so this should work automatically

### Images Missing

You need to:

1. Create the required images (see README.md)
2. Place them in `src/images/` directory
3. Update build script to copy images:
   ```json
   "build": "... && cp -r src/images dist/"
   ```

## Environment-Specific URLs

For advanced setups with different environments:

You can use environment variables in your build:

```yaml
# In .github/workflows/deploy.yml
- name: Build site
  env:
    SITE_URL: ${{ github.event.repository.html_url }}
  run: npm run build
```

Then update your build script to use the environment variable.

## Deployment Status Badge

Add this to your README.md to show deployment status:

```markdown
[![Deploy to GitHub Pages](https://github.com/[username]/[repository-name]/actions/workflows/deploy.yml/badge.svg)](https://github.com/[username]/[repository-name]/actions/workflows/deploy.yml)
```

## Security Notes

- The workflow has minimal permissions (read-only for contents)
- Secrets are not needed for public GitHub Pages deployment
- All code is visible in the repository (as expected for static sites)
- Don't commit API keys or sensitive data

## Next Steps After Deployment

1. ✅ Update all placeholder URLs
2. ✅ Create and add images (og-image.jpg, favicons)
3. ✅ Test all functionality on the live site
4. ✅ Submit sitemap to Google Search Console
5. ✅ Test social media sharing (Facebook, Twitter)
6. ✅ Run Lighthouse audit
7. ✅ Monitor Google Analytics (if added)

## Need Help?

- GitHub Pages docs: https://docs.github.com/pages
- GitHub Actions docs: https://docs.github.com/actions
- Check workflow logs in Actions tab
- Test builds locally before pushing
