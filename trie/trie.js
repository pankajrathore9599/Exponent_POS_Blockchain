// Import the require NPM packages for the Merkle Patricia tree implementation
// NOTE - Importing secure trie here, which by default does the RLP encoding once 
const Trie = require ('merkle-patricia-tree').SecureTrie
const level = require('level').Level;

// Helps to convert the buffer to hexadecimal
const { bufferToHex } = require ('ethereumjs-util') ;
const config = require('../config');

const db = new level(config.TRIE_DB_PATH);


exports.getDbObject = async() => {
    // Returns the complete DB objects for initialization
    
    return (db);
}


exports.get = async(key, root) => {
    // Return the object fetched else return false

    try {
        rootBuffer = Buffer.from( (root.startsWith("0x") ? root.slice(2):root), 'hex' );
        var trie = new Trie( db, rootBuffer );
        return await trie.get(Buffer.from((key.startsWith("0x")?key.slice(2):key)) );
    } catch (error) {
        return ( null );
    }


}


exports.put = async(key, value, root) => {
    // Insert the key value pair in levelDB

    var trie;

    if ( root != null ) {
        rootBuffer = Buffer.from( (root.startsWith("0x") ? root.slice(2):root), 'hex' );
        trie = new Trie( db, rootBuffer );
    } else {
        trie = new Trie( db );
    }
    
    try {
        await trie.put( Buffer.from((key.startsWith("0x") ? key.slice(2):key), 'hex'), Buffer.from(value));
        return bufferToHex(trie.root);
    } catch (error) {
        return ( error );
    }

}