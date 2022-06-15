import { type Cluster, Connection, clusterApiUrl } from '@solana/web3.js'
import { writable } from "svelte/store";


// Export wallet cluster
export const cluster = writable('devnet' as Cluster)

// Export wallet cluster connection
export let connectedCluster = writable( new Connection(clusterApiUrl('devnet' as Cluster), 'confirmed') )

// For Dark mode
export const theme = writable('dark');

if (typeof localStorage !== 'undefined') {
    const storedTheme = localStorage.getItem("theme");
    const theme = writable(storedTheme);
}

theme.subscribe(value => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem("theme", value === 'light' ? 'light' : 'dark');
    }
});