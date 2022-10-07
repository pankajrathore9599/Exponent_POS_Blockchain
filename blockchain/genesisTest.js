const Trie = require ('merkle-patricia-tree').SecureTrie
const level = require('level').Level;
const { bufferToHex } = require ('ethereumjs-util') ;
const config = require('../config');
const utils = require("../utils");

const db = new level(config.TRIE_DB_PATH);

init = async() => {

    var root = "d42828f57b3f126e33fa0d2d28ed41d295fef8ea836adf44d46767fe0b4f697b";

    var trie = new Trie(db, Buffer.from(root, "hex"));
    // var stream = trie.createReadStream();
    // stream.on('data', (data) => {
    //     console.log(data);
    // });

    var key = "79393872A2313deF7F06cc64450Adf610bd46242";
    var key1 =  await utils.keccakEncode(key) ;
    console.log(key1)
    var key2 = Buffer.from( key1, 'hex' );
    console.log(key2)

    var account =  await trie.get( Buffer.from(key, 'hex') ); 
    var accountHex = bufferToHex(account);
    console.log(accountHex);

    var state = await utils.decodeRlp(accountHex);
    console.log(state)

    var balance = bufferToHex(state[1]);
    console.log( parseInt(balance, 16) )


}

init();