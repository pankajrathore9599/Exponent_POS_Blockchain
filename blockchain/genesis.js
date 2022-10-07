// Read the genesis.json file for all the configuration
const genesisConfiguration = require("../genesis.json");

// Import the database location for state and block DB
const trie = require("../trie/trie");
const levelDbBlock = require("../levelDB/levelDbBlock");


const utils = require("../utils");


mineGenesis = async() => { 

    var amount = genesisConfiguration.amount;

    // RLP encoded value for the state DB
    var value = await utils.encodeRlp( [0, amount, null, null] );
    var keys = genesisConfiguration.accounts;
    var keyCount = Object.keys(keys).length;
    var root = null;

    for (var key=0; key<keyCount; key++) {

        var account = keys["key"+key];

        if ( key == 0 ) {
            // For the first transaction, root is null
            root = await trie.put( account, value, null );
        } else {
            // For all remaining transactions, root is equal to the previous state root
            root = await trie.put( account, value, root );
        }
       
    };

    console.log(root);
    levelDbBlock.put('0000000000000001', root);

}

mineGenesis();