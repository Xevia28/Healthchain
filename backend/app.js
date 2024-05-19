const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))

// POST
app.post('/api/patient', async (req, res) => {
    try {
        const { id, name, age, notes } = req.body;
        const result = await submitTransaction('AddPatient', id, name, age, notes);
        res.status(204).send(result);
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(`Failed to submit transaction: ${error}`);
    }
});

app.post('/api/hospital', async (req, res) => {
    try {
        const { id, name, address, phoneNumber } = req.body;
        const result = await submitTransaction('AddHospital', id, name, address, phoneNumber);
        res.status(204).send(result);
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(`Failed to submit transaction: ${error}`);
    }
});

app.post('/api/insurance', async (req, res) => {
    try {
        const { claimId, patientId, hospitalId, insuranceId, treatment, amount } = req.body;
        const result = await submitTransaction('CreateInsuranceClaim', claimId, patientId, hospitalId, insuranceId, treatment, amount);
        res.status(204).send(result);
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(`Failed to submit transaction: ${error}`);
    }
});

app.post('/api/medrecord', async (req, res) => {
    try {
        const { patientId, diagnosis, treatment, hospitalId, insuranceId } = req.body;
        const result = await submitTransaction('AddMedicalRecord', patientId, diagnosis, treatment, hospitalId, insuranceId);
        res.status(204).send(result);
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(`Failed to submit transaction: ${error}`);
    }
});

// GET COUNT
app.get('/api/getPatientCount', async (req, res) => {
    try {
        const result = await evaluateTransaction('GetRecordCount', "PatientRecordCount");
        res.status(200).send(result);
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(404).send(`Failed to evaluate transaction: ${error}`);
    }
});

app.get('/api/getHospitalCount', async (req, res) => {
    try {
        const result = await evaluateTransaction('GetRecordCount', "HospitalCount");
        res.status(200).send(result);
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(404).send(`Failed to evaluate transaction: ${error}`);
    }
});

app.get('/api/getInsuranceCount', async (req, res) => {
    try {
        const result = await evaluateTransaction('GetRecordCount', "InsuranceClaimCount");
        res.status(200).send(result);
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(404).send(`Failed to evaluate transaction: ${error}`);
    }
});

app.get('/api/getMRCount', async (req, res) => {
    try {
        const result = await evaluateTransaction('GetRecordCount', "MedicalRecordCount");
        res.status(200).send(result);
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(404).send(`Failed to evaluate transaction: ${error}`);
    }
});

// GET
app.get('/api/patient/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await evaluateTransaction('GetPatient', id);
        res.status(200).send(result);
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(404).send(`Failed to evaluate transaction: ${error}`);
    }
});

app.get('/api/hospital/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await evaluateTransaction('GetHospital', id);
        res.status(200).send(result);
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(404).send(`Failed to evaluate transaction: ${error}`);
    }
});

app.get('/api/insurance/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await evaluateTransaction('GetInsuranceClaim', id);
        res.status(200).send(result);
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(404).send(`Failed to evaluate transaction: ${error}`);
    }
});

app.get('/api/medrecord/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await evaluateTransaction('GetMedicalRecord', id);
        res.status(200).send(result);
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(404).send(`Failed to evaluate transaction: ${error}`);
    }
});

// UPDATE
app.put('/api/patient/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, notes } = req.body;
        const result = await submitTransaction('UpdatePatient', id, name, age, notes);
        res.status(204).send(result);
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(`Failed to submit transaction: ${error}`);
    }
});

app.put('/api/hospital/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, phoneNumber } = req.body;
        const result = await submitTransaction('UpdateHospital', id, name, address, phoneNumber);
        res.status(204).send(result);
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(`Failed to submit transaction: ${error}`);
    }
});

app.put('/api/insurance/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { claimId, status } = req.body;
        const result = await submitTransaction('UpdateClaimStatus', id, claimId, status);
        res.status(204).send(result);
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(`Failed to submit transaction: ${error}`);
    }
});

app.put('/api/medrecord/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { recordId, patientId, diagnosis, treatment, hospitalId, insuranceId } = req.body;
        const result = await submitTransaction('UpdateMedicalRecord', id, recordId, patientId, diagnosis, treatment, hospitalId, insuranceId);
        res.status(204).send(result);
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(`Failed to submit transaction: ${error}`);
    }
});


async function getContract() {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get('Admin@healthchain.org');
    const gateway = new Gateway();
    const connectionProfile = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'connection.json'), 'utf8'));
    const connectionOptions = {
        wallet, identity: identity, discovery: {
            enabled: false, asLocalhost:
                true
        }
    };
    await gateway.connect(connectionProfile, connectionOptions);
    const network = await gateway.getNetwork('healthchainchannel');
    const contract = network.getContract('healthchainmgt');
    return contract;
}

async function submitTransaction(functionName, ...args) {
    const contract = await getContract();
    const result = await contract.submitTransaction(functionName, ...args);
    return result.toString();
}

async function evaluateTransaction(functionName, ...args) {
    const contract = await getContract();
    const result = await contract.evaluateTransaction(functionName, ...args);
    return result.toString();
}

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

module.exports = app;