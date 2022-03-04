const web3 = require('@solana/web3.js');
const {struct, u32, ns64} = require("@solana/buffer-layout");

path: (process.argv.includes('mainnet')) ? '../env/.env.mainnet' : '../env/.env'
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
  let dataPublicKey = new web3.PublicKey('ADJDQ9yceUEhUH3H6iHCyFEcVF926eumb1Qjs78sxob3');
  const programId = new web3.PublicKey('BVKxbBDR8snHpEGPVA2gyhBiSA479vPMbgN9A387Cmjo');

  let allocateTransaction = new web3.Transaction({
    feePayer: payerAccount.publicKey
  });
  let keys = [{pubkey: dataPublicKey, isSigner: false, isWritable: true}];
  let params = { space: 10000 };

  let allocateStruct = {
    index: 8,
    layout: struct([
      u32('instruction'),
      ns64('space'),
    ])
  };

  let data = Buffer.alloc(allocateStruct.layout.span);
  let layoutFields = Object.assign({instruction: allocateStruct.index}, params);
  allocateStruct.layout.encode(layoutFields, data);

  allocateTransaction.add(new web3.TransactionInstruction({
    keys,
    programId,
    data,
  }));

  const confirmation = await web3.sendAndConfirmTransaction(connection, allocateTransaction, [payerAccount]);
  console.log("Confirmation",confirmation);

})();