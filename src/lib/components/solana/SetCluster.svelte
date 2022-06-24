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
		connectedCluster.set(
			new Connection(clusterApiUrl(cluster_selected as Cluster), 'confirmed') 
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