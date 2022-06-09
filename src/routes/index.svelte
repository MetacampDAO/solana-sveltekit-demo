<script context="module" lang="ts">
	export const prerender = true;
	
</script>

<script lang="ts">
	import GetAccountInfo from '$lib/components/solana/lib/GetAccountInfo.svelte'
	import CreateTransaction from '$lib/components/solana/lib/TransferSol.svelte'
	import SetCluster from '$lib/components/solana/lib/SetCluster.svelte';
	import CreateSplToken from '$lib/components/solana/lib/CreateSplToken.svelte';

</script>

<svelte:head>
	<title>OpenHaus</title>
</svelte:head>


<section class="w-full h-screen font-main">
	<div class="flex m-4 mb-12 justify-center">
		<SetCluster />
	</div>
	<div class="flex m-4 mb-12 justify-center">
		<CreateTransaction />
	</div>
	<div class="flex m-4 mb-12 justify-center">
		<GetAccountInfo />
	</div>
	<div class="flex m-4 mb-12 justify-center">
		<CreateSplToken />
	</div>
</section>
