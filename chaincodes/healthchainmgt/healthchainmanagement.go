package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// HealthChainContract provides functions for managing the healthcare system
type HealthChainContract struct {
	contractapi.Contract
}

// Patient describes basic details of a patient
type Patient struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Age   int    `json:"age"`
	Notes string `json:"notes"`
}

// Hospital describes basic details of a hospital
type Hospital struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Address     string `json:"address"`
	PhoneNumber string `json:"phoneNumber"`
}

// MedicalRecord describes a patient's medical record
type MedicalRecord struct {
	RecordID    string `json:"recordID"`
	PatientID   string `json:"patientID"`
	Diagnosis   string `json:"diagnosis"`
	Treatment   string `json:"treatment"`
	HospitalID  string `json:"hospitalID"`
	InsuranceID string `json:"insuranceID"`
}

// InsuranceClaim describes an insurance claim
type InsuranceClaim struct {
	ClaimID     string  `json:"claimID"`
	PatientID   string  `json:"patientID"`
	HospitalID  string  `json:"hospitalID"`
	InsuranceID string  `json:"insuranceID"`
	Treatment   string  `json:"treatment"`
	Amount      float64 `json:"amount"`
	Status      string  `json:"status"`
}

// CounterKey struct to keep track of record counts
type CounterKey struct {
	Key   string `json:"key"`
	Value int    `json:"value"`
}

// IncrementCounter increments a specific counter
func (c *HealthChainContract) IncrementCounter(ctx contractapi.TransactionContextInterface, counterKey string) error {
	counterJSON, err := ctx.GetStub().GetState(counterKey)
	if err != nil {
		return fmt.Errorf("failed to read counter %s from world state: %v", counterKey, err)
	}
	var counter CounterKey
	if counterJSON == nil {
		counter = CounterKey{Key: counterKey, Value: 1}
	} else {
		err = json.Unmarshal(counterJSON, &counter)
		if err != nil {
			return err
		}
		counter.Value++
	}
	updatedCounterJSON, err := json.Marshal(counter)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(counter.Key, updatedCounterJSON)
}

// GetRecordCount returns the count of records for a specific type
func (c *HealthChainContract) GetRecordCount(ctx contractapi.TransactionContextInterface, counterKey string) (int, error) {
	counterJSON, err := ctx.GetStub().GetState(counterKey)
	if err != nil {
		return 0, fmt.Errorf("failed to read counter %s from world state: %v", counterKey, err)
	}
	if counterJSON == nil {
		return 0, nil // Counter not found, return 0
	}
	var counter CounterKey
	err = json.Unmarshal(counterJSON, &counter)
	if err != nil {
		return 0, err
	}
	return counter.Value, nil
}

// AddPatient adds a new patient to the ledger
func (c *HealthChainContract) AddPatient(ctx contractapi.TransactionContextInterface, id string, name string, age int, notes string) error {
	patient := Patient{
		ID:    id,
		Name:  name,
		Age:   age,
		Notes: notes,
	}
	patientJSON, err := json.Marshal(patient)
	if err != nil {
		return err
	}
	err = ctx.GetStub().PutState(id, patientJSON)
	if err != nil {
		return fmt.Errorf("failed to put patient %s: %v", id, err)
	}
	err = c.IncrementCounter(ctx, "PatientRecordCount")
	if err != nil {
		return fmt.Errorf("failed to increment patient count: %v", err)
	}
	return nil
}

// GetPatient returns the patient stored in the ledger with given id
func (c *HealthChainContract) GetPatient(ctx contractapi.TransactionContextInterface, id string) (*Patient, error) {
	patientJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if patientJSON == nil {
		return nil, fmt.Errorf("the patient %s does not exist", id)
	}
	var patient Patient
	err = json.Unmarshal(patientJSON, &patient)
	if err != nil {
		return nil, err
	}
	return &patient, nil
}

// AddHospital adds a new hospital to the ledger
func (c *HealthChainContract) AddHospital(ctx contractapi.TransactionContextInterface, id string, name string, address string, phoneNumber string) error {
	hospital := Hospital{
		ID:          id,
		Name:        name,
		Address:     address,
		PhoneNumber: phoneNumber,
	}
	hospitalJSON, err := json.Marshal(hospital)
	if err != nil {
		return err
	}
	err = ctx.GetStub().PutState(id, hospitalJSON)
	if err != nil {
		return fmt.Errorf("failed to put hospital %s: %v", id, err)
	}
	err = c.IncrementCounter(ctx, "HospitalCount")
	if err != nil {
		return fmt.Errorf("failed to increment hospital count: %v", err)
	}
	return nil
}

// GetHospital returns the hospital stored in the ledger with the given ID
func (c *HealthChainContract) GetHospital(ctx contractapi.TransactionContextInterface, id string) (*Hospital, error) {
	hospitalJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if hospitalJSON == nil {
		return nil, fmt.Errorf("the hospital %s does not exist", id)
	}
	var hospital Hospital
	err = json.Unmarshal(hospitalJSON, &hospital)
	if err != nil {
		return nil, err
	}
	return &hospital, nil
}

// AddMedicalRecord adds a new medical record for a patient
func (c *HealthChainContract) AddMedicalRecord(ctx contractapi.TransactionContextInterface, patientID string, diagnosis string, treatment string, hospitalID string, insuranceID string) error {
	recordID := patientID + "-" + diagnosis + "-" + treatment // Generate a unique ID for the record
	record := MedicalRecord{
		RecordID:    recordID,
		PatientID:   patientID,
		Diagnosis:   diagnosis,
		Treatment:   treatment,
		HospitalID:  hospitalID,
		InsuranceID: insuranceID,
	}
	recordJSON, err := json.Marshal(record)
	if err != nil {
		return err
	}
	err = ctx.GetStub().PutState(recordID, recordJSON)
	if err != nil {
		return fmt.Errorf("failed to put medical record %s: %v", recordID, err)
	}
	err = c.IncrementCounter(ctx, "MedicalRecordCount")
	if err != nil {
		return fmt.Errorf("failed to increment medical record count: %v", err)
	}
	return nil
}

// GetMedicalRecord returns the medical record stored in the ledger with given recordID
func (c *HealthChainContract) GetMedicalRecord(ctx contractapi.TransactionContextInterface, recordID string) (*MedicalRecord, error) {
	recordJSON, err := ctx.GetStub().GetState(recordID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if recordJSON == nil {
		return nil, fmt.Errorf("the medical record %s does not exist", recordID)
	}
	var record MedicalRecord
	err = json.Unmarshal(recordJSON, &record)
	if err != nil {
		return nil, err
	}
	return &record, nil
}

// CreateInsuranceClaim creates a new insurance claim
func (c *HealthChainContract) CreateInsuranceClaim(ctx contractapi.TransactionContextInterface, claimID string, patientID string, hospitalID string, insuranceID string, treatment string, amount float64) error {
	claim := InsuranceClaim{
		ClaimID:     claimID,
		PatientID:   patientID,
		HospitalID:  hospitalID,
		InsuranceID: insuranceID,
		Treatment:   treatment,
		Amount:      amount,
		Status:      "Pending",
	}
	claimJSON, err := json.Marshal(claim)
	if err != nil {
		return err
	}
	err = ctx.GetStub().PutState(claimID, claimJSON)
	if err != nil {
		return fmt.Errorf("failed to put insurance claim %s: %v", claimID, err)
	}
	err = c.IncrementCounter(ctx, "InsuranceClaimCount")
	if err != nil {
		return fmt.Errorf("failed to increment insurance claim count: %v", err)
	}
	return nil
}

// GetInsuranceClaim returns the insurance claim stored in the ledger with given claimID
func (c *HealthChainContract) GetInsuranceClaim(ctx contractapi.TransactionContextInterface, claimID string) (*InsuranceClaim, error) {
	claimJSON, err := ctx.GetStub().GetState(claimID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if claimJSON == nil {
		return nil, fmt.Errorf("the insurance claim %s does not exist", claimID)
	}
	var claim InsuranceClaim
	err = json.Unmarshal(claimJSON, &claim)
	if err != nil {
		return nil, err
	}
	return &claim, nil
}

// UpdatePatient updates an existing patient in the ledger
func (c *HealthChainContract) UpdatePatient(ctx contractapi.TransactionContextInterface, id string, name string, age int, notes string) error {
	patientJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("failed to read from world state: %v", err)
	}
	if patientJSON == nil {
		return fmt.Errorf("the patient %s does not exist", id)
	}
	patient := Patient{
		ID:    id,
		Name:  name,
		Age:   age,
		Notes: notes,
	}
	updatedPatientJSON, err := json.Marshal(patient)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(id, updatedPatientJSON)
}

// UpdateHospital updates an existing hospital in the ledger
func (c *HealthChainContract) UpdateHospital(ctx contractapi.TransactionContextInterface, id string, name string, address string, phoneNumber string) error {
	hospitalJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("failed to read from world state: %v", err)
	}
	if hospitalJSON == nil {
		return fmt.Errorf("the hospital %s does not exist", id)
	}
	hospital := Hospital{
		ID:          id,
		Name:        name,
		Address:     address,
		PhoneNumber: phoneNumber,
	}
	updatedHospitalJSON, err := json.Marshal(hospital)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(id, updatedHospitalJSON)
}

// UpdateMedicalRecord updates an existing medical record in the ledger
func (c *HealthChainContract) UpdateMedicalRecord(ctx contractapi.TransactionContextInterface, recordID string, patientID string, diagnosis string, treatment string, hospitalID string, insuranceID string) error {
	recordJSON, err := ctx.GetStub().GetState(recordID)
	if err != nil {
		return fmt.Errorf("failed to read from world state: %v", err)
	}
	if recordJSON == nil {
		return fmt.Errorf("the medical record %s does not exist", recordID)
	}
	record := MedicalRecord{
		RecordID:    recordID,
		PatientID:   patientID,
		Diagnosis:   diagnosis,
		Treatment:   treatment,
		HospitalID:  hospitalID,
		InsuranceID: insuranceID,
	}
	updatedRecordJSON, err := json.Marshal(record)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(recordID, updatedRecordJSON)
}

// UpdateClaimStatus updates the status of an existing insurance claim
func (c *HealthChainContract) UpdateClaimStatus(ctx contractapi.TransactionContextInterface, claimID string, status string) error {
	claimJSON, err := ctx.GetStub().GetState(claimID)
	if err != nil {
		return fmt.Errorf("failed to read from world state: %v", err)
	}
	if claimJSON == nil {
		return fmt.Errorf("the insurance claim %s does not exist", claimID)
	}
	var claim InsuranceClaim
	err = json.Unmarshal(claimJSON, &claim)
	if err != nil {
		return err
	}
	claim.Status = status
	updatedClaimJSON, err := json.Marshal(claim)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(claimID, updatedClaimJSON)
}

func main() {
	healthChainContract := new(HealthChainContract)
	chaincode, err := contractapi.NewChaincode(healthChainContract)
	if err != nil {
		fmt.Printf("Error creating healthchain chaincode: %s", err.Error())
		return
	}
	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting healthchain chaincode: %s", err.Error())
	}
}
