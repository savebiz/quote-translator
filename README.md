# Quote Translator ⚡ VinuChain

Quote Translator is a dynamic quota calculator for VinuChain that translates abstract staking quota numbers into tangible, human-readable actions. It provides real-time estimates of feeless transactions available based on current network gas prices.

## Features 

- **Real-time gas price monitoring**: Automatically fetches current VinuChain network gas prices
- **Dynamic quota calculation**: Translates staking quota into actionable feeless transactions
- **Live updates**: Calculations update every 30 seconds based on current network conditions
- **Multiple transaction types**: Shows available feeless transactions for:
  - VinuSwap trades
  - $VC transfers  
  - VinuNFT mints
- **Wallet integration**: Connect your wallet to view your personalized quota calculator

## Installation

```bash
npm install
```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

```
VITE_TEMPLATE_CLIENT_ID=your_thirdweb_client_id
```

To learn how to create a client ID, refer to the [thirdweb client documentation](https://portal.thirdweb.com/typescript/v5/client).

**For Vercel deployment**: Add `VITE_TEMPLATE_CLIENT_ID` as an environment variable in your Vercel project settings. 

## Run locally

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

Create a production build

```bash
npm run build
```

Preview the production build

```bash
npm run preview
```

## Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project in [Vercel](https://vercel.com)

3. Add environment variable:
   - In Vercel project settings, go to "Environment Variables"
   - Add `VITE_TEMPLATE_CLIENT_ID` with your thirdweb client ID value

4. Deploy! Vercel will automatically:
   - Detect Vite framework
   - Run `npm run build`
   - Deploy to production

The `vercel.json` file is already configured for optimal Vite deployment.

## Additional Resources

- [Documentation](https://portal.thirdweb.com/typescript/v5)
- [Templates](https://thirdweb.com/templates)
- [YouTube](https://www.youtube.com/c/thirdweb)
- [Blog](https://blog.thirdweb.com)

## Need help?

For help or feedback, please [visit our support site](https://thirdweb.com/support)
