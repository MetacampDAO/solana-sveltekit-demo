<script lang=ts>
	import {
		PublicKey,
		type ParsedAccountData,
		type AccountInfo,
		type RpcResponseAndContext, 
		type AccountChangeCallback,
		LAMPORTS_PER_SOL
	} from '@solana/web3.js';
	import { 
		AccountLayout, 
		TOKEN_PROGRAM_ID
	} from "@solana/spl-token";
	import { cluster, connectedCluster } from "$lib/stores";



	// Get AccountInfo function
	async function getAccountInfo(pubKey : PublicKey) {
	
		// Get accountInfo
		AccountData = await $connectedCluster.getAccountInfo(pubKey, 'confirmed');

		return AccountData

	};


	// Get ParsedAccountData function
	async function getParsedAccountData(pubKey : PublicKey) {
		
		// Get accountInfo
		AccountData = await $connectedCluster.getParsedAccountInfo(pubKey, 'confirmed');


		return AccountData

	};

	// Subscribe AccountData function
	async function subscribeAccountData(pubKey : PublicKey) {
		
		// Subscribe accountInfo
		onAccountChange = $connectedCluster.onAccountChange(
			pubKey, 
			(accountInfo, slot) => {
				if (accountInfo!.data.length > 0) {
					console.log("Token                                         Balance");
					console.log("------------------------------------------------------------");
					accountData = AccountLayout.decode(accountInfo!.data);
					console.log(`${new PublicKey(accountData.mint)}   ${Number(accountData.amount) / LAMPORTS_PER_SOL}`);
				}
				console.log(slot)
			}, 
			'confirmed')


		return AccountData

	};

	

	// Input/Output variables used
	let pubKey : string
	let accountInfo : AccountInfo<Buffer> | null
	let AccountData : RpcResponseAndContext<AccountInfo<Buffer | ParsedAccountData> | null>
	let accountData

	// Subscribe
	let onAccountChange : number

</script>


<!-- HTML + SVELTE -->
<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">
	<div>
		<!-- User Input -->
		<div>
			<label for="Account">Account:</label>
			<input class="text-black w-full mb-4" bind:value={pubKey} placeholder="Enter address ...">
			<button class="p-2 bg-primary rounded-md" on:click={() => getAccountInfo(new PublicKey(pubKey))}>
				Get Account Info
			</button>
			<button class="p-2 bg-primary rounded-md" on:click={() => getParsedAccountData(new PublicKey(pubKey))}>
				Get Parsed Account Info
			</button>
			<button class="p-2 bg-primary rounded-md" on:click={() => subscribeAccountData(new PublicKey(pubKey))}>
				Subscribe Account
			</button>
			<a href='https://solana.fm/address/{pubKey}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">
				<button class="p-2 bg-primary rounded-md">
					Check Explorer
				</button>
			</a>
		</div>

		<!-- Response Output -->
		<div>
			{#if onAccountChange !== undefined}
			<div>Subscription ID: {onAccountChange}</div>
			{/if}
		</div>
		<div>
			{#await AccountData}
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