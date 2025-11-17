# SFC Contract Integration Code Snippet

## Issue
Getting "execution reverted" error when calling the `delegations` function on the VinuChain SFC contract.

## Contract Details
- **Contract Address**: `0xFC00FACE00000000000000000000000000000000`
- **Chain**: VinuChain Mainnet (Chain ID: 207)
- **Function**: `delegations(address)`
- **ABI Source**: https://github.com/VinuChain/VinuChain/blob/main/payback/contract/sfc/Contract.abi

## Code Implementation

### 1. Contract ABI (Partial)
```typescript
// src/sfc-contract-abi.ts
export const SFC_CONTRACT_ABI = [
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "delegations",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
] as const;
```

### 2. Chain Configuration
```typescript
// src/App.tsx
import { defineChain } from "thirdweb/chains";
import { getContract } from "thirdweb/contract";

// Define VinuChain Mainnet
const vinuchainMainnet = defineChain({
	id: 207,
	name: "VinuChain Mainnet",
	nativeCurrency: {
		name: "VinuChain Coin",
		symbol: "VC",
		decimals: 18,
	},
});

// SFC Contract Address
const STAKING_CONTRACT_ADDRESS = "0xFC00FACE00000000000000000000000000000000" as `0x${string}`;

// Initialize contract
const contract = getContract({
	client: client,
	chain: vinuchainMainnet,
	address: STAKING_CONTRACT_ADDRESS,
	abi: SFC_CONTRACT_ABI,
});
```

### 3. Contract Call Implementation
```typescript
// src/App.tsx
import { useReadContract, useActiveAccount } from "thirdweb/react";

function SFCContractInfo() {
	const account = useActiveAccount();
	const walletAddress = account?.address || "0x0000000000000000000000000000000000000000";

	// Call the 'delegations' function
	const { 
		data: stakingData, 
		isLoading: isStakingDataLoading,
		error: contractError
	} = useReadContract({
		contract: contract,
		method: "delegations", // Function name
		params: [walletAddress as `0x${string}`], // Pass user's wallet address
		queryOptions: {
			enabled: !!walletAddress && walletAddress !== "0x0000000000000000000000000000000000000000",
			retry: 0,
		},
	});

	// Error: "execution reverted" occurs when calling this function
	// Even when wallet is connected to VinuChain Mainnet (Chain ID: 207)
}
```

## Error Details
- **Error Message**: "execution reverted"
- **Occurs**: When calling `delegations(address)` with a valid wallet address
- **Network**: VinuChain Mainnet (Chain ID: 207) - confirmed connected
- **Contract Address**: `0xFC00FACE00000000000000000000000000000000`

## Questions for Developer Group
1. Is the contract address correct?
2. Is the function signature `delegations(address)` correct?
3. Does the function revert if there's no staking, or should it return 0?
4. Are there any specific requirements or conditions needed before calling this function?
5. Is the ABI we're using correct for this function?

## Full Contract ABI
The full SFC contract ABI is available at:
https://github.com/VinuChain/VinuChain/blob/main/payback/contract/sfc/Contract.abi

## Testing
- Wallet is connected to VinuChain Mainnet (Chain ID: 207)
- Contract address is verified
- Function call format matches thirdweb v5 SDK requirements
- Error occurs consistently with "execution reverted"

