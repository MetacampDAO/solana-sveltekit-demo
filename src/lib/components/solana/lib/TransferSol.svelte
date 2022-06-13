<script lang=ts>
	
	// Include borsh functionality
	import { serialize, deserialize, deserializeUnchecked } from "borsh";
	import { Buffer } from "buffer";
	import * as sol from '@solana/web3.js'
	import { walletStore } from "@svelte-on-solana/wallet-adapter-core";	
	import { cluster } from "$lib/stores";


	interface sendTransactionInput {
		cluster: string,
		fromKeypair: string | null,
		toKeypair: string,
		solAmount: number
	}

	// Set default transaction input
	let txInput : sendTransactionInput = {
        cluster: $cluster,
		fromKeypair: "",
		toKeypair: "",
		solAmount: 0.1
   		}

	// Send Transaction function
    async function transferSol() {
		if (txInput.fromKeypair !== "" && txInput.toKeypair !== "") {

			// Create Connection to connect to cluster
			let connection = new sol.Connection(
				sol.clusterApiUrl($cluster),
				'confirmed',
			);

			// Create Transaction
			let transaction = new sol.Transaction
			transaction.add(
				sol.SystemProgram.transfer({
					fromPubkey: $walletStore.publicKey as sol.PublicKey,
					toPubkey: new sol.PublicKey(txInput.toKeypair),
					lamports: txInput.solAmount * sol.LAMPORTS_PER_SOL
				})
			)

			// Send Transaction
			transferSolSignatur = await $walletStore.sendTransaction(transaction, connection)

			return transferSolSignatur
		}
	}

	// Request Airdrop function
	async function airDrop() {
		if (txInput.toKeypair !== "") {

			// Create Connection to connect to cluster
			let connection = new sol.Connection(
				sol.clusterApiUrl($cluster),
				'confirmed',
			);

			// Request Airdrop
			airDropSignature = await connection.requestAirdrop(
				new sol.PublicKey(txInput.toKeypair), 
				txInput.solAmount * sol.LAMPORTS_PER_SOL
			)

			await connection.confirmTransaction(airDropSignature)

			return airDropSignature
		}
	}


	let airDropSignature: string;
	let transferSolSignatur: string;

	// Enable Reactivity
	$: txInput.fromKeypair = $walletStore.publicKey ? $walletStore.publicKey.toString() : "";

</script>

<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">
	<div class="grid grid-cols-1 space-y-4">
		<div>
			<label for="Source">Source:</label>
			<input class="text-black w-full" bind:value={txInput.fromKeypair} placeholder="Connect to your wallet ...">
		</div>
		<div>
			<label for="Target">Target:</label>
			<input class="text-black w-full" bind:value={txInput.toKeypair} placeholder="Enter recipient address ...">
		</div>
		<div>
			<label for="Amount (SOL)">Amount (SOL):</label>
			<input class="text-black w-full" bind:value={txInput.solAmount}>
		</div>
		<div>
			<button class="p-2 bg-primary rounded-md" on:click={transferSol}>
				Send Transaction
			</button>
			<button class="p-2 bg-primary rounded-md " on:click={airDrop}>
				Airdrop
			</button>
		</div>
	</div>
	<div>
		{#if transferSolSignatur}
			<p>{txInput.solAmount} SOL successfully sent</p>
		{/if}
		{#if airDropSignature}
		<p>{txInput.solAmount} SOL successfully airdropped</p>
		{/if}
	</div>
</section>