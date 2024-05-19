const fs = require('fs');
const path = require('path');
const { Wallets } = require('fabric-network');
const CRYPTO_CONFIG = path.resolve(__dirname, '../config/crypto-config');
const CRYPTO_CONFIG_PEER_ORGS = path.join(CRYPTO_CONFIG, 'peerOrganizations')
const WALLET_FOLDER = './wallet'
var wallet

main();

async function main() {
    let action = 'list'
    if (process.argv.length > 2) {
        action = process.argv[2]
    }
    else {
        console.log(
            `Usage: (node wallet.js list, node wallet.js add healthchain Admin)
Not enough arguments.`)
        return
    }
    console.log(CRYPTO_CONFIG_PEER_ORGS)
    wallet = await Wallets.newFileSystemWallet(WALLET_FOLDER)
    if (action == 'list') {
        console.log("List of identities in wallet:")
        listIdentities()
    } else if (action == 'add' || action == 'export') {
        if (process.argv.length < 5) {
            console.log("For 'add' & 'export' - Org & User are needed!!!")
            process.exit(1)
        }
        if (action == 'add') {
            addToWallet(process.argv[3], process.argv[4])
            console.log('Done adding/updating.')
        } else {
            exportIdentity(process.argv[3], process.argv[4])
        }
    }
}

async function addToWallet(org, user) {
    try {
        var cert = readCertCryptogen(org, user)
        var key = readPrivateKeyCryptogen(org, user)
    } catch (e) {
        console.log("Error reading certificate or key!!! " + org + "/" + user)
        process.exit(1)
    }
    let mspId = createMSPId(org)
    const identityLabel = createIdentityLabel(org, user);
    const userIdentity = await wallet.get(identityLabel);
    if (userIdentity) {
        console.log(`An identity for the user "${identityLabel}" already exists in the wallet`);
        return;
    }
    const identity = {
        credentials: {
            certificate: cert,
            privateKey: key,
        },
        mspId: mspId,
        type: 'X.509',
    };
    await wallet.put(identityLabel, identity); console.log(`Successfully added user "${identityLabel}" to the wallet`);
}

async function listIdentities() {
    console.log("Identities in Wallet:")
    const identities = await wallet.list();
    for (const identity of identities) {
        console.log(`user: ${identity}`);
    }
}

async function exportIdentity(org, user) {
    let label = createIdentityLabel(org, user)
    let identity = await wallet.export(label)
    if (identity == null) {
        console.log(`Identity ${user} for ${org} Org Not found!!!`)
    } else {
        console.log(identity)
    }
}

function readCertCryptogen(org, user) {
    var certPath = CRYPTO_CONFIG_PEER_ORGS + "/" + org + ".org/users/" + user + "@" + org + ".org/msp/signcerts/" + user + "@" + org + ".org-cert.pem"
    const cert = fs.readFileSync(certPath).toString();
    return cert
}

function readPrivateKeyCryptogen(org, user) {
    var pkFolder = CRYPTO_CONFIG_PEER_ORGS + "/" + org + ".org/users/" + user + "@" + org + ".org/msp/keystore"
    var pkfile;
    fs.readdirSync(pkFolder).forEach(file => {
        pkfile = file
        return
    })
    return fs.readFileSync(pkFolder + "/" + pkfile).toString()
}

function createMSPId(org) {
    return org.charAt(0).toUpperCase() + org.slice(1)
}

function createIdentityLabel(org, user) {
    return user + '@' + org + '.org';
}