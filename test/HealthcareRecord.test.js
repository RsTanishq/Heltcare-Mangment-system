const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HealthcareRecord", function () {
  let healthcareRecord;
  let accessControl;
  let patientConsent;
  let healthcareProvider;
  let owner;
  let doctor;
  let patient;
  let recordId;

  beforeEach(async function () {
    [owner, doctor, patient] = await ethers.getSigners();

    // Deploy AccessControl
    const AccessControl = await ethers.getContractFactory("AccessControl");
    accessControl = await AccessControl.deploy();
    await accessControl.deployed();

    // Deploy PatientConsent
    const PatientConsent = await ethers.getContractFactory("PatientConsent");
    patientConsent = await PatientConsent.deploy(accessControl.address);
    await patientConsent.deployed();

    // Deploy HealthcareProvider
    const HealthcareProvider = await ethers.getContractFactory("HealthcareProvider");
    healthcareProvider = await HealthcareProvider.deploy(accessControl.address);
    await healthcareProvider.deployed();

    // Deploy HealthcareRecord
    const HealthcareRecord = await ethers.getContractFactory("HealthcareRecord");
    healthcareRecord = await HealthcareRecord.deploy(
      accessControl.address,
      patientConsent.address,
      healthcareProvider.address
    );
    await healthcareRecord.deployed();

    // Setup roles
    await accessControl.grantRole(await accessControl.ADMIN(), owner.address);
    await accessControl.grantRole(await accessControl.DOCTOR(), doctor.address);

    // Register and verify doctor
    await healthcareProvider.registerProvider(
      "Dr. Smith",
      "doctor",
      "MD12345",
      "General Medicine"
    );
    await healthcareProvider.verifyProvider(doctor.address);

    // Create a test record
    const tx = await healthcareRecord
      .connect(doctor)
      .createRecord(patient.address, "ipfsHash123", "general");
    const receipt = await tx.wait();
    recordId = receipt.events[0].args.recordId;
  });

  describe("Lab Results", function () {
    it("should add and retrieve lab results", async function () {
      await healthcareRecord
        .connect(doctor)
        .addLabResult(
          recordId,
          "Blood Test",
          "120",
          "mg/dL",
          "70-140 mg/dL"
        );

      const results = await healthcareRecord.getLabResults(recordId);
      expect(results.length).to.equal(1);
      expect(results[0].testType).to.equal("Blood Test");
      expect(results[0].result).to.equal("120");
      expect(results[0].unit).to.equal("mg/dL");
      expect(results[0].referenceRange).to.equal("70-140 mg/dL");
    });
  });

  describe("Prescriptions", function () {
    it("should add and retrieve prescriptions", async function () {
      const endDate = Math.floor(Date.now() / 1000) + 86400 * 30; // 30 days from now
      
      await healthcareRecord
        .connect(doctor)
        .addPrescription(
          recordId,
          "Amoxicillin",
          "500mg",
          "twice daily",
          endDate,
          "Take with food"
        );

      const prescriptions = await healthcareRecord.getPrescriptions(recordId);
      expect(prescriptions.length).to.equal(1);
      expect(prescriptions[0].medication).to.equal("Amoxicillin");
      expect(prescriptions[0].dosage).to.equal("500mg");
      expect(prescriptions[0].frequency).to.equal("twice daily");
      expect(prescriptions[0].instructions).to.equal("Take with food");
    });
  });

  describe("Diagnoses", function () {
    it("should add and retrieve diagnoses", async function () {
      await healthcareRecord
        .connect(doctor)
        .addDiagnosis(
          recordId,
          "E11.9",
          "Type 2 Diabetes Mellitus",
          "Moderate"
        );

      const diagnoses = await healthcareRecord.getDiagnoses(recordId);
      expect(diagnoses.length).to.equal(1);
      expect(diagnoses[0].code).to.equal("E11.9");
      expect(diagnoses[0].description).to.equal("Type 2 Diabetes Mellitus");
      expect(diagnoses[0].severity).to.equal("Moderate");
    });
  });

  describe("Treatment Plans", function () {
    it("should add and retrieve treatment plans", async function () {
      const endDate = Math.floor(Date.now() / 1000) + 86400 * 90; // 90 days from now
      
      await healthcareRecord
        .connect(doctor)
        .addTreatmentPlan(
          recordId,
          "Diabetes Management",
          "Maintain blood sugar levels",
          endDate,
          "In Progress"
        );

      const plans = await healthcareRecord.getTreatmentPlans(recordId);
      expect(plans.length).to.equal(1);
      expect(plans[0].plan).to.equal("Diabetes Management");
      expect(plans[0].goals).to.equal("Maintain blood sugar levels");
      expect(plans[0].status).to.equal("In Progress");
    });
  });

  describe("Allergies", function () {
    it("should add and retrieve allergies", async function () {
      await healthcareRecord
        .connect(doctor)
        .addAllergy(
          recordId,
          "Penicillin",
          "Rash",
          "Severe"
        );

      const allergies = await healthcareRecord.getAllergies(recordId);
      expect(allergies.length).to.equal(1);
      expect(allergies[0].allergen).to.equal("Penicillin");
      expect(allergies[0].reaction).to.equal("Rash");
      expect(allergies[0].severity).to.equal("Severe");
    });
  });

  describe("Vaccinations", function () {
    it("should add and retrieve vaccinations", async function () {
      const nextDueDate = Math.floor(Date.now() / 1000) + 86400 * 365; // 1 year from now
      
      await healthcareRecord
        .connect(doctor)
        .addVaccination(
          recordId,
          "COVID-19",
          "Pfizer",
          "LOT12345",
          nextDueDate
        );

      const vaccinations = await healthcareRecord.getVaccinations(recordId);
      expect(vaccinations.length).to.equal(1);
      expect(vaccinations[0].vaccine).to.equal("COVID-19");
      expect(vaccinations[0].manufacturer).to.equal("Pfizer");
      expect(vaccinations[0].lotNumber).to.equal("LOT12345");
    });
  });

  describe("Access Control", function () {
    it("should not allow unauthorized users to add records", async function () {
      const unauthorizedUser = ethers.Wallet.createRandom();
      
      await expect(
        healthcareRecord
          .connect(unauthorizedUser)
          .addLabResult(
            recordId,
            "Blood Test",
            "120",
            "mg/dL",
            "70-140 mg/dL"
          )
      ).to.be.revertedWith("Not authorized to access this record");
    });

    it("should allow authorized users to add records", async function () {
      await healthcareRecord
        .connect(doctor)
        .addLabResult(
          recordId,
          "Blood Test",
          "120",
          "mg/dL",
          "70-140 mg/dL"
        );

      const results = await healthcareRecord.getLabResults(recordId);
      expect(results.length).to.equal(1);
    });
  });
}); 