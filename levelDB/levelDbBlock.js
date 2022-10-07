const levelup = require('levelup');
const leveldown = require('leveldown');

const config = require('../config');

const db = levelup(leveldown(config.BLOCK_DB_PATH));


exports.getDbObject = async() => {
    // Returns the complete DB objects for initialization
    return (db);
}


exports.get = async(key) => {
    // Return the object fetched else return false

    try {
        var response = await db.get(key);
        return (response);
    } catch ( error ) {
        return null;
    }
}


exports.put = async(key, value) => {
    // Insert the key value pair in levelDB
    
    try {
        await db.put(key, value);
        return true;
    } catch (error) {
        return ( error );
    }
}