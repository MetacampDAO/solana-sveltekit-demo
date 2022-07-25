<script context="module" lang="ts">
	export const prerender = true;
	
</script>

<script lang="ts">

	import GetParsedAccountData from '$lib/components/solana/GetParsedAccountData.svelte';
	import TransferSol from '$lib/components/solana/TransferSol.svelte';
	import SetCluster from '$lib/components/solana/SetCluster.svelte';
	import SplToken from '$lib/components/solana//SplToken.svelte';


	

</script>

<svelte:head>
	<title>OpenHaus</title>
</svelte:head>


<section class="w-full h-screen font-main">
	<div>
		<div class="flex m-4 mb-12 justify-center">
			<SetCluster />
		</div>
		<div class="flex m-4 mb-12 justify-center">
			<GetParsedAccountData />
		</div>
		<div class="flex m-4 mb-12 justify-center">
			<TransferSol />
		</div>
		<div class="flex m-4 mb-12 justify-center">
			<SplToken />
		</div>
	</div>
</section>
