const WebSocket = require("ws");
const trie = require("../trie/trie");
const levelDb = require("../levelDB/levelDb");
const config = require("../config");
const utils = require("../utils");

const P2P_PORT = process.env.P2P_PORT || 5000;

const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

const MESSAGE_TYPE = { 
    syncTransaction: "SYNC_TRANSACTION",
}


class server {

    constructor() {
    }

    listen() {
        const server = new WebSocket.Server({ port: P2P_PORT });
        server.on("connection", socket => {
        socket.isAlive = true;
        this.connectSocket(socket);
        });
        this.connectToPeers();
        console.log(`Listening for peer to peer connection on port : ${P2P_PORT}`);
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log("Socket connected");
        this.messageHandler(socket);
        this.closeConnectionHandler(socket);
    }

    connectToPeers() {
        peers.forEach(peer => {
        try {
            const socket = new WebSocket(peer);
            socket.on("open", () => this.connectSocket(socket));
        } catch (error) { 
            console.log("Error in connecting to the node!! Retrying in some time");
        }
        });
    }

    messageHandler(socket) {
        socket.on( "message", message => {

            var messageType =  await utils.keccakEncode(MESSAGE_TYPE.syncTransaction);

            if (messageType.substring(0,22) === message.substring(0,22) ) {

                // Syncing a transaction to this node!!!
                var transaction = '0x' + message.slice(22);
                if ( utils.validateTransaction( transaction ) ) {
                    var key = await utils.keccakEncode( transaction );

                    if ( await levelDb.get( key ) == null ) {
                        await levelDb.put( key, transaction );
                        sendTransactionFromPool(socket);
                    } 

                }

            } else {

                if ( await levelDb.get( key ) == null ) {
                    var key = await utils.keccakEncode( message );
                    await levelDb.put( key, message );
                    sendTransactionFromPool(socket);
                }

            }

        } );
    }

    sendTransactionFromPool(socket, transaction) {
        transaction = (await utils.keccakEncode(MESSAGE_TYPE.syncTransaction)).substring(0,22) + transaction.substring(2);
        socket.send(transaction);
    }

    closeConnectionHandler(socket) {
        socket.on("close", () => (socket.isAlive = false));
    }

}
  
  module.exports = server;
  

