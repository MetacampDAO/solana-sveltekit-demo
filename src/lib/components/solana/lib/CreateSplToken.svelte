<script lang=ts>
    // Creating your own fungible token
    import { createMint, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
    import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
    import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
    import { cluster } from "$lib/stores";


    let connection = new Connection(
            clusterApiUrl($cluster),
            'confirmed'
        );


    var payer = Keypair.generate(); // Need signer type, including pubKey and secretKey
    var mintAuthority : PublicKey | null = $walletStore.publicKey; 
    var freezeAuthority : PublicKey | null = $walletStore.publicKey;



    let airDropSignature : any
    let mintAccount : any
    let splTokenAccount : any


    // Request Airdrop function
	async function airDrop() {

        // Request Airdrop
        airDropSignature = await connection.requestAirdrop(
            payer.publicKey, 
            1 * LAMPORTS_PER_SOL
        )

        await connection.confirmTransaction(airDropSignature)

        return airDropSignature

	}

    // Create SPL Token
    async function createSplToken() {

        mintAccount = await createMint(
            connection,
            payer,
            mintAuthority,
            freezeAuthority,
            9 // We are using 9 to match the CLI decimal default exactly
        );

        return mintAccount.toString()
    }
    

    // Create SPL Token Account
    async function createSplTokenAccount(){
        splTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mintAccount,
            payer.publicKey
        )

        return splTokenAccount.address.toString()
    }

    $: mintAuthority = $walletStore.publicKey
    $: freezeAuthority = $walletStore.publicKey

</script>

<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">
    <div class="space-y-4">
        <div>
            Token Signer: {payer.publicKey}
        </div>
        <div>
            <button class="p-2 bg-primary rounded-md " on:click={airDrop}>
                Airdrop
            </button>
            {#await airDropSignature}
            <p>waiting airdrop</p>
            {:then value}
                {#if value}
                    <p>Airdop Signature: 
                        <a class="hover:text-primary" href='https://solscan.io/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
                    </p>
                {/if}
            {:catch error}
                <p>No airdrop data</p>
            {/await}
        </div>
        <div>
            <button class="p-2 bg-primary rounded-md " on:click={createSplToken}>
                Create Mint Account
            </button>
            {#await mintAccount}
                <p>waiting token</p>
            {:then value}
                {#if value}
                    <p>Mint Account: 
                            <a class="hover:text-primary" href='https://solscan.io/account/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
                    </p>
                {/if}
            {:catch error}
                <p>No Mint account data</p>
            {/await}
        </div>
        <div>
            <button class="p-2 bg-primary rounded-md " on:click={createSplTokenAccount}>
                Create SPL Token Account
            </button>
            {#await splTokenAccount}
                <p>waiting token</p>
            {:then value}
                {#if value}
                    <p>SPL Token Account: 
                            <a class="hover:text-primary" href='https://solscan.io/account/{value.address.toString()}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value.address.toString()}</a>
                    </p>
                {/if}
            {:catch error}
                <p>No SPL token account data</p>
            {/await}
        </div>
    </div>

</section>

