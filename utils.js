/*
 *
 * General utils function to be used everywhere used inside the exponent
 * 
 */


var ethers = require("ethers") 
var rlp = require("rlp");
const Web3 = require('web3');


exports.serializeTransaction = async (rawTransaction) => {
    // Serialize the given raw transaction into multiple components
    try {
        const transaction = ethers.utils.RLP.decode(rawTransaction);
        return ( transaction );
    } catch (error) {
        return ( error );
    }
}


exports.validateTransaction = async (rawTransaction) => {
    // Validate a given transaction by finding the "from" address
    try {
        const from = Web3.eth.accounts.recoverTransaction(rawTransaction);
        // Check getBalance in future code
        return ( true );
    } catch (error) {
        return ( false );
    }
}


exports.decodeRlp = async (data) => {
    // Decode the data using RLP
    return ( rlp.decode(data) );
}


exports.encodeRlp = async (data) => {
    // Encode the data using RLP
    return ( rlp.encode(data) );
}


exports.keccakEncode = async (data) => {
    // Encode the given data using Keccak256 mechanism 
    return ( Web3.utils.keccak256(data) );
}