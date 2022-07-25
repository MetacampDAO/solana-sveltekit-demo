<script lang="ts">
	import { page } from '$app/stores';
	import Toggle from '$lib/layout/Darkmode.svelte';
	import Adapter from '$lib/components/solana/wallet/Adapter.svelte';

</script>


<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="icon" href="" />
</head>

<header class="m-6 p-6">

	<div class="flex space-x-12 justify-center align-middle items-center h-full font-main text-black dark:text-white">
		<div class="absolute left-6 top-6">
			<a href="/">
			<div class:active={$page.url.pathname === '/'}>
				<p class="font-bold tracking-widest text-2xl">Metacamp</p>
			</div></a>
		</div>
		<div class="absolute right-16 top-6 h-4">
			<Adapter />
		</div>
		<div class="absolute right-6 top-8">
			<Toggle />
		</div>
	</div>

</header>

