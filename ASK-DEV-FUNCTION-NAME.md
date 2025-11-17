# Question for Developer Group

## Update from Developer
✅ Contract address `0xFC00FACE00000000000000000000000000000000` is **CORRECT**  
❌ Function `delegations(address)` does **NOT EXIST** in the SFC contract ABI

## What We Need
**What is the correct function name to get a user's staking/delegation amount for quota calculation?**

We need to retrieve the staking data for a wallet address to calculate their feeless quota.

## Current (Incorrect) Implementation
```typescript
// src/App.tsx
const { data: stakingData } = useReadContract({
	contract: contract,
	method: "delegations", // ❌ This function doesn't exist
	params: [walletAddress as `0x${string}`],
});
```

## Questions for Developer
1. **What is the correct function name** to get delegation/staking data for an address?
   - Examples: `getDelegation`, `delegationOf`, `stakeOf`, `getStake`, etc.?
   
2. **What are the function parameters?**
   - Just `address`?
   - `address` + `validatorId`?
   - Other parameters?

3. **What does the function return?**
   - `uint256` (staking amount in wei)?
   - A struct with multiple values?
   - Something else?

4. **Is it a view/pure function** that can be called with `useReadContract`?

5. **Does it revert if there's no staking**, or does it return `0`?

## Full Contract ABI Reference
https://github.com/VinuChain/VinuChain/blob/main/payback/contract/sfc/Contract.abi

## Context
We're building a quota calculator that:
- Takes a wallet address
- Gets their staking amount from SFC contract
- Calculates feeless quota (staking / 1000)
- Shows available feeless transactions (VinuSwap trades, VC transfers, VinuNFT mints)

**Please provide the correct function name and signature!** 🙏
