import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import { getContract } from "thirdweb/contract";
import { getRpcClient } from "thirdweb";
import { useEffect, useState } from "react";
import thirdwebIcon from "./thirdweb.svg";
import { client } from "./client";
import { QUOTA_CONTRACT_ABI } from "./quota-contract-abi";

// VinuChain Mainnet configuration
const vinuchainMainnet = defineChain({
	id: 207,
	name: "VinuChain Mainnet",
	nativeCurrency: {
		name: "VinuChain Coin",
		symbol: "VC",
		decimals: 18,
	},
});

// Quota Contract Address (SFC Contract for staking data)
const QUOTA_CONTRACT_ADDRESS = "0x9D6Aa03a8D4AcF7b43c562f349Ee45b3214c3bbF" as `0x${string}`;

const contract = getContract({
	client: client,
	chain: vinuchainMainnet,
	address: QUOTA_CONTRACT_ADDRESS,
	abi: QUOTA_CONTRACT_ABI,
});

// VinuChain Quota System Constants
const M = 1000000; // Maximum quota
const RHO = 3.13478991e-22; // ρ constant
const QUOTA_REFRESH_BLOCKS = 75; // Rolling window of 75 blocks

// Calculate network load parameter Li(gi)
// This is a simplified approximation - actual calculation requires blockchain state
function calculateNetworkLoadParameter(avgQuotaUsed: number): number {
	// Based on the whitepaper table, we can approximate Li(gi)
	// For low congestion (0-50 UT): Li ≈ 1
	// For medium congestion (51-100 UT): Li ≈ 0.8-0.95
	// For high congestion (100+ UT): Li decreases further
	
	if (avgQuotaUsed <= 50) return 1.0;
	if (avgQuotaUsed <= 100) return 0.9;
	if (avgQuotaUsed <= 150) return 0.8;
	if (avgQuotaUsed <= 200) return 0.7;
	if (avgQuotaUsed <= 250) return 0.6;
	if (avgQuotaUsed <= 300) return 0.5;
	if (avgQuotaUsed <= 400) return 0.4;
	if (avgQuotaUsed <= 500) return 0.3;
	return 0.2; // Very high congestion
}

// Calculate quota based on staked amount and network conditions
// Formula: Qi(gi, ξi) = M × (1 - 2 / (1 + e^(Li(gi) × ξi × ρ)))
function calculateQuotaFromStake(
	stakedAmountWei: bigint,
	networkLoad: number = 50 // Default to low congestion
): number {
	// Convert staked amount from wei to VC
	const stakedVC = Number(stakedAmountWei) / 1e18;
	
	if (stakedVC === 0) return 0;
	
	// Calculate network load parameter
	const Li = calculateNetworkLoadParameter(networkLoad);
	
	// Calculate quota using the exponential formula
	const exponent = Li * stakedVC * RHO;
	const quotaPerBlock = M * (1 - 2 / (1 + Math.exp(exponent)));
	
	// Total quota over 75 blocks (UTPE)
	const totalQuota = quotaPerBlock * QUOTA_REFRESH_BLOCKS;
	
	return totalQuota;
}

// Calculate UTPS (Unit Transactions Per Second) from quota
function calculateUTPS(quota: number): number {
	return quota / (21000 * QUOTA_REFRESH_BLOCKS);
}

// Calculate how many transactions of each type are available
function calculateAvailableTransactions(quota: number) {
	// Transaction costs in quota units (from whitepaper Section 5.6)
	const SIMPLE_TRANSFER = 21000;
	const SMART_CONTRACT_CREATE = 41825;
	const STAKE_QUOTA = 104166;
	const SWAP_ESTIMATE = 150000; // Approximate for DEX swap
	const NFT_MINT_ESTIMATE = 150000; // Approximate for NFT mint
	
	return {
		simpleTransfers: Math.floor(quota / SIMPLE_TRANSFER),
		contractCreations: Math.floor(quota / SMART_CONTRACT_CREATE),
		stakeOperations: Math.floor(quota / STAKE_QUOTA),
		swaps: Math.floor(quota / SWAP_ESTIMATE),
		nftMints: Math.floor(quota / NFT_MINT_ESTIMATE),
	};
}

export function App() {
	try {
		return (
			<main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
				<div className="py-20">
					<Header />

					<div className="flex justify-center mb-20">
						<ConnectButton
							client={client}
							chains={[vinuchainMainnet]}
							appMetadata={{
								name: "Quota Calculator",
								url: typeof window !== "undefined" ? window.location.origin : "https://quota-calculator.app",
								description: "Calculate your feeless quota based on VinuChain staking",
							}}
							connectModal={{
								size: "wide",
								title: "Connect Wallet",
								titleIcon: undefined,
							}}
							connectButton={{
								label: "Connect Wallet",
							}}
							recommendedWallets={[]}
						/>
					</div>

					<QuotaCalculator />

					<ThirdwebResources />
				</div>
			</main>
		);
	} catch (error) {
		console.error("App error:", error);
		return (
			<main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Error Loading App</h1>
					<p className="text-red-400">Check the browser console for details</p>
					<p className="text-sm mt-2">Error: {String(error)}</p>
				</div>
			</main>
		);
	}
}

function Header() {
	return (
		<header className="flex flex-col items-center mb-20 md:mb-20">
			<img
				src={thirdwebIcon}
				alt=""
				className="size-[150px] md:size-[150px]"
				style={{
					filter: "drop-shadow(0px 0px 24px #a726a9a8)",
				}}
			/>

			<h1 className="text-2xl md:text-6xl font-bold tracking-tighter mb-6 text-zinc-100">
				Quota Calculator
				<span className="text-zinc-300 inline-block mx-1"> ⚡ </span>
				<span className="inline-block -skew-x-6 text-violet-500"> VinuChain </span>
			</h1>

			<p className="text-zinc-300 text-base">
				Calculate your feeless quota based on your VinuChain staking (Dynamic Formula)
			</p>
		</header>
	);
}

function QuotaCalculator() {
	const account = useActiveAccount();
	const walletAddress = account?.address || "0x0000000000000000000000000000000000000000";
	
	// State for network conditions and gas price
	const [networkLoad, setNetworkLoad] = useState<number>(50); // Default to low congestion
	const [gasPrice, setGasPrice] = useState<bigint | null>(null);
	const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
	const [blockNumber, setBlockNumber] = useState<number | null>(null);

	// FIXED: Get staked amount using getStake with BOTH address and validator ID
	// Validator ID 0 is typically used for the Payback contract
	const { 
		data: stakedAmount, 
		isLoading: isStakeLoading,
		error: contractError
	} = useReadContract({
		contract: contract,
		method: "getStake",
		params: [walletAddress, 0n] as const,
		queryOptions: {
		enabled: !!walletAddress && walletAddress !== "0x0000000000000000000000000000000000000000",
		retry: 0,
		},
	});

	const isNoStakeError = Boolean(contractError) && 
		(String(contractError).includes("execution reverted") || 
		 String(contractError).includes("revert"));

	// Fetch current gas price and block number
	useEffect(() => {
		const fetchNetworkData = async () => {
			if (!account) return;

			try {
				const rpcClient = getRpcClient({ chain: vinuchainMainnet, client });
				
				// Get gas price
				const price = await rpcClient({
					method: "eth_gasPrice",
				} as any);
				const priceBigInt = BigInt(price as string);
				setGasPrice(priceBigInt);
				
				// Get current block number
				const blockNum = await rpcClient({
					method: "eth_blockNumber",
				} as any);
				setBlockNumber(parseInt(blockNum as string, 16));
				
				setLastUpdate(new Date());
			} catch (error) {
				console.error("Error fetching network data:", error);
			}
		};

		fetchNetworkData();
		const interval = setInterval(fetchNetworkData, 30000);
		return () => clearInterval(interval);
	}, [account]);

	// Calculate quota dynamically
	const hasStake = stakedAmount && (typeof stakedAmount === "bigint" ? stakedAmount > 0n : Boolean(stakedAmount));
	const calculatedQuota = hasStake
		? calculateQuotaFromStake(stakedAmount as bigint, networkLoad)
		: 0;
	
	const utps = calculateUTPS(calculatedQuota);
	const availableTransactions = calculateAvailableTransactions(calculatedQuota);
	
	// Helper to check if there's a contract error (not a revert/no stake)
	const hasContractError = Boolean(contractError) && !isNoStakeError;

	// Format functions
	const formatAddress = (address: string) => {
		if (!address || address === "0x0000000000000000000000000000000000000000") return "Not connected";
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

	const formatStakedAmount = (amount: bigint) => {
		const vc = Number(amount) / 1e18;
		return vc.toLocaleString(undefined, { maximumFractionDigits: 2 });
	};

	if (!account) {
		return (
			<div className="mb-20 p-6 border border-zinc-800 rounded-lg bg-zinc-900/50">
				<p className="text-zinc-400 text-center">
					Connect your wallet to calculate your feeless quota.
				</p>
			</div>
		);
	}

	return (
		<div className="mb-20 space-y-6">
			{/* Explanation Banner */}
			<div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
				<p className="text-blue-400 text-sm font-semibold mb-1">💡 How This Works</p>
				<p className="text-blue-300/80 text-xs">
					We fetch your staked amount using <code className="text-blue-200">getStake(address, validatorID)</code> and calculate quota 
					using the VinuChain formula: <strong>Qi = M × (1 - 2 / (1 + e^(Li × ξi × ρ)))</strong>
				</p>
				<p className="text-blue-300/70 text-xs mt-2">
					Quota is calculated over a rolling 75-block window and varies based on network congestion.
				</p>
			</div>

			<div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900/50">
				<h2 className="text-xl font-semibold mb-4 text-zinc-100">
					Your Quota Dashboard
				</h2>
				
				<div className="space-y-6">
					{/* Wallet Address */}
					<div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
						<p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Connected Wallet</p>
						<div className="flex items-center gap-3">
							<p className="text-zinc-200 font-mono text-sm">{formatAddress(walletAddress)}</p>
							<button
								onClick={() => navigator.clipboard.writeText(walletAddress)}
								className="text-zinc-400 hover:text-zinc-200 text-xs px-2 py-1 rounded hover:bg-zinc-700 transition-colors"
							>
								Copy
							</button>
						</div>
					</div>

					{/* Network Status */}
					{(gasPrice !== null || blockNumber !== null) ? (
						<div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
							<div className="flex items-center justify-between mb-2">
								<p className="text-xs text-zinc-500 uppercase tracking-wide">Network Status</p>
								{lastUpdate ? (
									<p className="text-xs text-zinc-600">
										Updated {lastUpdate.toLocaleTimeString()}
									</p>
								) : null}
							</div>
							<div className="grid grid-cols-2 gap-4">
								{gasPrice !== null ? (
									<div>
										<p className="text-zinc-400 text-xs">Gas Price</p>
										<p className="text-zinc-200 font-mono text-sm">
											{(Number(gasPrice) / 1e9).toFixed(2)} Gwei
										</p>
									</div>
								) : null}
								{blockNumber !== null ? (
									<div>
										<p className="text-zinc-400 text-xs">Block Number</p>
										<p className="text-zinc-200 font-mono text-sm">
											{blockNumber.toLocaleString()}
										</p>
									</div>
								) : null}
							</div>
						</div>
					) : null}

					{/* Error Handling */}
					{hasContractError ? (
						<div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
							<p className="text-red-400 text-sm font-semibold mb-1">⚠️ Error Loading Stake Data</p>
							<p className="text-red-300 text-xs">
								{String(contractError)}
							</p>
							<p className="text-red-400/70 text-xs mt-2">
								Make sure you're connected to VinuChain Mainnet (Chain ID: 207)
							</p>
						</div>
					) : null}

					{/* No Stake Message */}
					{(isNoStakeError || (!isStakeLoading && (stakedAmount === undefined || stakedAmount === null || (typeof stakedAmount === "bigint" && stakedAmount === 0n)))) ? (
						<div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
							<p className="text-yellow-400 text-sm font-semibold mb-1">ℹ️ No Stake Found</p>
							<p className="text-yellow-300 text-xs">
								This wallet doesn't have any VC staked on validator ID 0. Stake VC to get quota for feeless transactions.
							</p>
							<p className="text-yellow-400/70 text-xs mt-2">
								To stake: Visit VinuChain's staking platform and delegate to a validator.
							</p>
						</div>
					) : null}

					{/* Staked Amount Display */}
					{!contractError && hasStake ? (
						<>
							<div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
								<p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Your Staked Amount</p>
								{isStakeLoading ? (
									<div className="flex items-center gap-2">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-400"></div>
										<p className="text-zinc-400 text-sm">Loading...</p>
									</div>
								) : (
									<div>
										<p className="text-zinc-200 font-mono text-2xl font-bold">
											{formatStakedAmount(stakedAmount as bigint)} VC
										</p>
										<p className="text-zinc-500 text-xs mt-1">
											Raw: {String(stakedAmount)} wei
										</p>
										<p className="text-zinc-600 text-xs mt-1">
											Validator ID: 0 (Payback Contract)
										</p>
									</div>
								)}
							</div>

							{/* Network Load Slider */}
							<div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
								<p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">
									Network Congestion Estimate
								</p>
								<div className="space-y-3">
									<input
										type="range"
										min="0"
										max="500"
										value={networkLoad}
										onChange={(e) => setNetworkLoad(Number(e.target.value))}
										className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
									/>
									<div className="flex items-center justify-between">
										<p className="text-zinc-400 text-sm">
											Average: <span className="text-violet-400 font-mono">{networkLoad} UT</span>
										</p>
										<p className="text-zinc-500 text-xs">
											{networkLoad <= 50 ? "Low" : networkLoad <= 150 ? "Medium" : networkLoad <= 300 ? "High" : "Very High"}
										</p>
									</div>
								</div>
								<p className="text-zinc-600 text-xs mt-2 italic">
									Adjust to simulate different network conditions. Lower = more quota available.
								</p>
							</div>

							{/* Calculated Quota Display */}
							<div className="p-6 bg-gradient-to-br from-violet-900/20 to-purple-900/20 rounded-lg border-2 border-violet-700/50">
								<p className="text-sm text-zinc-400 mb-3 uppercase tracking-wide">
									Calculated Available Quota (75-block window)
								</p>
								<p className="text-violet-400 font-mono text-4xl font-bold mb-2">
									{calculatedQuota.toLocaleString(undefined, { 
										maximumFractionDigits: 0
									})}
								</p>
								<div className="grid grid-cols-2 gap-4 mt-4">
									<div>
										<p className="text-zinc-500 text-xs">UTPS</p>
										<p className="text-violet-300 font-mono text-lg">
											{utps.toFixed(2)}
										</p>
									</div>
									<div>
										<p className="text-zinc-500 text-xs">UTPE (75 blocks)</p>
										<p className="text-violet-300 font-mono text-lg">
											{(utps * 75).toFixed(0)}
										</p>
									</div>
								</div>
							</div>

							{/* Available Transactions */}
							<div className="p-6 bg-zinc-800/50 rounded-lg border border-zinc-700">
								<div className="flex items-center justify-between mb-4">
									<p className="text-sm text-zinc-400 uppercase tracking-wide">
										Available Feeless Transactions
									</p>
								</div>
								<div className="space-y-3">
									<TransactionCard
										label="Simple VC Transfers"
										count={availableTransactions.simpleTransfers}
										quotaCost="21,000 quota each"
									/>
									<TransactionCard
										label="VinuSwap Trades (estimated)"
										count={availableTransactions.swaps}
										quotaCost="~150,000 quota each"
									/>
									<TransactionCard
										label="VinuNFT Mints (estimated)"
										count={availableTransactions.nftMints}
										quotaCost="~150,000 quota each"
									/>
									<TransactionCard
										label="Smart Contract Deployments"
										count={availableTransactions.contractCreations}
										quotaCost="41,825 quota each"
									/>
									<TransactionCard
										label="Stake/Unstake Operations"
										count={availableTransactions.stakeOperations}
										quotaCost="104,166 quota each"
									/>
								</div>
								<p className="text-zinc-600 text-xs mt-4 italic">
									* Quota refreshes continuously over a rolling 75-block window (~75 seconds)
								</p>
							</div>

							{/* Formula Display */}
							<div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
								<p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Calculation Method</p>
								<div className="bg-zinc-900/50 p-3 rounded border border-zinc-700">
									<p className="text-xs text-zinc-400 font-mono mb-2">
										Qi = M × (1 - 2 / (1 + e^(Li × ξi × ρ)))
									</p>
									<div className="text-xs text-zinc-500 space-y-1">
										<p>M = 1,000,000 (maximum)</p>
										<p>ρ = 3.13478991 × 10⁻²²</p>
										<p>ξi = {formatStakedAmount(stakedAmount as bigint)} VC (your stake)</p>
										<p>Li = {calculateNetworkLoadParameter(networkLoad).toFixed(2)} (network load parameter)</p>
									</div>
								</div>
							</div>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}

function TransactionCard({ label, count, quotaCost }: { label: string; count: number; quotaCost: string }) {
	return (
		<div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-700 hover:border-violet-600/50 transition-colors">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-zinc-200 text-base">{label}</p>
					<p className="text-zinc-500 text-xs mt-1">{quotaCost}</p>
				</div>
				<p className="text-violet-400 font-semibold text-2xl font-mono">
					{count.toLocaleString()}
				</p>
			</div>
		</div>
	);
}

function ThirdwebResources() {
	return (
		<div className="grid gap-4 lg:grid-cols-3 justify-center">
			<ArticleCard
				title="VinuChain Quota System"
				href="https://vinu.gitbook.io/vinuchain/whitepaper/whitepaper/quota-system"
				description="Learn about VinuChain's feeless transaction quota system"
			/>

			<ArticleCard
				title="thirdweb SDK Docs"
				href="https://portal.thirdweb.com/typescript/v5"
				description="thirdweb TypeScript SDK documentation"
			/>

			<ArticleCard
				title="VinuChain Explorer"
				href="https://vinuexplorer.org"
				description="Explore VinuChain transactions and contracts"
			/>
		</div>
	);
}

function ArticleCard(props: {
	title: string;
	href: string;
	description: string;
}) {
	return (
		<a
			href={`${props.href}?utm_source=vite-template`}
			target="_blank"
			className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
			rel="noreferrer"
		>
			<article>
				<h2 className="text-lg font-semibold mb-2">{props.title}</h2>
				<p className="text-sm text-zinc-400">{props.description}</p>
			</article>
		</a>
	);
}
