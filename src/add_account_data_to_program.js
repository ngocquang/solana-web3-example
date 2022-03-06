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
  const payerAccount = web3.Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY));

  // Derive the address of a greeting account from the program so that it's easy to find later.
  const GREETING_SEED = '{}';
  const GREETING_SIZE = 1000;
  const programId = new web3.PublicKey('BVKxbBDR8snHpEGPVA2gyhBiSA479vPMbgN9A387Cmjo');
  greetedPubkey = await web3.PublicKey.createWithSeed(
    payerAccount.publicKey,
    GREETING_SEED,
    programId,
  );

  var greetedAccount = await connection.getAccountInfo(greetedPubkey);
  if (greetedAccount === null) {
    console.log(
      'Creating account',
      greetedPubkey.toBase58(),
      'to say hello to',
    );
    const lamports = await connection.getMinimumBalanceForRentExemption(
      GREETING_SIZE,
    );

    const transaction = new web3.Transaction().add(
      web3.SystemProgram.createAccountWithSeed({
        fromPubkey: payerAccount.publicKey,
        basePubkey: payerAccount.publicKey,
        seed: GREETING_SEED,
        newAccountPubkey: greetedPubkey,
        lamports,
        space: GREETING_SIZE,
        programId,
      }),
    );
    await web3.sendAndConfirmTransaction(connection, transaction, [payerAccount]);
    greetedAccount = await connection.getAccountInfo(greetedPubkey);
  }

  console.log("greetedAccount",greetedAccount);

})();