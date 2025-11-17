# GitHub Repository Setup

## Current Status
✅ Git repository initialized
✅ All files committed
✅ Branch set to `main`
✅ Git configured with username: `savebiz`

## Next Steps: Connect to GitHub

### Option 1: Create New Repository on GitHub (Recommended)

1. **Go to GitHub**:
   - Visit: https://github.com/new
   - Sign in as `savebiz`

2. **Create New Repository**:
   - Repository name: `quote-translator` (or your preferred name)
   - Description: "Quota Calculator - VinuChain Feeless Quota Calculator"
   - Visibility: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

3. **Copy the repository URL**:
   - You'll see a page with setup instructions
   - Copy the HTTPS URL (e.g., `https://github.com/savebiz/quote-translator.git`)

4. **Add Remote and Push** (run these commands):
   ```bash
   git remote add origin https://github.com/savebiz/quote-translator.git
   git push -u origin main
   ```

### Option 2: Use Existing Repository

If you already have a repository:

1. **Get the repository URL** from GitHub
2. **Add it as remote**:
   ```bash
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

## Authentication

Since your GitHub profile is already configured, Git will use:
- **Windows Credential Manager** (if configured)
- **Git Credential Manager** (installed with Git)
- You may be prompted to authenticate via browser

If prompted:
- GitHub will open a browser window
- Sign in and authorize
- Return to terminal

## After Pushing

Once code is pushed to GitHub:
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add environment variable: `VITE_TEMPLATE_CLIENT_ID`
4. Deploy!

