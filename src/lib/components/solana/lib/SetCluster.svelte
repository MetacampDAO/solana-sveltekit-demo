<script lang=ts>
    import { cluster } from "$lib/stores";


	// Define list for selecting cluster
	let cluster_selected
	let cluster_options = [
		{ id:1, name: 'devnet'},
		{ id:2, name: 'testnet'},
		{ id:3, name: 'mainnet-beta'},
	]


    // OnClick function for setting Cluster
	function setCluster() {
		cluster.set(cluster_selected)
	}

</script>

<section class="text-black dark:text-white" >
	<div>
		<label for="Cluster">Cluster:</label>
		<select class='text-black' bind:value={cluster_selected} on:change={setCluster}>
			{#each cluster_options as cluster}
				<option class='text-black' value={cluster.name}>
					{cluster.name}
				</option>
			{/each}
		</select>
	</div>
</section>