// Quota Contract ABI - For VinuChain Quota Calculator
// Contract Address: 0x9D6Aa03a8D4AcF7b43c562f349Ee45b3214c3bbF
// Source: https://vinuexplorer.org/address/0x9D6Aa03a8D4AcF7b43c562f349Ee45b3214c3bbF?tab=contract
// 
// Function: getStake(address) returns (uint256)
// This function retrieves the stake/quota amount for a given address

export const QUOTA_CONTRACT_ABI = [
	// getStake function - returns the stake amount for an address
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getStake",
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

