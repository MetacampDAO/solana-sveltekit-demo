import * as dotenv from 'dotenv'
import { clusterApiUrl, Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { createTransferCheckedInstruction, getAccount, getAssociatedTokenAddress, getMint } from '@solana/spl-token';
import { connectedCluster } from '$lib/stores';
import { createSplTransferIx } from '$lib/ts/createSplTransferIx'

dotenv.config()

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {

  const label = "Metacamp";
  const icon = 'https://uploads-ssl.webflow.com/628b99344f25667e77da83cf/62c3a95fc598e35cf796a1f2_Asset%209%403x.png'

  return {
    status: 200,
    headers: {
    },
    body: {
      label,
      icon,
      splToken,
      MERCHANT_WALLET
    }
  };
}


const splToken = new PublicKey(process.env.USDC_MINT as String);
const MERCHANT_WALLET = new PublicKey(process.env.MERCHANT_WALLET as String);
const connection = new Connection(`${process.env.HTTPS_RPC_ENDPOINT}`, 'confirmed')

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {

  // Account provided in the transaction request body by the wallet.
  const accountField = request.body?.account;
  if (!accountField) throw new Error('missing account');

  const sender = new PublicKey(accountField);

  // create spl transfer instruction
  const splTransferIx = await createSplTransferIx(sender, connection, splToken, MERCHANT_WALLET);

  console.log(splTransferIx)

  // create the transaction
  const latestBlockhash = await connection.getLatestBlockhash()
  const transaction = new Transaction(
    {
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      feePayer: MERCHANT_WALLET
    }
  );

  // add the instruction to the transaction
  transaction.add(splTransferIx);
  transaction.partialSign( keypair );


  // Serialize and return the unsigned transaction.
  const serializedTransaction = transaction.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
  });

  const base64Transaction = serializedTransaction.toString('base64');
  const message = 'Thank you for your purchase of ExiledApe #518';

  return { status: 201 };
}
