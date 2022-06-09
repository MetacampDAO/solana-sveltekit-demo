<script>
    import { theme } from '$lib/stores';
    import sun from '$lib/assets/images/darkmode/sun.svg';
    import moon from '$lib/assets/images/darkmode/moon.svg';

let state = 'undefined'

    function toggle() {
        window.document.documentElement.classList.toggle('dark');
        if (window.document.documentElement.classList[0] == 'dark') {
            theme.set('dark');
            state = "dark";
        } else {
            theme.set('light');
            state = "light";
        }
    }

</script>


<div class="bg-grey dark:bg-dark rounded-md p-1 hover:bg-primary dark:hover:bg-primary" on:click={toggle}>
    {#if state == "dark" }
        <img src={sun} alt="sun">
    {:else}
        <img src={moon} alt="moon">
    {/if}
</div>
