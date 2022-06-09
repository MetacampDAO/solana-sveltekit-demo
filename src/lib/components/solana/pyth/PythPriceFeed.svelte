<script lang="ts">

    import { PythHttpClient, PriceStatus } from '@pythnetwork/client';
    import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
    import type { Cluster, Commitment, ConnectionConfig } from '@solana/web3.js';

    export async function runQuery(): Promise<any> {

        // List of Pyth Program Key from clusters
        const clusterToPythProgramKey: Record<Cluster, string> = {
            'mainnet-beta': 'FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH',
            'devnet': 'gSbePebfvPy7tRqimPoVecS2UsBvYv46ynrzWocc92s',
            'testnet': '8tfDNiaEyrV6Q1U4DEXrEigs9DoDtkugzFbybENEbCDz',
        }

        // Create new connection with cluster and config 
        const cluster = 'mainnet-beta'
        const config : Commitment | ConnectionConfig | undefined = 'processed';
        const network : string = clusterApiUrl(cluster); // Retrieves the RPC API URL for the specified cluster
        const connection = new Connection(network, config);

        // Create new connection to Pyth and get data
        const pythPublicKey : PublicKey = new PublicKey(clusterToPythProgramKey[cluster]) // Create Public Key from string
        const pythClient = new PythHttpClient(connection, pythPublicKey); // Create client to connect to Pyth Program
        const data = await pythClient.getData(); // Get data from Pyth

        // Iterate through each asset and show symbol, price, confidence interval, and status
        for (let symbol of data.symbols) {
            const price = data.productPrice.get(symbol)!;
            // // Sample output:
            // // Crypto.SRM/USD: $8.68725 ±$0.0131 Status: Trading
            // console.log(`${symbol}: $${price.price} \xB1$${price.confidence} Status: ${PriceStatus[price.status]}`)
        }

        // // Show each variable in response
        // console.log("assetType: ", data.assetTypes) // Shows list of all available Asset Types
        // console.log("symbols: ", data.symbols) // Shows list of all available Symbols
        // console.log("productFromSymbol: ", data.productFromSymbol.get('Crypto.BTC/USD')) // Get Product Account based on Symbol
        // console.log("productPrice: ", data.productPrice.get('Crypto.BTC/USD')) // Get Price Account based on Symbol

        return data;
    }


    let promise = runQuery()


    function updateAssets () {
        promise = runQuery();
    }


</script>

<section class="mt-16">
    <div class="flex m-4 justify-center">
        <button class="p-2 bg-primary rounded-md" on:click={updateAssets}>
        Update Assets
        </button>
    </div>
    <table class="table-fixed">
        <thead>
        <tr>
            <th>#</th>
            <th>Asset Type</th>
            <th>Product</th>
            <th>Price</th>
            <th>Confidence</th>
            <th>Status</th>
            <th>Publisher #</th>
            <th>Product Account Key</th>
            <th>Price Account Key</th>
        </tr>
        </thead>
        <tbody>
            {#await promise}
            <p>...waiting</p>
            {:then data}
                {#each data.symbols as symbol, i}
                <tr class="m-4">
                    <td>{i+1}</td>
                    <td>{data.productFromSymbol.get(symbol).asset_type}</td>
                    <td>{data.productFromSymbol.get(symbol).description}</td>
                    <td>{data.productPrice.get(symbol).price}</td>
                    <td>±{data.productPrice.get(symbol).confidence}</td>
                    <td>{PriceStatus[data.productPrice.get(symbol).status]}</td>
                    <td>{data.productPrice.get(symbol).numQuoters}</td>
                    <td><a class="hover:text-primary" href='https://solscan.io/account/{data.productPrice.get(symbol).productAccountKey.toString()}' target="_blank" rel="noopener noreferrer">{data.productPrice.get(symbol).productAccountKey.toString()}</a></td>
                    <td><a class="hover:text-primary" href='https://solscan.io/account/{data.productFromSymbol.get(symbol).price_account}' target="_blank" rel="noopener noreferrer">{data.productFromSymbol.get(symbol).price_account}</a></td>
                </tr>
                {/each}
            {:catch error}
                error
            {/await}
        </tbody>
  </table>
</section>