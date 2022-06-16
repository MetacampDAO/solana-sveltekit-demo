<script>
    import { theme } from '$lib/stores';
    import sun from '$lib/assets/images/darkmode/sun.svg';
    import moon from '$lib/assets/images/darkmode/moon.svg';
    import { onMount } from 'svelte';

    onMount(() => {
        if ($theme == "light") {
            window.document.documentElement.classList.toggle('dark')
        } else if ($theme == "dark") {
            window.document.documentElement.classList.toggle('light')
        }
    })

    function toggle() {
        window.document.documentElement.classList.toggle('dark');
        if (window.document.documentElement.classList[0] == 'dark') {
            theme.set('dark');
        } else {
            theme.set('light');
        }
    }


</script>


<div class="bg-grey dark:bg-dark rounded-md p-1 hover:bg-primary dark:hover:bg-primary" on:click={toggle}>
    {#if $theme == "dark" }
        <img src={sun} alt="sun">
    {:else}
        <img src={moon} alt="moon">
    {/if}
</div>
