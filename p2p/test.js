const WebSocket = require("ws");
const trie = require("../trie/trie");
const utils = require("../utils");
const levelDb = require("../levelDB/levelDb");


const MESSAGE_TYPE = { 
    syncTransaction: "SYNC_TRANSACTION",
}

const init = async(message) => {

    // message = await utils.decodeRlp(message);

    var messageType =  await utils.keccakEncode(MESSAGE_TYPE.syncTransaction);

    if (messageType.substring(0,22) === message.substring(0,22) ) {

        // Syncing a transaction to this node!!!
        var transaction = '0x' + message.slice(22);
        if ( utils.validateTransaction( transaction ) ) {
            var key = await utils.keccakEncode( transaction );
            
            if ( await levelDb.get( key ) == null ) {
                await levelDb.put( key, transaction );
                // sendTransactionFromPool(socket);
            } 

        }

    } else {

        if ( await levelDb.get( key ) == null ) {
            var key = await utils.keccakEncode( message );
            await levelDb.put( key, message );
        }

    }


}

const sendTransaction = async(transaction) => {
    transaction = (await utils.keccakEncode(MESSAGE_TYPE.syncTransaction)).substring(0,22) + transaction.substring(2);
        socket.send(transaction);
}

// init( '0x570dcfd072d98c037fadddebf5f32c0e844fe2eecbd1e8c8e87a00dbc927b2a2d03b8bb7880dc4879025ded9382a00f870598477359400831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008748656c6c6f212481fba08aa8eba8b742ef830324c677e544385cbbbb3b39f647b98dd6b09d1730b96637a07e0bab656034cbc8b7a61a9a5a8925116bc3e90a89783d42548c9af71c88bc5a' );
// sendTransaction('0xe933271b3dea89902dc8b567c70fda2b78f063702268fe5e4da08b7f49693e94ded9382a00f870598477359400831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008748656c6c6f212481fba08aa8eba8b742ef830324c677e544385cbbbb3b39f647b98dd6b09d1730b96637a07e0bab656034cbc8b7a61a9a5a8925116bc3e90a89783d42548c9af71c88bc5a');

init('0x570dcfd072d98c037fadf8705a8477359400831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008748656c6c6f212481fba09120b3e1333857897633ee7b26e152b7e299b2ed28382551bf0d39cbd53167a0a026fe7ca4f4f5069d2b3245907ffd976c7c4d67349c3d53cb17b565259dbcb702');