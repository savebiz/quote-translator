# SFC Contract Call Issue - Code Snippet

## Problem
Getting "execution reverted" error when calling `delegations(address)` on VinuChain SFC contract.

## Setup

### Contract Details
- **Contract**: SFC (Staking and Feeless Contract)
- **Address**: `0xFC00FACE00000000000000000000000000000000`
- **Chain**: VinuChain Mainnet (Chain ID: 207)
- **Function**: `delegations(address)`

### ABI Used
```typescript
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
];
```

### Chain Configuration
```typescript
import { defineChain } from "thirdweb/chains";
import { getContract } from "thirdweb/contract";

const vinuchainMainnet = defineChain({
	id: 207,
	name: "VinuChain Mainnet",
	nativeCurrency: {
		name: "VinuChain Coin",
		symbol: "VC",
		decimals: 18,
	},
});

const STAKING_CONTRACT_ADDRESS = "0xFC00FACE00000000000000000000000000000000";

const contract = getContract({
	client: client,
	chain: vinuchainMainnet,
	address: STAKING_CONTRACT_ADDRESS,
	abi: SFC_CONTRACT_ABI,
});
```

### Function Call
```typescript
import { useReadContract, useActiveAccount } from "thirdweb/react";

function MyComponent() {
	const account = useActiveAccount();
	const walletAddress = account?.address;

	const { 
		data: stakingData, 
		error: contractError 
	} = useReadContract({
		contract: contract,
		method: "delegations",
		params: [walletAddress as `0x${string}`],
	});

	// Error: "execution reverted"
	console.log("Error:", contractError);
	console.log("Data:", stakingData);
}
```

## Error
```
execution reverted
```

## Questions
1. Is the contract address `0xFC00FACE00000000000000000000000000000000` correct?
2. Is the function signature `delegations(address)` correct?
3. Does this function revert if there's no staking, or should it return 0?
4. Are there any prerequisites before calling this function?
5. Is the ABI format correct for thirdweb SDK v5?

## Full ABI Reference
https://github.com/VinuChain/VinuChain/blob/main/payback/contract/sfc/Contract.abi

