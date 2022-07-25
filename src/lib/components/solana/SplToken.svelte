<script lang=ts>
    import {
        PublicKey,
        Transaction,
        Keypair,
        SystemProgram,
        Connection,
        type Signer
    } from '@solana/web3.js'

    // Create Instructions 
    import { 
        createInitializeMintInstruction,
        createAssociatedTokenAccountInstruction,
        createMintToInstruction,
        getMinimumBalanceForRentExemptMint,
        getAccount,
        createTransferInstruction,
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
    async function createMintAccount(wallet : any, connection : Connection) {

        // Create Mint transaction
        var mintKeypair = Keypair.generate() as Signer
        var lamports = await getMinimumBalanceForRentExemptMint(connection)
        var latestBlockHash = await connection.getLatestBlockhash();
        var transaction = new Transaction(
            {
                feePayer: wallet.publicKey as PublicKey,
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
            }
        )  // Create new transaction for creating Mint Account
        transaction.add(  
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey as PublicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports: lamports,
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMintInstruction(
                mintKeypair.publicKey as PublicKey, // mintAccount
                9 as number, // decimals
                wallet.publicKey as PublicKey, // mintAuthority
                wallet.publicKey as PublicKey, // freezeAuthority
                TOKEN_PROGRAM_ID as PublicKey
            )        
        )

        transaction.partialSign( mintKeypair )

        // Sign with wallet and send Transaction
        mintSignature = await $walletStore.sendTransaction( transaction, connection)

        return mint = mintKeypair.publicKey.toString()
    }




    // Create Associated Token Account
    async function createTokenAccount(wallet : any, connection : Connection, mint: PublicKey | string, tokenOwner : PublicKey | string) {

        if (typeof mint == 'string') {
            mint = new PublicKey(mint)
        }
        if (typeof tokenOwner == 'string') {
            tokenOwner = new PublicKey(tokenOwner)
        }

        // Create New Transaction
        let transaction = new Transaction

        // Add createAssociatedTokenAccountInstruction
        var tempAssociatedToken = await getAssociatedTokenAddress(
            mint as PublicKey, 
            tokenOwner as PublicKey, 
            false, // false : Allow the owner account to be a PDA (Program Derived Address)
            TOKEN_PROGRAM_ID, // programId : SPL Token program account
            ASSOCIATED_TOKEN_PROGRAM_ID // associatedTokenProgramId : SPL Associated Token program account
            );
        transaction.add(
            createAssociatedTokenAccountInstruction(
                $walletStore.publicKey as PublicKey, // PublicKey of payer
                tempAssociatedToken, // PublicKey of associatedToken
                tokenOwner as PublicKey, // PublicKey of owner
                mint as PublicKey // PublicKey of mintAccount 
            )
        )
        // Sign with wallet and send Transaction
        createTokenAccountSignature = await $walletStore.sendTransaction(transaction, connection)
        associatedToken = tempAssociatedToken

		return createTokenAccountSignature
	}



    // Mint to Token Account
    async function mintTokenAccount(wallet : any, connection: Connection, mint : PublicKey | string, associatedToken: PublicKey | string, tokenAmount: number ) {

        if (typeof mint == 'string') {
            mint = new PublicKey(mint)
        }
        if (typeof associatedToken == 'string') {
            associatedToken = new PublicKey(associatedToken)
        }

        // Create New Transaction
        let transaction = new Transaction

        // Add createMintToInstruction
        transaction.add(
            createMintToInstruction(
                mint as PublicKey, // PublicKey of mintAccount 
                associatedToken as PublicKey, // PublicKey of recipient token account 
                wallet.publicKey as PublicKey, // PublicKey of mintAuthority 
                tokenAmount * 10**tokenDecimal as number // number
            )
        )

        // Sign with wallet and send Transaction
        mintTokenSignature = await $walletStore.sendTransaction(transaction, connection)
        console.log(mintTokenSignature)


		return mintTokenSignature
	}


        // Transfer Token
    async function transferToken(wallet : any, connection: Connection, mint: PublicKey | string, tokenOwner : PublicKey | string, tokenDestination: PublicKey | string, tokenAmount: number, tokenDecimal?: number ) {

        if (typeof mint == 'string') {
            mint = new PublicKey(mint)
        }
        if (typeof tokenDestination == 'string') {
            tokenDestination = new PublicKey(tokenDestination)
        }
        if (typeof tokenOwner == 'string') {
            tokenOwner = new PublicKey(tokenOwner)
        }

        // Get ATA
        var tokenSource = await getAssociatedTokenAddress(
            mint as PublicKey, 
            tokenOwner as PublicKey, 
            false, // false : Allow the owner account to be a PDA (Program Derived Address)
            TOKEN_PROGRAM_ID, // programId : SPL Token program account
            ASSOCIATED_TOKEN_PROGRAM_ID // associatedTokenProgramId : SPL Associated Token program account
        );

        // Create New Transaction
        let transaction = new Transaction

        // Add createMintToInstruction
        transaction.add(
            createTransferInstruction(
                tokenSource as PublicKey,
                tokenDestination as PublicKey, 
                tokenOwner as PublicKey,
                Number(tokenAmount)*10**(tokenDecimal? tokenDecimal : 9) as number // number
            )
        )

        // Sign with wallet and send Transaction
        transferTokenSignature = await wallet.sendTransaction(transaction, connection)
        console.log(transferTokenSignature)


        return transferTokenSignature
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
    let wallet
    let mint : PublicKey | string | null = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
    let tokenDecimal : number = 6
    let tokenAmount : number = 1000
    let tokenOwner : PublicKey | string | null
    $: tokenOwner = $walletStore.publicKey
    let tokenSource : PublicKey | string | null
    let tokenDestination : PublicKey | string | null
    let associatedToken : PublicKey | string | null
    let mintAuthority : PublicKey | string | null
    $: mintAuthority = $walletStore.publicKey
    let freezeAuthority : PublicKey | string | null
    $: freezeAuthority = $walletStore.publicKey


</script>



<!-- HTML + SVELTE -->
<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">

    <div class="grid grid-cols-1 space-y-8">

        <!-- Create Mint -->
        <div>
            <!-- User Input -->
            <p>SPL Token:</p>
            <button class="p-2 bg-primary rounded-md " on:click={() => createMintAccount($walletStore, $connectedCluster)}>
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
                <button class="p-2 bg-primary rounded-md " on:click={() => createTokenAccount($walletStore, $connectedCluster, mint, tokenOwner)}>
                    Create Token Account
                </button>
            </div>

            <!-- Response Output -->
            <div>
                {#await createTokenAccountSignature}
                <p>waiting for Token Account</p>
                {:then value}
                    {#if value}
                        <p>SUCCESS -> Create Token Account Signature: 
                            <a class="hover:text-primary" href='https://solana.fm/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
                        </p>
                    {/if}
                {:catch error}
                    <p>Error</p>
                {/await}
            </div>

        </div>

        <!-- Mint to Associated Token Account -->
        <div>
            <!-- User Input -->
            <div>
                <label for="AssociatedTokenAccount">Associated Token Account:</label>
                <input class="text-black w-full mb-4" bind:value={associatedToken} placeholder="Enter recipient associated token account address ...">
                <label for="MintAmount">Mint Amount:</label>
                <input class="text-black w-full mb-4" bind:value={tokenAmount} placeholder="Enter mint amount...">
                <button class="p-2 bg-primary rounded-md " on:click={() => mintTokenAccount($walletStore, $connectedCluster, mint, associatedToken, tokenAmount)}>
                    Mint Token to Token Account
                </button>
            </div>

            <!-- Response Output -->

            <div>
                {#await mintTokenSignature}
                <p>waiting for minting to Token Account</p>
                {:then value}
                    {#if value}
                        <p>SUCCESS -> Mint Token Signature: 
                            <a class="hover:text-primary" href='https://solana.fm/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
                        </p>
                    {/if}
                {:catch error}
                    <p>Error</p>
                {/await}
            </div>
        </div>


        <!-- Transfer Token -->
        <div>
            <!-- User Input -->
            <div>
                <label for="DestinationAccount">Destination Token Account:</label>
                <input class="text-black w-full mb-4" bind:value={tokenDestination} placeholder="Enter destination token account address ...">
                <label for="TransferAmount">Transfer Amount:</label>
                <input class="text-black w-full mb-4" bind:value={tokenAmount} placeholder="Enter token amount...">
                <button class="p-2 bg-primary rounded-md " on:click={() => transferToken($walletStore, $connectedCluster, mint, tokenOwner, tokenDestination, tokenAmount, tokenDecimal)}>
                    Transfer Token
                </button>
            </div>

            <!-- Response Output -->
            <div>
                {#await transferTokenSignature}
                <p>waiting for Token Transfer</p>
                {:then value}
                    {#if value}
                        <p>SUCCESS -> Transfer Token Account Signature: 
                            <a class="hover:text-primary" href='https://solana.fm/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
                        </p>
                    {/if}
                {:catch error}
                    <p>Error</p>
                {/await}
            </div>
        </div>

    </div>
</section>