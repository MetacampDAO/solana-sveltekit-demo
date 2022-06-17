<script lang=ts>

    // Import Solana SDK
    import {
        Keypair,
        type Signer,
        Transaction,
        SystemProgram,
        PublicKey
    } from '@solana/web3.js'

    // Create Instructions 
    import { 
        createInitializeMintInstruction,
        getMinimumBalanceForRentExemptMint,
        TOKEN_PROGRAM_ID, 
        MINT_SIZE,
    } from '@solana/spl-token'

    // Import Wallet Adapter
	import { walletStore } from "@svelte-on-solana/wallet-adapter-core";

    // Import cluster environment
	import { cluster, connectedCluster } from "$lib/stores";


    // Create Mint
    async function createMintAccount(walletOwner: PublicKey) {

        // Create Mint transaction
        var mintKeypair = Keypair.generate() as Signer
        var lamports = await getMinimumBalanceForRentExemptMint($connectedCluster)
        var latestBlockHash = await $connectedCluster.getLatestBlockhash();

        // Create new transaction for creating Mint Account
        var transaction = new Transaction(
            {
                feePayer: $walletStore.publicKey as PublicKey,
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
            }
        )  

        // Add two instructions
        transaction.add(  
            SystemProgram.createAccount({
                fromPubkey: $walletStore.publicKey as PublicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports: lamports,
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMintInstruction(
                mintKeypair.publicKey as PublicKey, // mintAccount
                9 as number, // decimals
                $walletStore.publicKey as PublicKey, // mintAuthority
                $walletStore.publicKey as PublicKey, // freezeAuthority
                TOKEN_PROGRAM_ID as PublicKey
            )        
        )

        // Sign partially with generated keypair for initializing account into mint
        transaction.partialSign( mintKeypair )

        // Sign with wallet and send Transaction
        mintSignature = await $walletStore.sendTransaction( transaction, $connectedCluster)

        return mint = mintKeypair.publicKey.toString()
    }



    /** Input/Output variables used
     * @param mint PublicKey of mintAccount : Token mint account
     * @param recipientToken PublicKey of owner : Owner of the new account
     * 
     */

    // Signature
    let mintSignature : string

    // Accounts
    let walletOwner : PublicKey
    let mint : PublicKey | string | null

    // Enable reactivity and set walletOwner
    $: walletOwner = $walletStore.publicKey as PublicKey

</script>



<!-- HTML + SVELTE -->
<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">

    <div class="grid grid-cols-1 space-y-8">

        <!-- Create Mint -->
        <div>
            <!-- User Input -->
            <p>SPL Token:</p>
            <button class="p-2 bg-primary rounded-md " on:click={() => createMintAccount(walletOwner)}>
                Create Mint
            </button>

            <!-- Response Output -->
            {#await mintSignature}
            <p>waiting for Mint</p>
            {:then value}
                {#if value}
                    <p>SUCCESS -> Create Mint txSignature: 
                        <a class="hover:text-primary" href='https://solana.fm/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
                    </p>
                {/if}
            {:catch error}
                <p>Error</p>
            {/await}
        </div>

    </div>
</section>