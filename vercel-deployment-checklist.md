# Vercel Deployment Checklist ✅

## Pre-Deployment Checklist

### ✅ Code Ready
- [x] `vercel.json` configured
- [x] `vite.config.ts` optimized for production
- [x] Environment variables properly handled
- [x] Build command works (`npm run build`)
- [x] All dependencies in `package.json`

### ⚠️ Before Deploying

1. **Environment Variable**:
   - [ ] Set `VITE_TEMPLATE_CLIENT_ID` in Vercel project settings
   - [ ] Value: `46b570c963786a0cb658b41187d653d3`
   - [ ] Apply to all environments (Production, Preview, Development)

2. **Git Repository**:
   - [ ] All code committed
   - [ ] Code pushed to GitHub/GitLab/Bitbucket
   - [ ] `vercel.json` included in repository

3. **Testing**:
   - [ ] Test local build: `npm run build`
   - [ ] Preview build: `npm run preview`
   - [ ] Verify app works locally: `npm run dev`

## Deployment Steps

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new

2. **Import Project**
   - Click "Import Project"
   - Select your Git provider
   - Choose `quote-translator` repository

3. **Configure Project**
   - Framework: Vite (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `dist` (auto-filled)

4. **Add Environment Variable** (CRITICAL)
   - Scroll to "Environment Variables"
   - Add:
     - Key: `VITE_TEMPLATE_CLIENT_ID`
     - Value: `46b570c963786a0cb658b41187d653d3`
   - Select: Production, Preview, Development
   - Click "Save"

5. **Deploy**
   - Click "Deploy"
   - Wait for build (~1-2 minutes)
   - App will be live!

## Post-Deployment

### Verify Deployment
- [ ] App loads without errors
- [ ] Wallet connection works
- [ ] Contract data loads correctly
- [ ] Gas price fetching works
- [ ] Dynamic calculations update

### Test Features
- [ ] Connect wallet button works
- [ ] Wallet address displays correctly
- [ ] Contract `delegations` function call succeeds
- [ ] Gas price displays and updates
- [ ] Quota calculations show correctly
- [ ] Action translations display properly

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify `package.json` dependencies
- Check TypeScript errors
- Verify environment variable is set

### App Doesn't Work
- Check browser console for errors
- Verify environment variable in Vercel settings
- Check network requests in DevTools
- Verify thirdweb client ID is correct

### Gas Price Not Loading
- Check browser console for RPC errors
- Verify VinuChain RPC endpoint is accessible
- Check network connectivity

## Files Included in Deployment

✅ `vercel.json` - Vercel configuration
✅ `vite.config.ts` - Optimized build config
✅ `package.json` - All dependencies
✅ `src/client.ts` - Thirdweb client setup
✅ All source files in `src/`
✅ `.vercelignore` - Deployment exclusions

## Environment Variables

**Required in Vercel:**
- `VITE_TEMPLATE_CLIENT_ID` = `46b570c963786a0cb658b41187d653d3`

**Not Required (handled in code):**
- No other environment variables needed

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Review [Vercel Documentation](https://vercel.com/docs)
4. Review [thirdweb Documentation](https://portal.thirdweb.com)

