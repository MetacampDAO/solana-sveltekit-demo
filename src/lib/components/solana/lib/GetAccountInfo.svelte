<script lang=ts>
	
	// Include borsh functionality
	import { serialize, deserialize, deserializeUnchecked } from "borsh";
	import { Buffer } from "buffer";
	import * as sol from '@solana/web3.js'
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
	import { cluster } from "$lib/stores";


	interface Account {
		cluster: sol.Cluster,
		publicKey: string,
	}

	// Set default cluster and publickey for Account
	let account : Account = {
        cluster: $cluster,
        publicKey: $walletStore.publicKey ? $walletStore.publicKey.toString() : ""
    }

	// Get AccountInfo function
	async function getAccountInfo(input:Account) {

		// Connect to cluster
		var connection = new sol.Connection(
			sol.clusterApiUrl($cluster),
			'confirmed',
		);

		// Generate a new wallet keypair and airdrop SOL
		var wallet = new sol.PublicKey(input.publicKey)


		// Get accountInfo
		let accountInfo = await connection.getAccountInfo(wallet, "processed");

		return accountInfo

	};

	// Client-rendering for getAccountInfo when initiating website
	let promise = getAccountInfo(account);
    
	// OnClick funciton for getAccountInfo()
    function handleClick() {
		promise = getAccountInfo(account)
	}

	// Enable reactivity
	account.publicKey = $walletStore.publicKey ? $walletStore.publicKey.toString() : "";

</script>

<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md">
	<div>
		<input class="text-black w-full" bind:value={account.publicKey} placeholder="Enter recipient address ...">
		<button class="p-2 bg-primary rounded-md" on:click={handleClick}>
			Get AccountInfo
		</button>
	</div>
	<div>
		{#await promise}
			<p>waiting</p>
		{:then account}
			<pre>{JSON.stringify(account, null, 4)}</pre>
		{:catch error}
			<p>No data</p>
		{/await}
		
	</div>
</section>