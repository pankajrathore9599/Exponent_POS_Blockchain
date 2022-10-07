const levelDB = require("../levelDB/levelDb");
const block = require("../blockchain/block");


const getMempool = async() => {
    const db = await levelDB.getDbObject();
    var array = [];

    try {    
        const readStream = db.createReadStream();
        for await (const data of readStream) {
          array.push(data)
        }
    } catch (error) {
        array = []
    }

    return (array);
}


exports.mineBlock = async() => {
    // Miner initialise the block mining
    rawTransaction = await getMempool();
    block.createBlock(rawTransaction);
}