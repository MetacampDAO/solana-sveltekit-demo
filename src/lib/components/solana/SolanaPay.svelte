<script lang=ts>
    import { cluster, connectedCluster } from '$lib/stores'
    import { encodeURL, createQR, parseURL, type Amount } from '@solana/pay'
    import { PublicKey, Transaction } from '@solana/web3.js';
    import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
    import BigNumber from 'bignumber.js';
    import type QRCodeStyling from 'qr-code-styling'
   
    let QR : QRCodeStyling
    let url : URL
    let recipient : string
    let amount : Amount
    let splToken : PublicKey
    let reference
    let label : string
    let message : string = "Thank you very much!"
    let memo : string


    async function displayQR() {

        url =  encodeURL( {
            label: label,
            recipient: new PublicKey(recipient),
            amount: new BigNumber(amount),
            message: message,
            memo: "test" as string,
            // splToken: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
            // reference: new PublicKey(recipient)
        }
        )

        url = new URL(`solana:https://solana.metacamp.so/endpoint/solanapay`)

        QR = createQR(url, 200)
        await QR._getElement()
        QR_str = QR._svg?.outerHTML as string


        return QR
    }

    let QR_str: string


</script>

<section class="bg-dark p-4 space-y-4 w-1/2 rounded-md text-black dark:text-white">
    <div class="grid grid-cols-1 space-y-4">

		<!-- User Input -->
		<div>
			<label for="Product">Product</label>
			<input class="text-black w-full" bind:value={label} placeholder="Specify product">
		</div>
        <div>
			<label for="Amount">Amount</label>
			<input class="text-black w-full" bind:value={amount} placeholder="Specify amount">
		</div>
        <div>
			<label for="Recipient">Recipient</label>
			<input class="text-black w-full" bind:value={recipient} placeholder="Specify recipient">
		</div>
        <div>
            <button class="p-2 bg-primary rounded-md " on:click={() => displayQR()}>
                Create QR
            </button>
            {#if (QR)}
                {@html `${QR_str}`} 
                {url}
            {/if}
        </div>

    </div>

</section>