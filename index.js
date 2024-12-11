// Import required Hedera SDK classes
const {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    Hbar,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    TokenAssociateTransaction,
    TransferTransaction,
    AccountBalanceQuery,
} = require("@hashgraph/sdk");
require("dotenv").config();

// Asynchronous function to set up the environment and create a new account
async function environmentSetup() {
    // Retrieve your Hedera testnet account ID and private key from .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    // Validate presence of environment variables
    if (!myAccountId || !myPrivateKey) {
        throw new Error("Environment Variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present.");
    }

    // Create a Hedera Testnet client
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    // Generate new private and public keys for a new account
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    // Create a new account with an initial balance of 1,000 tinybars
    const newAccount = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);

    const receipt = await newAccount.getReceipt(client);
    const newAccountId = receipt.accountId;
    console.log("New account ID:", newAccountId.toString());

    const supplyKey = PrivateKey.generate();

    // Create fungible token
    let tokenCreateTx = await new TokenCreateTransaction()
        .setTokenName("USD Token")
        .setTokenSymbol("USDT")
        .setTokenType(TokenType.FungibleCommon)
        .setDecimals(2)
        .setInitialSupply(10000)
        .setTreasuryAccountId(myAccountId)
        .setSupplyType(TokenSupplyType.Infinite)
        .setSupplyKey(supplyKey)
        .freezeWith(client);

    let tokenCreateSign = await tokenCreateTx.sign(PrivateKey.fromString(myPrivateKey));
    let tokenCreateSubmit = await tokenCreateSign.execute(client);
    let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

    const tokenId = tokenCreateRx.tokenId;
    console.log("Created token ID:", tokenId.toString());

    // Associate token with the new account
    try {
        const associateTx = await new TokenAssociateTransaction()
            .setAccountId(newAccountId)
            .setTokenIds([tokenId])
            .freezeWith(client)
            .sign(newAccountPrivateKey);

        const associateSubmit = await associateTx.execute(client);
        const associateRx = await associateSubmit.getReceipt(client);
        console.log("Token association status:", associateRx.status.toString());
    } catch (error) {
        if (error.status && error.status.toString() === "TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT") {
            console.log("Token is already associated with the account.");
        } else {
            throw error;
        }
    }

    // Perform a token transfer from treasury to the new account
    console.log("\n--- Balances before transfer ---");
    await logBalances(client, myAccountId, newAccountId, tokenId);

    const transferTx = await new TransferTransaction()
        .addTokenTransfer(tokenId, myAccountId, -10) // Treasury sends 10 units
        .addTokenTransfer(tokenId, newAccountId, 10) // New account receives 10 units
        .freezeWith(client)
        .sign(PrivateKey.fromString(myPrivateKey));

    const transferSubmit = await transferTx.execute(client);
    const transferRx = await transferSubmit.getReceipt(client);
    console.log("Token transfer status:", transferRx.status.toString());

    console.log("\n--- Balances after transfer ---");
    await logBalances(client, myAccountId, newAccountId, tokenId);
}

// Helper function to log balances
async function logBalances(client, treasuryId, newAccountId, tokenId) {
    const treasuryBalance = await new AccountBalanceQuery().setAccountId(treasuryId).execute(client);
    const newAccountBalance = await new AccountBalanceQuery().setAccountId(newAccountId).execute(client);

    console.log(
        `Treasury balance: ${treasuryBalance.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`
    );
    console.log(
        `New account balance: ${newAccountBalance.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`
    );
}

// Run the environment setup function
environmentSetup();
