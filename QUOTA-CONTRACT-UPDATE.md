# Quota Contract Update

## Changes Made

✅ **Updated Contract Address**
- **Old**: `0xFC00FACE00000000000000000000000000000000` (SFC Contract)
- **New**: `0x9D6Aa03a8D4AcF7b43c562f349Ee45b3214c3bbF` (Quota Contract)
- **Source**: https://vinuexplorer.org/address/0x9D6Aa03a8D4AcF7b43c562f349Ee45b3214c3bbF?tab=contract

✅ **Created New ABI File**
- Created `src/quota-contract-abi.ts` with placeholder ABI
- Currently using `getQuota` as function name (needs to be confirmed)

✅ **Updated Code References**
- Changed all references from "staking" to "quota"
- Updated variable names: `stakingData` → `quotaData`
- Updated error handling: `isNoStakingError` → `isNoQuotaError`
- Updated UI text to reflect quota instead of staking

## ⚠️ TODO: Function Name Required

**We still need the correct function name from the quota contract!**

The code is currently using `getQuota` as a placeholder. Please check the contract on VinuExplorer and provide:

1. **Function name** (e.g., `getQuota`, `quotaOf`, `getUserQuota`, etc.)
2. **Function parameters** (just `address`, or other parameters?)
3. **Return type** (uint256, struct, etc.)

## How to Find the Function Name

1. Visit: https://vinuexplorer.org/address/0x9D6Aa03a8D4AcF7b43c562f349Ee45b3214c3bbF?tab=contract
2. Look for the "Read Contract" or "Contract" tab
3. Find the function that takes an address and returns quota/staking amount
4. Share the function name and signature

## Files Modified

- `src/App.tsx` - Updated to use quota contract
- `src/quota-contract-abi.ts` - New ABI file (needs actual function)
- `src/sfc-contract-abi.ts` - Old ABI (can be removed once confirmed)

## Next Steps

1. Get the correct function name from the developer or VinuExplorer
2. Update `src/quota-contract-abi.ts` with the actual function
3. Update `src/App.tsx` line 155 to use the correct function name
4. Test the implementation

