<script lang=ts>
	import * as sol from '@solana/web3.js'
	import { cluster, connectedCluster } from "$lib/stores";


	// Get AccountInfo function
	async function getAccountInfo(pubKey : sol.PublicKey) {
		
		// Get accountInfo
		accountInfo = await $connectedCluster.getAccountInfo(pubKey, 'confirmed');

		return accountInfo

	};


	// Input/Output variables used
	let pubKey : string
	let accountInfo : sol.AccountInfo<Buffer> | null 

</script>


<!-- HTML + SVELTE -->
<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">
	<div>
		<!-- User Button -->
		<div>
			<label for="Account">Account:</label>
			<input class="text-black w-full mb-4" bind:value={pubKey} placeholder="Enter address ...">
			<button class="p-2 bg-primary rounded-md" on:click={() => getAccountInfo(new sol.PublicKey(pubKey))}>
				Get Account Info
			</button>
			<a href='https://solana.fm/address/{pubKey}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">
				<button class="p-2 bg-primary rounded-md">
					Check Explorer
				</button>
			</a>

		</div>

		<!-- Response Output -->
		<div>
			{#await accountInfo}
				<p>waiting</p>
			{:then account}
				{#if account !== undefined}
				<pre>{JSON.stringify(account, null, 4)}</pre>
				{/if}
			{:catch error}
				<p>No data</p>
			{/await}
		</div>
	</div>
</section>