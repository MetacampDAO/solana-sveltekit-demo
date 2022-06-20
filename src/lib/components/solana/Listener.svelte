<script lang=ts>
    import { cluster, connectedCluster } from '$lib/stores'
    import type { PublicKey, AccountInfo, Context } from '@solana/web3.js';
    import { walletStore } from '@svelte-on-solana/wallet-adapter-core';


    async function subscribeAccount(){
        clientSubcriptionId = await $connectedCluster.onAccountChange(
            $walletStore.publicKey as PublicKey,
            (cb_account, cb_context) => {
                accountChange = JSON.stringify(cb_account)
            }
        )

        return clientSubcriptionId
    }

    async function unsubscribeAccount(clientSubcriptionId: number){
        await $connectedCluster.removeAccountChangeListener(
            clientSubcriptionId
        )

    }

    let clientSubcriptionId : number
    let cb_account : AccountInfo<Buffer>
    let cb_context : Context
    let unsubscribeId : number
    let accountChange : string 

</script>

<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">
    <div class="grid grid-cols-1 space-y-4">

        <!-- Listener -->
        <div>
            <button class="p-2 bg-primary rounded-md " on:click={() => subscribeAccount()}>
                Subscribe Account
            </button>
            {#await clientSubcriptionId then value}
            <p>{value} subscribed</p>
            {/await}
        </div>
        <div>
            <label for="Subscription ID">Unsubscribe</label>
            <input class="text-black w-full" bind:value={clientSubcriptionId} placeholder="Specify ID">
            <button class="p-2 bg-primary rounded-md " on:click={() => unsubscribeAccount(clientSubcriptionId)}>
                Unsubscribe Account
            </button>
        </div>

        <div>
            <label for="Account Change">Account Change: </label>
            {accountChange}
        </div>
   
    </div>

</section>
    