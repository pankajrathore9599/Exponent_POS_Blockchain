const transaction = require('./transaction');

const init = async() => {

    txn = [
        '0x1',
        '0x54',
        '0x3b9aca00',
        '0x30593537ae',
        '0xa9b3',
        '0x4c3C16527f66e887241154e96f6bAcabb3128abb',
        '0x',
        '0x095ea7b3000000000000000000000000c1153c6b2a45e9a7b94290a0bf36417c0b0e1d11000000000000000000000000000000000000000000000000000000024c618b3a',
        [],
        '0x1',
        '0x12d798f0b6ff3228019df1a43b4220d07edb4d4d9651d4d22f9ee08af553285b',
        '0x30ea44b1faec3dc2f24b3b8669b41c0aeb638481ca051b650c9fb7ef24ac55f7'
    ]

    transaction.prepareTransaction(txn);

}

init()