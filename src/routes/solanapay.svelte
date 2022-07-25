<script context="module" lang="ts">
	export const prerender = true;
	
</script>

<script lang="ts">
	import SolanaPay from '$lib/components/solana/SolanaPay.svelte';
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
			<SolanaPay />
		</div>
	</div>
</section>