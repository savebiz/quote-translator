import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import { getContract } from "thirdweb/contract";
import { getRpcClient } from "thirdweb";
import { useEffect, useState } from "react";
import thirdwebIcon from "./thirdweb.svg";
import { client } from "./client";
import { SFC_CONTRACT_ABI } from "./sfc-contract-abi";

// Define the VinuChain Mainnet (Chain ID 207)
// VinuChain Mainnet configuration
const vinuchainMainnet = defineChain({
	id: 207,
	name: "VinuChain Mainnet",
	nativeCurrency: {
		name: "VinuChain Coin",
		symbol: "VC",
		decimals: 18,
	},
	// thirdweb will automatically use the best available RPC for this chain
});

// SFC Contract Address
const STAKING_CONTRACT_ADDRESS = "0xFC00FACE00000000000000000000000000000000" as `0x${string}`;

// Get the contract object with ABI
// Using the ABI ensures thirdweb can properly call the contract methods
const contract = getContract({
	client: client,
	chain: vinuchainMainnet,
	address: STAKING_CONTRACT_ADDRESS,
	abi: SFC_CONTRACT_ABI,
});

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
								name: "Quote Translator",
								url: typeof window !== "undefined" ? window.location.origin : "https://quote-translator.app",
								description: "Calculate your feeless quota based on your VinuChain staking data",
							}}
							connectModal={{
								size: "wide",
								title: "Connect Wallet",
								titleIcon: undefined,
							}}
							connectButton={{
								label: "Connect Wallet",
							}}
							// Don't show recommended wallets, let user choose their preferred wallet
							recommendedWallets={[]}
						/>
					</div>

					<SFCContractInfo />

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
				Quote Translator
				<span className="text-zinc-300 inline-block mx-1"> ⚡ </span>
				<span className="inline-block -skew-x-6 text-violet-500"> VinuChain </span>
			</h1>

			<p className="text-zinc-300 text-base">
				Calculate your feeless quota based on your VinuChain staking data
			</p>
		</header>
	);
}

function ThirdwebResources() {
	return (
		<div className="grid gap-4 lg:grid-cols-3 justify-center">
			<ArticleCard
				title="thirdweb SDK Docs"
				href="https://portal.thirdweb.com/typescript/v5"
				description="thirdweb TypeScript SDK documentation"
			/>

			<ArticleCard
				title="Components and Hooks"
				href="https://portal.thirdweb.com/typescript/v5/react"
				description="Learn about the thirdweb React components and hooks in thirdweb SDK"
			/>

			<ArticleCard
				title="thirdweb Dashboard"
				href="https://thirdweb.com/dashboard"
				description="Deploy, configure, and manage your smart contracts from the dashboard."
			/>
		</div>
	);
}

function SFCContractInfo() {
	const account = useActiveAccount();
	const walletAddress = account?.address || "0x0000000000000000000000000000000000000000";
	
	// State for gas price and dynamic calculations
	const [gasPrice, setGasPrice] = useState<bigint | null>(null);
	const [gasPriceError, setGasPriceError] = useState<string | null>(null);
	const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
	const [chainMismatch, setChainMismatch] = useState(false);

	// Call the 'delegations' function and pass the user's wallet address
	// Note: This function may revert if the address has no staking
	// We'll handle that case by treating it as 0 staking
	const { 
		data: stakingData, 
		isLoading: isStakingDataLoading,
		error: contractError
	} = useReadContract({
		contract: contract,
		method: "delegations", // Function name only - thirdweb will infer signature from ABI
		params: [walletAddress as `0x${string}`],
		queryOptions: {
			enabled: !chainMismatch && !!walletAddress && walletAddress !== "0x0000000000000000000000000000000000000000",
			retry: 0, // Don't retry - if it reverts, we'll handle it as no staking
		},
	});

	// Check if error is due to no staking (execution reverted) vs other errors
	const isNoStakingError = contractError && 
		(String(contractError).includes("execution reverted") || 
		 String(contractError).includes("revert") ||
		 String(contractError).toLowerCase().includes("no staking"));

	// Log errors for debugging
	useEffect(() => {
		if (contractError) {
			console.error("Contract call error:", contractError);
			console.error("Error details:", {
				contractAddress: STAKING_CONTRACT_ADDRESS,
				method: "delegations",
				params: [walletAddress],
				chainId: 207,
			});
		}
	}, [contractError, walletAddress]);

	// Check if wallet is on correct chain (if chain info is available)
	useEffect(() => {
		// Note: thirdweb's useActiveAccount doesn't always expose chain info
		// We'll rely on the contract error to detect chain mismatches
		setChainMismatch(false); // Reset, will be set by error handling if needed
	}, [account]);

	// Fetch current gas price from VinuChain network
	useEffect(() => {
		const fetchGasPrice = async () => {
			if (!account) return;

			try {
				// Get RPC client for VinuChain
				const rpcClient = getRpcClient({ chain: vinuchainMainnet, client });
				
				// Get gas price using eth_gasPrice RPC call
				const price = await rpcClient({
					method: "eth_gasPrice",
				} as any);
				
				// Convert hex string to BigInt
				const priceBigInt = BigInt(price as string);
				setGasPrice(priceBigInt);
				setGasPriceError(null);
				setLastUpdate(new Date());
			} catch (error) {
				console.error("Error fetching gas price:", error);
				setGasPriceError(
					error instanceof Error ? error.message : "Failed to fetch gas price"
				);
			}
		};

		// Initial fetch
		fetchGasPrice();

		// Poll every 30 seconds for updated gas price
		const interval = setInterval(fetchGasPrice, 30000);

		return () => clearInterval(interval);
	}, [account]);

	// Helper function to format wallet address (truncate with ellipsis)
	const formatAddress = (address: string) => {
		if (!address || address === "0x0000000000000000000000000000000000000000") return "Not connected";
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

	if (!account) {
		return (
			<div className="mb-20 p-6 border border-zinc-800 rounded-lg bg-zinc-900/50">
				<p className="text-zinc-400 text-center">
					Connect your wallet to view your feeless quota calculator.
				</p>
			</div>
		);
	}

	return (
		<div className="mb-20 p-6 border border-zinc-800 rounded-lg bg-zinc-900/50">
			<h2 className="text-xl font-semibold mb-4 text-zinc-100">
				Your Feeless Quota Calculator
			</h2>
			
			<div className="space-y-6">
				{/* Wallet Address Section */}
				<div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
					<p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Connected Wallet Address</p>
					<div className="flex items-center gap-3">
						<p className="text-zinc-200 font-mono text-sm">
							{formatAddress(walletAddress)}
						</p>
						<button
							onClick={() => navigator.clipboard.writeText(walletAddress)}
							className="text-zinc-400 hover:text-zinc-200 text-xs px-2 py-1 rounded hover:bg-zinc-700 transition-colors"
							title="Copy full address"
						>
							Copy
						</button>
					</div>
					<p className="text-zinc-500 font-mono text-xs mt-1 break-all opacity-70">
						{walletAddress}
					</p>
				</div>

				{/* Chain Mismatch Warning - Show if error suggests wrong network */}
				{contractError && typeof contractError === "object" && 
				 (String(contractError).includes("network") || 
				  String(contractError).includes("chain") ||
				  String(contractError).includes("207")) && (
					<div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg mb-4">
						<p className="text-yellow-400 text-sm font-semibold mb-1">⚠️ Network Configuration Issue</p>
						<p className="text-yellow-400/70 text-xs">
							Please ensure you're connected to <strong>VinuChain Mainnet (Chain ID: 207)</strong>.
						</p>
						<p className="text-yellow-400/50 text-xs mt-2">
							If using a mobile wallet (like SafePal), you may need to add VinuChain Mainnet manually:
						</p>
						<ul className="text-yellow-400/50 text-xs mt-1 ml-4 list-disc">
							<li>Network Name: VinuChain Mainnet</li>
							<li>Chain ID: 207</li>
							<li>Currency Symbol: VC</li>
							<li>RPC URL: Check VinuChain documentation for official RPC endpoint</li>
						</ul>
					</div>
				)}

				{/* Error Handling - Show different messages for no staking vs other errors */}
				{contractError && !isNoStakingError && (
					<div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
						<p className="text-red-400 text-sm font-semibold mb-1">⚠️ Error Loading Contract Data</p>
						<p className="text-red-300 text-xs font-mono break-all">
							{(() => {
								if (contractError instanceof Error) {
									return contractError.message || contractError.toString();
								}
								if (typeof contractError === "object") {
									try {
										const errorStr = JSON.stringify(contractError, Object.getOwnPropertyNames(contractError), 2);
										// Try to extract meaningful error message
										if (errorStr.includes("message")) {
											const parsed = JSON.parse(errorStr);
											return parsed.message || errorStr;
										}
										return errorStr;
									} catch {
										// If JSON.stringify fails, try to get error properties
										if ("message" in contractError) {
											return String((contractError as any).message);
										}
										return String(contractError);
									}
								}
								return String(contractError);
							})()}
						</p>
						<p className="text-red-400/70 text-xs mt-2">
							Please ensure you're connected to VinuChain Mainnet (Chain ID: 207) and try again.
						</p>
						<p className="text-red-400/50 text-xs mt-1">
							If the error persists, check the browser console for more details.
						</p>
					</div>
				)}

				{/* No Staking Message - Treat revert as no staking */}
				{isNoStakingError && (
					<div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
						<p className="text-blue-400 text-sm font-semibold mb-1">ℹ️ No Staking Found</p>
						<p className="text-blue-300 text-xs">
							This wallet address doesn't have any staking on VinuChain Mainnet.
						</p>
						<p className="text-blue-400/70 text-xs mt-2">
							To use feeless transactions, you need to stake VC tokens on VinuChain.
						</p>
					</div>
				)}

				{/* Raw Result Section */}
				{!contractError && (
					<div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
						<p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Raw Contract Result</p>
						{isStakingDataLoading ? (
							<div className="flex items-center gap-2">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-400"></div>
								<p className="text-zinc-400 text-sm">Loading your staking data from VinuChain...</p>
							</div>
						) : stakingData !== undefined ? (
							<p className="text-zinc-200 font-mono text-sm break-all bg-zinc-900/50 p-3 rounded border border-zinc-700">
								{String(stakingData)}
							</p>
						) : (
							<p className="text-zinc-400 text-sm">No result available</p>
						)}
					</div>
				)}

				{/* Feeless Trades Available Section */}
				{(!contractError || isNoStakingError) && (stakingData !== undefined || isNoStakingError) && (() => {
					// If no staking error, treat as 0 staking
					const actualStakingData = isNoStakingError ? 0n : stakingData;
					// Calculate quota (raw result / 1000)
					// If no staking, quota is 0
					const quota = typeof actualStakingData === "bigint" 
						? Number(actualStakingData) / 1000
						: typeof actualStakingData === "number"
						? actualStakingData / 1000
						: Number(actualStakingData || 0) / 1000;

					// Typical gas limits for different transaction types on VinuChain
					// These are estimates and may vary based on actual transaction complexity
					const GAS_LIMIT_VINUSWAP_TRADE = 150000n; // Typical swap gas usage
					const GAS_LIMIT_VC_TRANSFER = 21000n; // Standard ERC20 transfer
					const GAS_LIMIT_VINUNFT_MINT = 150000n; // Typical NFT mint gas usage

					// Calculate dynamic quota costs and available transactions
					let vinuswapTrades = 0;
					let vcTransfers = 0;
					let vinunftMints = 0;
					let quotaCostPerVinuSwap = 0;
					let quotaCostPerVCTransfer = 0;
					let quotaCostPerVinuNFT = 0;

					if (gasPrice !== null && quota > 0) {
						// Calculate quota cost per transaction: (gas_price × gas_used) / 1000
						// The quota is already divided by 1000, so we need to match that unit
						// Quota cost = (gas_price × gas_used) in wei, converted to quota units
						quotaCostPerVinuSwap = Number((gasPrice * GAS_LIMIT_VINUSWAP_TRADE) / 1000n) / 1e18;
						quotaCostPerVCTransfer = Number((gasPrice * GAS_LIMIT_VC_TRANSFER) / 1000n) / 1e18;
						quotaCostPerVinuNFT = Number((gasPrice * GAS_LIMIT_VINUNFT_MINT) / 1000n) / 1e18;

						// Calculate available transactions
						if (quotaCostPerVinuSwap > 0) {
							vinuswapTrades = Math.floor(quota / quotaCostPerVinuSwap);
						}
						if (quotaCostPerVCTransfer > 0) {
							vcTransfers = Math.floor(quota / quotaCostPerVCTransfer);
						}
						if (quotaCostPerVinuNFT > 0) {
							vinunftMints = Math.floor(quota / quotaCostPerVinuNFT);
						}
					}

					return (
						<>
							<div className="p-6 bg-gradient-to-br from-violet-900/20 to-purple-900/20 rounded-lg border-2 border-violet-700/50">
								<p className="text-sm text-zinc-400 mb-3 uppercase tracking-wide">Feeless Trades Available</p>
								<p className="text-violet-400 font-mono text-4xl font-bold">
									{quota.toLocaleString(undefined, { 
										maximumFractionDigits: 2,
										minimumFractionDigits: 0 
									})}
								</p>
								<p className="text-zinc-500 text-xs mt-2">
									Based on your staking data divided by 1000
								</p>
							</div>

							{/* Gas Price Info */}
							{gasPriceError && (
								<div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
									<p className="text-yellow-400 text-sm font-semibold mb-1">⚠️ Unable to Fetch Gas Price</p>
									<p className="text-yellow-300 text-xs">
										{gasPriceError}
									</p>
									<p className="text-yellow-400/70 text-xs mt-2">
										Calculations will use static estimates. Real-time updates require gas price data.
									</p>
								</div>
							)}

							{gasPrice && (
								<div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
									<div className="flex items-center justify-between mb-2">
										<p className="text-xs text-zinc-500 uppercase tracking-wide">Current Network Gas Price</p>
										{lastUpdate && (
											<p className="text-xs text-zinc-600">
												Updated {lastUpdate.toLocaleTimeString()}
											</p>
										)}
									</div>
									<p className="text-zinc-200 font-mono text-sm">
										{(Number(gasPrice) / 1e9).toFixed(2)} Gwei
									</p>
									<p className="text-zinc-500 text-xs mt-1">
										Updates every 30 seconds
									</p>
								</div>
							)}

							{/* Dynamic Human-Readable Action Translations */}
							<div className="p-6 bg-zinc-800/50 rounded-lg border border-zinc-700">
								<div className="flex items-center justify-between mb-4">
									<p className="text-sm text-zinc-400 uppercase tracking-wide">Your Feeless Actions Available</p>
									{gasPrice !== null ? (
										<p className="text-xs text-zinc-600">
											<span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
											Live
										</p>
									) : null}
								</div>
								<div className="space-y-3">
									<div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-700 hover:border-violet-600/50 transition-colors">
										<p className="text-zinc-200 text-base leading-relaxed mb-1">
											You have <span className="text-violet-400 font-semibold">{vinuswapTrades.toLocaleString()}</span> feeless <span className="text-violet-300">VinuSwap trades</span> left today.
										</p>
										{gasPrice !== null && quotaCostPerVinuSwap > 0 && (
											<p className="text-zinc-500 text-xs mt-1">
												~{quotaCostPerVinuSwap.toFixed(4)} quota per trade
											</p>
										)}
									</div>
									<div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-700 hover:border-violet-600/50 transition-colors">
										<p className="text-zinc-200 text-base leading-relaxed mb-1">
											You have <span className="text-violet-400 font-semibold">{vcTransfers.toLocaleString()}</span> feeless <span className="text-violet-300">$VC transfers</span> left today.
										</p>
										{gasPrice !== null && quotaCostPerVCTransfer > 0 && (
											<p className="text-zinc-500 text-xs mt-1">
												~{quotaCostPerVCTransfer.toFixed(4)} quota per transfer
											</p>
										)}
									</div>
									<div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-700 hover:border-violet-600/50 transition-colors">
										<p className="text-zinc-200 text-base leading-relaxed mb-1">
											You have <span className="text-violet-400 font-semibold">{vinunftMints.toLocaleString()}</span> feeless <span className="text-violet-300">VinuNFT mints</span> left today.
										</p>
										{gasPrice !== null && quotaCostPerVinuNFT > 0 && (
											<p className="text-zinc-500 text-xs mt-1">
												~{quotaCostPerVinuNFT.toFixed(4)} quota per mint
											</p>
										)}
									</div>
								</div>
								{gasPrice !== null && (
									<p className="text-zinc-500 text-xs mt-4 italic">
										* Calculations update automatically based on current network gas price
									</p>
								)}
							</div>
						</>
					);
				})()}
			</div>
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
