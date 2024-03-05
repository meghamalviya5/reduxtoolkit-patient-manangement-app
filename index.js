const express = require("express");
const cors = require("cors");
const app = express();

const { initializeDatabase } = require("./db/db.connection");
const { Patient } = require("./models/patient.model");
const { Ward } = require("./models/ward.model");

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

initializeDatabase();

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    console.log("error occurred: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/patients", async (req, res) => {
  const { name, age, gender, medicalHistory, contact, assignedWard } = req.body;

  try {
    const patient = new Patient({
      name,
      age,
      gender,
      medicalHistory,
      contact,
      assignedWard,
    });
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    console.log("Error occurred while adding patient: ", error);
    res.status(500).json({ error: "Internal Server Error: " + error });
  }
});

app.put("/patients/:id", async (req, res) => {
  const patientId = req.params.id;
  const updatedPatientData = req.body;

  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      updatedPatientData,
      { new: true },
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(updatedPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/patients/:id", async (req, res) => {
  const patientId = req.params.id;

  try {
    const deletedPatient = await Patient.findByIdAndRemove(patientId);

    if (!deletedPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient deleted successfully",
      patient: deletedPatient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//ward CRUD operations
app.get("/wards", async (req, res) => {
  try {
    const wards = await Ward.find();
    res.json(wards);
  } catch (error) {
    console.log("error occurred: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/wards", async (req, res) => {
  console.log("req.body: ", req.body);
  const { wardNumber, capacity, specializations } = req.body;

  try {
    const ward = new Ward({ wardNumber, capacity, specializations });
    await ward.save();
    res.status(201).json(ward);
  } catch (error) {
    console.log("Error occurred while adding ward: ", error);
    res.status(500).json({ error: "Internal Server Error: " + error });
  }
});

app.put("/wards/:id", async (req, res) => {
  const wardId = req.params.id;
  const updatedWardData = req.body;

  try {
    const updatedWard = await Ward.findByIdAndUpdate(wardId, updatedWardData, {
      new: true,
    });

    if (!updatedWard) {
      return res.status(404).json({ message: "Ward not found" });
    }

    res.status(200).json(updatedWard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/wards/:id", async (req, res) => {
  const wardId = req.params.id;

  try {
    const deletedWard = await Ward.findByIdAndRemove(wardId);

    if (!deletedWard) {
      return res.status(404).json({ error: "Ward not found" });
    }

    res.status(200).json({
      message: "Ward deleted successfully",
      ward: deletedWard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
