/*
 *
 * Three steps to be included here
 * 1. Prepare Transaction
 * 2. Sign Transaction 
 * 3. Send Transaction 
 * 
 */

const utils = require("../utils");

class Transaction {

    // Need to fetch it from config.js or based on traffic!!
    TRANSACTION_FEE = 1;

    constructor() {
      this.chainId = 1; 
      this.nonce = null;
      this.maxPriorityFeePerGas = null;
      this.maxFeePerGas = null;
      this.gas = null;
      this.to = null;
      this.value = null;
      this.input = null;
      this.accessList = null;
      this.v = null;
      this.r = null;
      this.s = null;
    }
  
    static prepareTransaction = async( transaction ) => {
        // Implement the transaction creation
        const v = await utils.rlpEncode(transaction);
        const r = await utils.shaEncode('0x02' , v);
        const transactionHash = await utils.keccakEncode(r);
        // Put this transaction in the Level DB
    }
  
    static signTransaction(senderWallet, to, amount, type) {
      // Implement the transaction generation
    }
  
    static sendTransaction(transaction, senderWallet) {
      // Implement the transaction signing
    }

}
  

module.exports = Transaction;