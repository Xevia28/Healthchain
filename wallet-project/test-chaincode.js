const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
    const ccpPath = path.resolve(__dirname, '.', 'connection.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get('Admin@healthchain.org');
    if (!identity) {
        console.log(`An identity for the user "${identity}" does not exist in the wallet`);
        return;
    }
    const gateway = new Gateway();
    try {
        await gateway.connect(ccp, {
            wallet, identity: identity, discovery: {
                enabled: false, asLocalhost: false
            }
        });
        console.log('Connected to the gateway.');
        const network = await gateway.getNetwork('healthchainchannel');
        const contract = network.getContract('healthchainmgt');

        // Add a patient
        console.log('\n--> Submit Transaction: AddPatient, creates a new patient');
        await contract.submitTransaction('AddPatient', 'P1', 'John Doe', '30', 'No known allergies');
        console.log('*** Result: Patient added');

        // Retrieve the patient
        console.log('\n--> Evaluate Transaction: GetPatient, retrieve the patient details');
        let result = await contract.evaluateTransaction('GetPatient', 'P1');
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);

        // Add a medical record
        console.log('\n--> Submit Transaction: AddMedicalRecord, adds a new medical record for the patient');
        await contract.submitTransaction('AddMedicalRecord', 'P1', 'Hypertension', 'Medication', 'H1', 'I1');
        console.log('*** Result: Medical record added');

        // Retrieve the medical record
        console.log('\n--> Evaluate Transaction: GetMedicalRecord, retrieve the medical record details');
        result = await contract.evaluateTransaction('GetMedicalRecord', 'P1-Hypertension-Medication');
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);

    } finally {
        // Disconnect from the gateway when you're done.
        gateway.disconnect();
    }
}

main().catch(console.error);