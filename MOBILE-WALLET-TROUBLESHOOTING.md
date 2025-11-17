# Mobile Wallet Connection Troubleshooting

## Issue: Biometric Authentication Not Working

### For SafePal and Other Mobile Wallets:

1. **Ensure Wallet App is Installed**
   - Make sure SafePal (or your mobile wallet) is installed on your device
   - The wallet app must be open or accessible

2. **Browser Compatibility**
   - Use a browser that supports wallet connections (Chrome, Safari, Brave)
   - Some browsers block deep linking to wallet apps

3. **Deep Linking**
   - When you click "Connect Wallet", it should open your wallet app
   - If it doesn't, try:
     - Opening the wallet app first, then returning to the browser
     - Using the wallet's built-in browser (DApp browser)
     - Scanning a QR code if available

4. **Biometric Authentication**
   - The biometric prompt should appear in your wallet app, not the browser
   - After clicking "Connect" in the browser, switch to your wallet app
   - The biometric prompt should appear there
   - If it doesn't:
     - Check wallet app settings for biometric authentication
     - Ensure biometrics are enabled in your device settings
     - Try unlocking the wallet manually first

### Alternative Connection Methods:

1. **Use Wallet's DApp Browser**
   - Open SafePal (or your wallet)
   - Navigate to the DApp browser
   - Enter: `quote-translator.vercel.app`
   - Connect from within the wallet app

2. **QR Code Method**
   - Some wallets support QR code scanning
   - Look for a QR code option in the ConnectButton

3. **Manual Network Addition**
   - If VinuChain Mainnet isn't in your wallet:
     - Network Name: VinuChain Mainnet
     - Chain ID: 207
     - Currency Symbol: VC
     - RPC URL: (Check VinuChain documentation)
     - Block Explorer: (Check VinuChain documentation)

## Contract Call Error: "execution reverted"

This error means the contract call failed. Possible causes:

1. **Wrong Network**
   - Ensure you're on VinuChain Mainnet (Chain ID: 207)
   - Check your wallet's current network

2. **Contract Address**
   - Verify the contract address is correct
   - Current: `0xFC00FACE00000000000000000000000000000000`

3. **Function Signature**
   - The function might have a different signature
   - Check the contract ABI for the exact function name

4. **No Staking Data**
   - If you haven't staked, the function might revert
   - The function might return 0 instead of reverting

## Debugging Steps:

1. **Check Browser Console**
   - Open browser console (F12 or long-press → Inspect)
   - Look for error messages
   - Check the "Error details" logs we added

2. **Verify Network**
   - Check wallet is on VinuChain Mainnet
   - Chain ID should be 207

3. **Test Contract Directly**
   - Use VinuExplorer to check the contract
   - Try calling the function directly on the explorer

4. **Check Wallet Connection**
   - Ensure wallet is fully connected
   - Try disconnecting and reconnecting

## Next Steps:

1. Check browser console for detailed error messages
2. Verify you're on VinuChain Mainnet (Chain ID 207)
3. Try connecting from wallet's DApp browser
4. Share console error messages for further debugging

