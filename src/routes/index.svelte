<script lang=ts>
	
	// Include borsh functionality
	import { serialize, deserialize, deserializeUnchecked } from "borsh";
	import { Buffer } from "buffer";

	import * as sol from '@solana/web3.js';

	async function getAccountInfo() {

		// Connect to cluster
		var connection = new sol.Connection(
			sol.clusterApiUrl('devnet'),
			'confirmed',
		);

		// Generate a new wallet keypair and airdrop SOL
		var wallet = new sol.PublicKey('KRRRgpvA3tq9Upi9L1Svmk18nFtjLTYzeCeqJtWK547')
		//   var airdropSignature = await connection.requestAirdrop(
		//     wallet.publicKey,
		//     sol.LAMPORTS_PER_SOL,
		//   );

		//   //wait for airdrop confirmation
		//   await connection.confirmTransaction(airdropSignature);

		// Flexible class that takes properties and imbues them
		// to the object instance
		class Assignable {
			constructor(properties) {
			Object.keys(properties).map((key) => {
				return (this[key] = properties[key]);
			});
			}
		}

		class AccountData extends Assignable {

			
		}

		const dataSchema = new Map([
			[
			AccountData,
			{
				kind: "struct",
				fields: [
				["initialized", "u8"],
				["tree_length", "u32"],
				["map", { kind: "map", key: "string", value: "string" }],
				],
			},
			],
		]);

		console.log(dataSchema)

		//   // get account info
		//   // account data is bytecode that needs to be deserialized
		//   // serialization and deserialization is program specific
		let account = await connection.getAccountInfo(wallet, "processed");
		// console.log(deserializeUnchecked(dataSchema, AccountData, account.data))
		console.log(account);

		return account

	};

	let promise = getAccountInfo();


</script>

<section>
	<div>
		{#await promise}
			<p>waiting</p>
		{:then account}
			{JSON.stringify(account)}
		{:catch error}
			<p>Error</p>
		{/await}
		
	</div>
</section>