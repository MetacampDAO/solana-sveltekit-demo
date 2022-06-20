<script context="module" lang="ts">
	export const prerender = true;
	
</script>

<script lang="ts">
	import Pay2Earn from '$lib/components/solana/Pay2Earn.svelte';
	

</script>

<svelte:head>
	<title>OpenHaus</title>
</svelte:head>


<section class="w-full h-screen font-main">
	<div>
		<div class="flex m-4 mb-12 justify-center">
			<Pay2Earn />
		</div>
	</div>
</section>
