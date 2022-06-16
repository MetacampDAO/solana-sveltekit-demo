<script lang=ts>	
	// Include borsh functionality
	import * as sol from '@solana/web3.js'
	import { walletStore } from "@svelte-on-solana/wallet-adapter-core";	
	import { cluster, connectedCluster } from "$lib/stores";


	// Request Airdrop function
	async function airDrop(targetPubKey : sol.PublicKey, solAmount : number) {

		// Request Airdrop
		airDropSignature = await $connectedCluster.requestAirdrop(
			targetPubKey,
			solAmount * sol.LAMPORTS_PER_SOL
		)

		return airDropSignature
	}

	// Send Transaction function
    async function transferSol(sourcePubKey : sol.PublicKey, targetPubKey : sol.PublicKey, solAmount : number) {

		// Create Transaction with instruction
		let transaction = new sol.Transaction
		transaction.add(
			sol.SystemProgram.transfer({
				fromPubkey: sourcePubKey,
				toPubkey: targetPubKey,
				lamports: solAmount * sol.LAMPORTS_PER_SOL
			})
		)

		// Send Transaction
		transferSignature = await $walletStore.sendTransaction(transaction, $connectedCluster)

		return transferSignature
	}

	// Input/Output variables used
	let airDropSignature: string;
	let transferSignature: string;
	let sourcePubKey : sol.PublicKey | any
	let targetPubKey : sol.PublicKey 
	let solAmount : number = 0.1

	// Enable Reactivity, "Source" automatically set to connected wallet
	$: sourcePubKey = $walletStore.publicKey ? $walletStore.publicKey : null

</script>

<!-- HTML + SVELTE -->
<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">
	<div class="grid grid-cols-1 space-y-4">

		<!-- User Input -->
		<div>
			<label for="Source">Source:</label>
			<input class="text-black w-full" bind:value={sourcePubKey} placeholder="Connect to your wallet ...">
		</div>
		<div>
			<label for="Target">Target:</label>
			<input class="text-black w-full" bind:value={targetPubKey} placeholder="Enter recipient address ...">
		</div>
		<div>
			<label for="Amount (SOL)">Amount (SOL):</label>
			<input class="text-black w-full" bind:value={solAmount}>
		</div>

		<!-- User Buttons -->
		<div>
			<button class="p-2 bg-primary rounded-md" on:click={() => transferSol(new sol.PublicKey(sourcePubKey), new sol.PublicKey(targetPubKey), +solAmount)}>
				Send Transaction
			</button>
			<button class="p-2 bg-primary rounded-md " on:click={() => airDrop(new sol.PublicKey(targetPubKey), +solAmount)}>
				Airdrop
			</button>
		</div>

	</div>

	<div>
		<!-- Airdrop success message -->
		{#if airDropSignature}
		<p>{solAmount} SOL successfully airdropped</p>
		{/if}
		{#await airDropSignature then value}
		{#if value}
		<p>Airdop Signature: 
			<a class="hover:text-primary" href='https://solana.fm/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
		</p>
		{/if}
	{/await}


		<!-- Transfer success message -->
		{#if transferSignature}
			<p>{solAmount} SOL successfully sent</p>
		{/if}
		{#await transferSignature then value}
			{#if value}
			<p>Transfer Signature: 
				<a class="hover:text-primary" href='https://solana.fm/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
			</p>
			{/if}
		{/await}

	</div>

</section>