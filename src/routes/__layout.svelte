<script lang="ts">
	import '../app.css';
	import Header from '$lib/layout/Header.svelte';
	import Footer from '$lib/layout/Footer.svelte';
</script>


<main class="bg-white dark:bg-black text-dark dark:text-light no-scrollbar">
	<Header />
	<slot />
</main>
	

<Footer />

