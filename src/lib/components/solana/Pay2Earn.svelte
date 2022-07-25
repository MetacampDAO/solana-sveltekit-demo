<script lang=ts>	
	import {
		Connection,
		PublicKey,
		Transaction
	} from '@solana/web3.js'
	import { walletStore } from "@svelte-on-solana/wallet-adapter-core";	
	import { cluster, connectedCluster } from "$lib/stores";
	import { SolendAction, SolendMarket, SolendObligation } from '@solendprotocol/solend-sdk'
	import { createTransferInstruction, getAssociatedTokenAddress, TokenInvalidInstructionKeysError } from '@solana/spl-token';
	import BN from 'bn.js'


	async function payAndDepositToken(connection: Connection, tokens: any, tokenTo: PublicKey, tokenOwner: PublicKey, tokenPrice: number){

		// Get Token Address
		tokenFrom = await getAssociatedTokenAddress(new PublicKey(tokens.usdcMint), tokenOwner)

		tokenStaked = Math.ceil(tokenPrice) - tokenPrice

		// Create Solend deposit transaction/instruction
		var solendAction = await SolendAction.buildDepositTxns(
			connection,
			String(tokenStaked*10**decimal),
			tokens.usdcSymbol,
			tokenOwner,
			"production"
		);


		// Create token transfer instruction
		var transferIx = createTransferInstruction(tokenFrom, tokenTo, tokenOwner, tokenPrice*10**decimal)


		// Pay and deposit transaction
		var lastValidBlockHeight = (await connection.getLatestBlockhash()).lastValidBlockHeight
		var blockhash = (await connection.getLatestBlockhash()).blockhash
		var transaction = new Transaction(
            {
                feePayer: tokenOwner,
                blockhash: blockhash,
                lastValidBlockHeight: lastValidBlockHeight
            }
        )  
		transaction.add(
			transferIx,
			solendAction.lendingIxs[0]
		)

		tokenDepositSignature = await $walletStore.sendTransaction(transaction, connection); // sendTransaction from wallet adapter or custom

	}

	async function withdrawtoken(connection: Connection, tokens: any, tokenOwner: PublicKey){

		// Get current total deposit value
		var market = await SolendMarket.initialize(
			connection,
		)
		obligation = await market.fetchObligationByWallet(
			tokenOwner
		)
		var alltoken = obligation?.deposits.find(position => position.mintAddress == tokens.usdcMint)?.amount.toString()

		// Create Solend withdrawal transaction/instruction
		var solendAction = await SolendAction.buildWithdrawTxns(
			connection,
			alltoken as string,
			tokens.usdcSymbol,
			tokenOwner,
			"production"
		);

		// Withdrawal transaction
		var transaction = new Transaction()
		transaction.add(
			solendAction.setupIxs[0],
			solendAction.setupIxs[1],
			solendAction.lendingIxs[0]
		)

		tokenWithdrawSignature = await $walletStore.sendTransaction(transaction, connection); // sendTransaction from wallet adapter or custom

	}


	// Input/Output variables used
	const tokens = {
		usdcMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
		usdcSymbol: 'USDC',
	}

	let connection : Connection = $connectedCluster
	let tokenWithdrawSignature: string;
	let decimal : number = 6
	let tokenDepositSignature : string
	let tokenFrom : PublicKey
	let tokenTo: PublicKey = new PublicKey('4hRedAZFcZrQ9ro434SJYCk1eREhHJdjnAKwcHxBNBWq')
	let tokenOwner : PublicKey = $walletStore.publicKey as PublicKey
	let tokenPrice : number | string | undefined = 0.5
	let tokenStaked : number
	let obligation : SolendObligation | null

	// Enable Reactivity, "Source" automatically set to connected wallet
	$: tokenOwner = $walletStore.publicKey as PublicKey
	$: tokenStaked = Math.ceil(Number(tokenPrice)) - Number(tokenPrice)
	$: connection = $connectedCluster


</script>

<!-- HTML + SVELTE -->
<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">

	<!-- Transfer & Airdrop Token -->
	<div class="grid grid-cols-1 space-y-4">

		<!-- User Input -->
		<div>
			<label for="Price">Price (token):</label>
			<input class="text-black w-full" bind:value={tokenPrice}>
		</div>

		<!-- User Buttons -->
		<div>
			<button class="p-2 bg-primary rounded-md" on:click={() => payAndDepositToken(connection, tokens, tokenTo, tokenOwner, Number(tokenPrice))}>
				Pay {tokenPrice} USDC
				{#if (tokenStaked !== 0)}
					 & Deposit {Math.floor(tokenStaked * 100)/100} USDC
				{/if}
			</button>
		</div>
		<div>
			<button class="p-2 bg-primary rounded-md" on:click={() => withdrawtoken(connection, tokens, tokenOwner)}>
				Withdraw All
			</button>
		</div>

	</div>

	<div>

		<!-- Success messages -->
		{#await tokenDepositSignature then value}
			{#if value}
			<p>SUCCESS -> Deposit Signature: 
				<a class="hover:text-primary" href='https://solana.fm/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
			</p>
			{/if}
		{/await}

		{#await tokenWithdrawSignature then value}
		{#if value}
		<p>SUCCESS -> Withdraw Signature: 
			<a class="hover:text-primary" href='https://solana.fm/tx/{value}?cluster={$cluster}' target="_blank" rel="noopener noreferrer">{value}</a>
		</p>
		{/if}
		{/await}

	</div>

</section>