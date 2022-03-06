const web3 = require('@solana/web3.js');
require('dotenv').config({ path: './env/.env' });
const PRIVATE_KEY = JSON.parse(process.env.PRIVATE_KEY);
const PRIVATE_KEY_2 = JSON.parse(process.env.PRIVATE_KEY_2);

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

  // Generate a new random public key
  const from = web3.Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY));

  var airdropSignature = await connection.requestAirdrop(
    from.publicKey,
    web3.LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);

  // Generate a new random public key
  // var to = web3.Keypair.generate();
  const to = web3.Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY_2));

  // Add transfer instruction to transaction
  var transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to.publicKey,
      lamports: web3.LAMPORTS_PER_SOL / 100,
    }),
  );

  // Sign transaction, broadcast, and confirm
  var signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [from],
  );
  console.log('SIGNATURE', signature);
})();