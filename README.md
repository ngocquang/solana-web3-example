# Solana Example Web3

```shell
node src/get_account_info.js
node src/send_sol.js
```

## Deploy

```shell
# Airdrop SOL to my self
solana airdrop 1

# Generate Program Execute Account
solana-keygen new -o env/solana_memo_program.json
solana-keygen pubkey env/solana_memo_program.json
# 367aKvb3yFmmmJC6HP9yh9eLQofDoD7zeaHBUEmzL5Ys

# Transfer SOL to Program Execute Account
solana transfer --from /Users/lap14830-local/Solana/walletsol/my_solana_wallet.json 367aKvb3yFmmmJC6HP9yh9eLQofDoD7zeaHBUEmzL5Ys 1 --allow-unfunded-recipient --fee-payer /Users/lap14830-local/Solana/walletsol/my_solana_wallet.json

# Deploy program with keypair
solana program deploy contract/solana-json.so -k env/solana_memo_program.json
#Program Id: BVKxbBDR8snHpEGPVA2gyhBiSA479vPMbgN9A387Cmjo

# Show info program
solana program show BVKxbBDR8snHpEGPVA2gyhBiSA479vPMbgN9A387Cmjo

# Create Data Account for program
node src/add_account_data_to_program.js
# ADJDQ9yceUEhUH3H6iHCyFEcVF926eumb1Qjs78sxob3

# Run program
node src/run_program.js

# Allocate Data Account
node src/allocate_account_data.js

```
