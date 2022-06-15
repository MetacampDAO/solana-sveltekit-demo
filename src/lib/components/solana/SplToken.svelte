<script lang=ts>
    import * as sol from '@solana/web3.js'

    // Create Instructions 
    import { 
        createInitializeMintInstruction,
        createAssociatedTokenAccountInstruction,
        createMintToInstruction,
        getMinimumBalanceForRentExemptMint,
        getAccount,
        getAssociatedTokenAddress,
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID, 
        MINT_SIZE,
    } from '@solana/spl-token'

    // Import Wallet
	import { walletStore } from "@svelte-on-solana/wallet-adapter-core";

    // Import cluster environment
	import { cluster, connectedCluster } from "$lib/stores";
    import type { SendTransactionOptions } from '@solana/wallet-adapter-base';




    // Create Mint
    async function createMintAccount() {

        // Create Mint transaction
        var mintKeypair = sol.Keypair.generate() as sol.Signer
        var lamports = await getMinimumBalanceForRentExemptMint($connectedCluster)
        var latestBlockHash = await $connectedCluster.getLatestBlockhash();
        var transaction = new sol.Transaction(
            {
                feePayer: $walletStore.publicKey as sol.PublicKey,
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
            }
        )  // Create new transaction for creating Mint Account
        transaction.add(  
            sol.SystemProgram.createAccount({
                fromPubkey: $walletStore.publicKey as sol.PublicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports: lamports,
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMintInstruction(
                mintKeypair.publicKey as sol.PublicKey, // mintAccount
                9 as number, // decimals
                $walletStore.publicKey as sol.PublicKey, // mintAuthority
                $walletStore.publicKey as sol.PublicKey, // freezeAuthority
                TOKEN_PROGRAM_ID as sol.PublicKey
            )        
        )

        transaction.partialSign( mintKeypair )

        // Sign with wallet and send Transaction
        mintSignature = await $walletStore.sendTransaction( transaction, $connectedCluster)

        return mint = mintKeypair.publicKey.toString()
    }




    // Create Associated Token Account
    async function createTokenAccount() {

        if (typeof mint == 'string') {
            mint = new sol.PublicKey(mint)
        }
        if (typeof tokenOwner == 'string') {
            tokenOwner = new sol.PublicKey(tokenOwner)
        }

        // Create New Transaction
        let transaction = new sol.Transaction

        // Add createAssociatedTokenAccountInstruction
        associatedToken = await getAssociatedTokenAddress(
            mint as sol.PublicKey, 
            tokenOwner as sol.PublicKey, 
            false, // false : Allow the owner account to be a PDA (Program Derived Address)
            TOKEN_PROGRAM_ID, // programId : SPL Token program account
            ASSOCIATED_TOKEN_PROGRAM_ID // associatedTokenProgramId : SPL Associated Token program account
            );
        transaction.add(
            createAssociatedTokenAccountInstruction(
                $walletStore.publicKey as sol.PublicKey, // PublicKey of payer
                associatedToken, // PublicKey of associatedToken
                tokenOwner as sol.PublicKey, // PublicKey of owner
                mint as sol.PublicKey // PublicKey of mintAccount 
            )
        )
        // Sign with wallet and send Transaction
        createTokenAccountSignature = await $walletStore.sendTransaction(transaction, $connectedCluster)
		return createTokenAccountSignature
	}



    // Mint to Token Account
    async function mintTokenAccount() {

        if (typeof mint == 'string') {
            mint = new sol.PublicKey(mint)
        }
        if (typeof associatedToken == 'string') {
            associatedToken = new sol.PublicKey(associatedToken)
        }

        // Create New Transaction
        let transaction = new sol.Transaction

        // Add createMintToInstruction
        transaction.add(
            createMintToInstruction(
                mint as sol.PublicKey, // PublicKey of mintAccount 
                associatedToken as sol.PublicKey, // PublicKey of recipient token account 
                $walletStore.publicKey as sol.PublicKey, // PublicKey of mintAuthority 
                mintAmount * 10**9 as number // number
            )
        )

        // Sign with wallet and send Transaction
        mintTokenSignature = await $walletStore.sendTransaction(transaction, $connectedCluster)
        console.log(mintTokenSignature)


		return mintTokenSignature
	}




    /** Input/Output variables used
     * @param mint PublicKey of mintAccount : Token mint account
     * @param recipientToken PublicKey of owner : Owner of the new account
     * 
     */

    // Signatures
    let mintSignature : string
    let createTokenAccountSignature : string
    let mintTokenSignature : string
    let transferTokenSignature : string

    // Accounts
    let mint : sol.PublicKey | string | null
    let mintAmount : number = 1000
    let tokenOwner : sol.PublicKey | string | null
    let associatedToken : sol.PublicKey | string | null
    let mintAuthority : sol.PublicKey | string | null
    $: mintAuthority = $walletStore.publicKey
    let freezeAuthority : sol.PublicKey | string | null
    $: freezeAuthority = $walletStore.publicKey


</script>



<!-- HTML + SVELTE -->
<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">

    <div class="grid grid-cols-1 space-y-8">

        <!-- Create Mint -->
        <div>
            <!-- User Input -->
            <p>SPL Token:</p>
            <button class="p-2 bg-primary rounded-md " on:click={createMintAccount}>
                Create Mint
            </button>

            <!-- Response Output -->
            {#await mintSignature}
            <p>waiting for Mint</p>
            {:then value}
                {#if value}
                    <p>Create Mint txSignature: 
                        <a class="hover:text-primary" href='https://solscan.io/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
                    </p>
                {/if}
            {:catch error}
                <p>Error</p>
            {/await}
        </div>

        <!-- Create Associated Token Account -->
        <div class="grid grid-cols-1 space-y-4 ">
            <!-- User Input -->
            <div>
                <label for="Mint">Mint:</label>
                <input class="text-black w-full" bind:value={mint} placeholder="Enter mint account address ...">
            </div>
            <div>
                <label for="TokenAccountOwner">Token Account Owner:</label>
                <input class="text-black w-full" bind:value={tokenOwner} placeholder="Enter recipient token owner address ..."> 
            </div>
            <div>
                <button class="p-2 bg-primary rounded-md " on:click={createTokenAccount}>
                    Create Token Account
                </button>
            </div>
        </div>

        <!-- Mint to Associated Token Account -->
        <div>
            <!-- User Input -->
            <div>
                <label for="AssociatedTokenAccount">Associated Token Account:</label>
                <input class="text-black w-full mb-4" bind:value={associatedToken} placeholder="Enter recipient associated token account address ...">
                <label for="MintAmount">Mint Amount:</label>
                <input class="text-black w-full mb-4" bind:value={mintAmount} placeholder="Enter mint amount...">
                <button class="p-2 bg-primary rounded-md " on:click={mintTokenAccount}>
                    Mint Token to Token Account
                </button>
            </div>

            <!-- Response Output -->
            <div>
                {#await createTokenAccountSignature}
                <p>waiting for Token Account</p>
                {:then value}
                    {#if value}
                        <p>Create Token Account Signature: 
                            <a class="hover:text-primary" href='https://solscan.io/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
                        </p>
                    {/if}
                {:catch error}
                    <p>Error</p>
                {/await}
            </div>
            <div>
                {#await mintTokenSignature}
                <p>waiting for minting to Token Account</p>
                {:then value}
                    {#if value}
                        <p>Mint Token Signature: 
                            <a class="hover:text-primary" href='https://solscan.io/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
                        </p>
                    {/if}
                {:catch error}
                    <p>Error</p>
                {/await}
            </div>
        </div>

    </div>
</section>