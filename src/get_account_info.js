const web3 = require('@solana/web3.js');
require('dotenv').config({ path: './env/.env' });
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
  // var wallet = web3.Keypair.generate();
  const payerAccount = web3.Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY));

  var airdropSignature = await connection.requestAirdrop(
    payerAccount.publicKey,
    web3.LAMPORTS_PER_SOL,
  );

  //wait for airdrop confirmation
  await connection.confirmTransaction(airdropSignature);

  // get account info
  // account data is bytecode that needs to be deserialized
  // serialization and deserialization is program specific
  let account = await connection.getAccountInfo(payerAccount.publicKey);
  console.log(account);




})();