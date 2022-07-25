<script context="module" lang="ts">
	export const prerender = true;
	
</script>

<script lang="ts">
	import Pay2Earn from '$lib/components/solana/Pay2Earn.svelte';
	import SetCluster from '$lib/components/solana/SetCluster.svelte';
	

</script>

<svelte:head>
	<title>Metacamp</title>
</svelte:head>


<section class="w-full h-screen font-main">
	<div>
		<div class="flex m-4 mb-12 justify-center">
			<SetCluster />
		</div>
		<div class="flex m-4 mb-12 justify-center">
			<Pay2Earn />
		</div>
	</div>
</section>
