const web3 = require('@solana/web3.js');
require('dotenv').config({ path: './env/.env' });
const BufferLayout = require('buffer-layout');

const PRIVATE_KEY = JSON.parse(process.env.PRIVATE_KEY);

(async () => {
  if (!process.env.PRIVATE_KEY) {
    console.log('Missing private key');
    process.exit(1);
  }

  // Connect to cluster
  var connection = new web3.Connection(
    web3.clusterApiUrl('testnet'),
    'confirmed',
  );

  // Generate a new wallet keypair and airdrop SOL
  const wallet = web3.Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY));

  const app = {
    programId: new web3.PublicKey('BVKxbBDR8snHpEGPVA2gyhBiSA479vPMbgN9A387Cmjo'),
    appAccount: {
      publicKey: new web3.PublicKey('ADJDQ9yceUEhUH3H6iHCyFEcVF926eumb1Qjs78sxob3')
    }
  }

  const jsonString = '{"abc":34123}';

  const paddedMsg = jsonString.padEnd(1000);
  const buffer = Buffer.from(paddedMsg, 'utf8');
  const instruction = new web3.TransactionInstruction({
    keys: [{
      pubkey: app.appAccount.publicKey,
      isSigner: false,
      isWritable: true
    }],
    programId: app.programId,
    data: buffer,
  });
  const confirmation = await web3.sendAndConfirmTransaction(
    connection,
    new web3.Transaction().add(instruction),
    [wallet], {
      commitment: 'singleGossip',
      preflightCommitment: 'singleGossip',
    },
  );

  console.log("Confirmation",confirmation);

  const accountInfo = await connection.getAccountInfo(app.appAccount.publicKey);
  const result = Buffer.from(accountInfo.data).toString().slice(4,1000).trim(); //
  console.log("Result",result);

})();