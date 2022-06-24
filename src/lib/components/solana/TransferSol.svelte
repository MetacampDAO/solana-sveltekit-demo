<script lang=ts>	
	import { 
		PublicKey,
		Connection,
		LAMPORTS_PER_SOL,
		clusterApiUrl,
		SystemProgram,
		Transaction
	} from '@solana/web3.js'
	import { walletStore } from "@svelte-on-solana/wallet-adapter-core";	
	import { cluster, connectedCluster } from "$lib/stores";


	// Request Airdrop function
	async function airDrop(targetPubKey : PublicKey, solAmount : number) {

		// Request Airdrop
		airDropSignature = await $connectedCluster.requestAirdrop(
			targetPubKey,
			solAmount * LAMPORTS_PER_SOL
		)

		return airDropSignature
	}

	// Send Transaction function
    async function transferSol(sourcePubKey: PublicKey, targetPubKey : PublicKey, solAmount : number) {

		var connection = new Connection(clusterApiUrl('devnet'), 'processed')

		// Create Transaction with instruction
		var lastValidBlockHeight = (await $connectedCluster.getLatestBlockhash()).lastValidBlockHeight
		var blockhash = (await $connectedCluster.getLatestBlockhash()).blockhash
		var transaction = new Transaction(
            {
                feePayer: $walletStore.publicKey as PublicKey,
                blockhash: blockhash,
                lastValidBlockHeight: lastValidBlockHeight
            }
        )  
		transaction.add(
			SystemProgram.transfer({
				fromPubkey: sourcePubKey,
				toPubkey: targetPubKey,
				lamports: solAmount * LAMPORTS_PER_SOL
			})
		)


		console.log(lastValidBlockHeight)
		console.log($connectedCluster)


		// Send Transaction
		transferSignature = await $walletStore.sendTransaction(transaction, connection, {skipPreflight:true})

		return transferSignature
	}

	// Input/Output variables used
	let airDropSignature: string;
	let transferSignature: string;
	let sourcePubKey : PublicKey | any
	let targetPubKey : PublicKey 
	let solAmount : number | string = 0.5

	// Enable Reactivity, "Source" automatically set to connected wallet
	$: sourcePubKey = $walletStore.publicKey ? $walletStore.publicKey : null

</script>

<!-- HTML + SVELTE -->
<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">

	<!-- Transfer & Airdrop Token -->
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
			<button class="p-2 bg-primary rounded-md" on:click={() => transferSol(new PublicKey(sourcePubKey), new PublicKey(targetPubKey), +solAmount)}>
				Send Transaction
			</button>
			<button class="p-2 bg-primary rounded-md " on:click={() => airDrop(new PublicKey(targetPubKey), +solAmount)}>
				Airdrop
			</button>
		</div>

	</div>

	<div>
		<!-- Airdrop success message -->
		{#await airDropSignature then value}
			{#if value}
			<p>SUCCESS -> Airdop Signature: 
				<a class="hover:text-primary" href='https://solana.fm/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
			</p>
			{/if}
		{/await}

		<!-- Transfer success message -->
		{#await transferSignature then value}
			{#if value}
			<p>SUCCESS -> Transfer Signature: 
				<a class="hover:text-primary" href='https://solana.fm/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
			</p>
			{/if}
		{/await}

	</div>

</section>