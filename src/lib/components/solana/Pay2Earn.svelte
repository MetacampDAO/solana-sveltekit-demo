<script lang=ts>	
	// Include borsh functionality
	import * as sol from '@solana/web3.js'
	import { walletStore } from "@svelte-on-solana/wallet-adapter-core";	
	import { cluster, connectedCluster } from "$lib/stores";
	import { SolendAction, SolendMarket, SolendObligation } from '@solendprotocol/solend-sdk'
	import BN from 'bn.js'


	async function depositUsdc(){

		// Create one or more (may contain setup accuont creation txns) to perform a Solend action.
		var solendAction = await SolendAction.buildDepositTxns(
			$connectedCluster,
			String(usdcStaked*10**decimal),
			symbol,
			$walletStore.publicKey as sol.PublicKey,
			"production"
		);

		var transaction = new sol.Transaction()
		transaction.add(
			solendAction.lendingIxs[0]
		)
		usdcDepositSignature = await $walletStore.sendTransaction(transaction, $connectedCluster); // sendTransaction from wallet adapter or custom

	}

	async function withdrawUsdc(){

		var market = await SolendMarket.initialize(
			$connectedCluster,
		)
		
		obligation = await market.fetchObligationByWallet(
			$walletStore.publicKey as sol.PublicKey
		)

		var allUsdc = obligation?.deposits.find(position => position.mintAddress == 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')?.amount.toString()

		// Create one or more (may contain setup accuont creation txns) to perform a Solend action.
		var solendAction = await SolendAction.buildWithdrawTxns(
			$connectedCluster,
			allUsdc as string,
			symbol,
			$walletStore.publicKey as sol.PublicKey,
			"production"
		);

		var transaction = new sol.Transaction()
		transaction.add(
			solendAction.setupIxs[0],
			solendAction.setupIxs[1],
			solendAction.lendingIxs[0]
		)
		usdcWithdrawSignature = await $walletStore.sendTransaction(transaction, $connectedCluster); // sendTransaction from wallet adapter or custom

	}


	// Input/Output variables used
	let usdcWithdrawSignature: string;
	let decimal : number = 6
	let symbol : string = 'USDC'
	let usdcDepositSignature : string
	let usdcFrom : sol.PublicKey = new sol.PublicKey('4hRedAZFcZrQ9ro434SJYCk1eREhHJdjnAKwcHxBNBWq')
	let usdcTo: sol.PublicKey
	let usdcPrice : number | string | undefined = 0.5
	let usdcStaked : number
	let obligation : SolendObligation | null

	// Enable Reactivity, "Source" automatically set to connected wallet
	$: sourcePubKey = $walletStore.publicKey ? $walletStore.publicKey : null
	$: usdcStaked = Math.ceil(Number(usdcPrice)) - Number(usdcPrice)



</script>

<!-- HTML + SVELTE -->
<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">

	<!-- Transfer & Airdrop Token -->
	<div class="grid grid-cols-1 space-y-4">

		<!-- User Input -->
		<div>
			<label for="Amount (SOL)">Price (USDC):</label>
			<input class="text-black w-full" bind:value={usdcPrice}>
		</div>

		<!-- User Buttons -->
		<div>
			<button class="p-2 bg-primary rounded-md" on:click={() => depositUsdc()}>
				Pay {usdcPrice} USDC
				{#if (usdcStaked !== 0)}
					 & Deposit {Math.floor(usdcStaked * 100)/100} USDC 
				{/if}
			</button>
		</div>
		<div>
			<button class="p-2 bg-primary rounded-md" on:click={() => withdrawUsdc()}>
				Withdraw All
			</button>
		</div>

	</div>

	<div>
		

		<!-- Transfer success message -->
		{#await usdcDepositSignature then value}
			{#if value}
			<p>SUCCESS -> Deposit Signature: 
				<a class="hover:text-primary" href='https://solana.fm/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
			</p>
			{/if}
		{/await}

		{#await usdcWithdrawSignature then value}
		{#if value}
		<p>SUCCESS -> Withdraw Signature: 
			<a class="hover:text-primary" href='https://solana.fm/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
		</p>
		{/if}
	{/await}

	</div>

</section>