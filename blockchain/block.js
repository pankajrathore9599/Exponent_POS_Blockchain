const levelDbBlock = require("../levelDB/levelDbBlock");
const transactionRecieptDbBlock = require("../levelDB/transactionReciept");
const cacheDb = require("../levelDB/levelDb");
const trie = require("../trie/trie");
const Web3 = require('web3');
const utils = require("../utils");


const fetchLatestBlock = async() => {
    // Fetch the state root and block number of the latest mined block

    var stateRoot;
    var blockNumber;

    for await (const [key, value] of levelDbBlock.db.iterator({ reverse: true , limit: 1})) {
        blockNumber = key.toString();
        stateRoot = value.toString();
    }

    return (blockNumber, stateRoot);

}


const generateNextBlockNumber = async(currentBlockNumber) => {
    // Create the next valid blocknumber

    var initNumber = '0000000000000000';
    var nextBlockNumber;

    if(currentBlockNumber.length === 16){

        var nextBlockNumber = (parseInt(currentBlockNumber) + 1).toString() ;
        nextBlockNumber = initNumber.substring(0,16 - nextBlockNumber.length) + nextBlockNumber;
    
    } else {
        // There is some error with the system
        nextBlockNumber = 'infinite';
    }
    
    return (nextBlockNumber);
}


const executeTransaction = async ( currentStateRoot, rawTransactions ) => {

    var executedTransactions = [];

    for ( var i=0; i<rawTransactions.length; i++ ) {

        var key = await utils.keccakEncode(rawTransactions[i]);

        var from = Web3.eth.accounts.recoverTransaction(rawTransactions[i]);
        var serialisedTransaction = utils.serializeTransaction(rawTransactions[i]);
        var nonce = serialisedTransaction[0];
        var gasPrice = serialisedTransaction[1];
        var gasLimit = serialisedTransaction[2];
        var to = serialisedTransaction[3];
        var value = serialisedTransaction[4];
        var data = serialisedTransaction[5];

        var state = await trie.get( await utils.keccakEncode(from), currentStateRoot );
        state = await utils.decodeRlp(state.value);

        if ( state[0] < nonce && state[1] >= value+gasLimit ) {
            var newValue = await utils.encodeRlp( [nonce, state[1]-(value+gasLimit), data, null] );
            currentStateRoot = await trie.put(await utils.keccakEncode(from), newValue, currentStateRoot );
            executedTransactions.push(key);
        }

    }

    return ( currentStateRoot, executedTransactions );

}


exports.createBlock = async( rawTransactions ) => {

    var currentBlockNumber, currentBlockState = await fetchLatestBlock();
    var nextBlockNumber = await generateNextBlockNumber(currentBlockNumber);

    var newStateRoot, executedTransactions = await executeTransaction(currentBlockState, rawTransactions );
    levelDbBlock.put( nextBlockNumber, newStateRoot );

    executedTransactions.forEach( executedTransaction => {

        // Delete the successfully executed transactions from Mempool!!!!!!!!
        cacheDb.delete(executedTransaction);

        // Create trasnaction Reciept for the executed transactions!!
        var value = executedTransaction + "" + nextBlockNumber;
        await transactionRecieptDbBlock.put( executedTransaction, value );

    });
    

    // Broadcast the deletion on p2p network 

}