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
	import { parseFile } from "$lib/ts/parseCSV";
	import subscribeAccount from '$lib/ts/subscribeAccount';



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
		return parsedAccountData

	};

	// Subscribe from File Input
	async function updateFile(filePath: any) {
		data = await parseFile(filePath)
		for (let item of data) {
			console.log(item.pubKey)
			let subscriptionId = await subscribeAccount($connectedCluster, new PublicKey(item.pubKey), item)
			console.log("Subscription Id:", subscriptionId)
		}	
	}
	

	// Input/Output variables used
	let pubKey : PublicKey
	let parsedAccountData : RpcResponseAndContext<AccountInfo<Buffer | ParsedAccountData> | null>
	let accountData : any

	// Subscribe
	let onAccountChange : number
	let data : any

</script>


<!-- HTML + SVELTE -->
<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">
	<div>
		<!-- User Input -->
		<div>
			<label for="Account">Account:</label>
			<input class="text-black w-full mb-4" bind:value={pubKey} placeholder="Enter address ...">
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
			{#if accountData !== undefined}
			<pre>{JSON.stringify(accountData, null, 4)}</pre>
			{/if}
		</div>
	</div>



	<div>
		<!-- User Input -->
		<div>
			<input id="fileSelected" type="file" accept='.csv' multiple on:change={(e) => updateFile(e)}>
		</div>


		<!-- Response Output -->
		<div>
			{#if onAccountChange !== undefined}
			<div>Subscription ID: {onAccountChange}</div>
			{/if}
		</div>
	</div>
</section>