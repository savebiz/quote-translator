# Vercel Deployment Guide

## Option 1: Deploy via Vercel Web UI (Recommended)

### Prerequisites
- Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)
- A Vercel account (free at [vercel.com](https://vercel.com))

### Steps:

1. **Push your code to Git** (if not already done):
   - If you don't have a repository yet, create one on GitHub
   - Push all your code including the new `vercel.json` file

2. **Go to Vercel Dashboard**:
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in or create an account

3. **Import your Git repository**:
   - Click "Import Project"
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Select the `quote-translator` repository
   - Click "Import"

4. **Configure Project Settings**:
   - **Framework Preset**: Vercel should auto-detect "Vite"
   - **Root Directory**: Leave as `./` (default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)

5. **Add Environment Variable**:
   - Scroll down to "Environment Variables"
   - Click "Add" and add:
     - **Key**: `VITE_TEMPLATE_CLIENT_ID`
     - **Value**: `46b570c963786a0cb658b41187d653d3`
     - Select all environments (Production, Preview, Development)
   - Click "Save"

6. **Deploy**:
   - Click "Deploy" button
   - Wait for build to complete (usually 1-2 minutes)
   - Your app will be live at a URL like: `quote-translator.vercel.app`

### Post-Deployment:

- Your app will automatically deploy on every push to the main branch
- Preview deployments are created for pull requests
- Check the deployment logs in Vercel dashboard if there are any issues

---

## Option 2: Deploy via Vercel CLI (Alternative)

If you prefer using the command line:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked for environment variables, add `VITE_TEMPLATE_CLIENT_ID` with your client ID

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

---

## Troubleshooting

### Build Fails:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variable is set correctly

### App Doesn't Work:
- Check browser console for errors
- Verify environment variable is accessible in production
- Ensure thirdweb client ID is correct

### Need to Update:
- Just push changes to your Git repository
- Vercel will automatically redeploy

---

## Environment Variables Checklist

Make sure this is set in Vercel:
- ✅ `VITE_TEMPLATE_CLIENT_ID` = `46b570c963786a0cb658b41187d653d3`

---

## Support

If you encounter any issues:
- Check Vercel deployment logs
- Review [Vercel Documentation](https://vercel.com/docs)
- Check [thirdweb Documentation](https://portal.thirdweb.com)

