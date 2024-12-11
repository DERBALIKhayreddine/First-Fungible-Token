# Fungible Token Creation and Transfer on Hedera

## Overview
This project demonstrates how to create, associate, and transfer a fungible token on the Hedera network using JavaScript and the Hedera SDK. The example is designed for developers who want to experiment with tokenization on the Hedera Testnet.

### Key Features:
1. **Account Creation**: Creates a new Hedera account with a small initial balance.
2. **Token Creation**: Generates a fungible token with specified properties such as name, symbol, initial supply, and treasury account.
3. **Token Association**: Associates the newly created token with a specific account.
4. **Token Transfer**: Transfers tokens from the treasury account to the newly created account.
5. **Balance Checking**: Logs account balances before and after token transfers to validate operations.

## Prerequisites
- **Node.js**: Ensure Node.js (v16 or higher) is installed on your system.
- **Hedera Testnet Account**: Obtain an account ID and private key from the Hedera Portal ([https://portal.hedera.com/](https://portal.hedera.com/)).
- **Environment Variables**: Create a `.env` file with the following keys:
  ```env
  MY_ACCOUNT_ID=<your_account_id>
  MY_PRIVATE_KEY=<your_private_key>
  ```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/DERBALIKhayreddine/First-Fungible-Token.git
   cd First-Fungible-Token
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Code Walkthrough

### 1. Account Creation
The script generates a new private/public key pair and creates a new account on the Hedera Testnet. An initial balance of 1,000 tinybars is allocated to the account.

### 2. Token Creation
Using the `TokenCreateTransaction` class, a fungible token is created with the following properties:
- **Token Name**: USD Token
- **Token Symbol**: USDT
- **Decimals**: 2
- **Initial Supply**: 10,000 units
- **Supply Type**: Infinite supply
- **Treasury Account**: The operator's account ID

### 3. Token Association
The script associates the newly created token with the newly generated account. It checks if the account is already associated and handles the `TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT` error gracefully.

### 4. Token Transfer
Transfers 10 units of the token from the treasury account to the new account using the `TransferTransaction` class.

### 5. Balance Checks
Balances for both the treasury and the newly created account are logged before and after the transfer.

## Usage
Run the script using the following command:
```bash
node index.js
```

## Example Output
The script outputs the following:
1. The new account ID.
2. The created token ID.
3. Status of the token association.
4. Account balances before and after the token transfer.

### Sample Output:
```
New account ID: 0.0.1234567
Created token ID: 0.0.7654321
Token association status: SUCCESS

--- Balances before transfer ---
Treasury balance: 10000 units of token ID 0.0.7654321
New account balance: 0 units of token ID 0.0.7654321

Token transfer status: SUCCESS

--- Balances after transfer ---
Treasury balance: 9990 units of token ID 0.0.7654321
New account balance: 10 units of token ID 0.0.7654321
```

## Notes
- Ensure you handle exceptions for all transactions to account for network or configuration errors.
- Tokens created on the Hedera Testnet are not persistent and will be reset periodically.

