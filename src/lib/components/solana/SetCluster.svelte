<script lang=ts>
    import { cluster, connectedCluster } from "$lib/stores";
	import { type Cluster, Connection, clusterApiUrl } from "@solana/web3.js";


	// Define list for cluster options
	let cluster_options = [
		{ name: 'devnet'},
		{ name: 'testnet'},
		{ name: 'mainnet-beta'},
	]


    // Set cluster connection via store
	function setConnection() {

		// Set new cluster and connection in store
		cluster.set(
			cluster_selected as Cluster
		)

		let devnet : string = "https://devnet.genesysgo.net/";
		let mainnet : string = "https://nd-851-001-175.p2pify.com/6014eef5a39244c0fa63c9645a2d923d";
		let testnet : string = "https://api.testnet.solana.com/";

		let api_url : string

		switch(cluster_selected) {
				case 'mainnet-beta':
					api_url	= mainnet;
					break;
				case 'testnet':
					api_url	= testnet;
					break
				case 'devnet':
					api_url	= devnet;
					break;
				default:
					api_url = testnet
					break
			}


		connectedCluster.set(
			// new Connection(clusterApiUrl(cluster_selected as Cluster), 'confirmed') 
			new Connection(api_url, 'confirmed') 
		)

	}

	// Input/Output variables used
	let cluster_selected : Cluster = $cluster

	setConnection()


</script>


<!-- HTML + SVELTE -->
<section class="text-black dark:text-white" >
	<!-- User Input -->
	<div>
		<label for="Cluster">Cluster:</label>
		<select class='text-black' bind:value={cluster_selected} on:change={setConnection}>
			{#each cluster_options as cluster}
				<option class='text-black' value={cluster.name}>
					{cluster.name}
				</option>
			{/each}
		</select>
	</div>
</section>