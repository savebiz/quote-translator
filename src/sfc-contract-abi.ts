// SFC Contract ABI - Extracted from VinuChain repository
// Source: https://github.com/VinuChain/VinuChain/blob/main/payback/contract/sfc/Contract.abi
// This is a partial ABI containing only the delegations function we need

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

