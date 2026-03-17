const express = require("express");
const cors = require("cors");
const path = require("path");

const { handlePatientMessage } = require("./aiAgent");
const { getPatientData } = require("./patientStore");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client")));

app.post("/chat", async (req, res) => {
  try {
    const { patientId = "demo-patient", message = "" } = req.body;

    if (!message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const result = await handlePatientMessage(patientId, message);
    res.json(result);
  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

app.get("/patient/:id", (req, res) => {
  const data = getPatientData(req.params.id);
  res.json(data);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.use(express.static(path.join(__dirname, "..", "client")));