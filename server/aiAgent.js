const {
  getPatientData,
  addChatMessage,
  updateProfile,
  updateRisk,
  updateDoctorSummary
} = require("./patientStore");

const { extractEntities } = require("../symptomExtractor");
const { evaluateRisk } = require("../riskRules");
const { runIBMBackgroundAgent } = require("../ibmAgentExample");

function generateDoctorSummary(patient) {
  const p = patient.profile;
  const symptoms = p.symptoms.length ? p.symptoms.join(", ") : "None reported";
  const allergies = p.allergies.length ? p.allergies.join(", ") : "None reported";
  const conditions = p.conditions.length ? p.conditions.join(", ") : "None reported";
  const medications = p.medications.length ? p.medications.join(", ") : "None reported";
  const durations = p.durations.length ? p.durations.join(", ") : "Not specified";

  return `
Patient Intake Summary

Symptoms: ${symptoms}
Conditions: ${conditions}
Allergies: ${allergies}
Medications: ${medications}
Duration: ${durations}
Risk Level: ${patient.latestRisk.level}

Notes:
${patient.latestRisk.reasons.join(" ")}
  `.trim();
}

function generateChatReply(patient, extracted) {
  if (patient.latestRisk.level === "High") {
    return "Your symptoms may need urgent medical attention. Please contact emergency services or seek urgent care immediately.";
  }

  if ((extracted.symptoms || []).length > 0) {
    return `Thanks for sharing. I noted these symptoms: ${extracted.symptoms.join(", ")}. I’m updating your intake summary and tracking your reported history.`;
  }

  if ((extracted.conditions || []).length > 0 || (extracted.allergies || []).length > 0) {
    return "Thanks — I updated your medical history in your intake profile.";
  }

  return "Thanks. I recorded that information. Can you tell me more about your symptoms, how long they’ve lasted, and whether they’re getting worse?";
}

async function handlePatientMessage(patientId, message) {
  addChatMessage(patientId, "user", message);

  const extracted = extractEntities(message);
  updateProfile(patientId, extracted);

  const patient = getPatientData(patientId);
  const risk = evaluateRisk(patient.profile);
  updateRisk(patientId, risk);

  const updatedPatient = getPatientData(patientId);
  const summary = generateDoctorSummary(updatedPatient);
  updateDoctorSummary(patientId, summary);

  const ibmOutput = await runIBMBackgroundAgent({
    profile: updatedPatient.profile,
    latestRisk: updatedPatient.latestRisk,
    doctorSummary: updatedPatient.doctorSummary
  });

  const reply = generateChatReply(getPatientData(patientId), extracted);
  addChatMessage(patientId, "assistant", reply);

  return {
    reply,
    extracted,
    risk: getPatientData(patientId).latestRisk,
    profile: getPatientData(patientId).profile,
    doctorSummary: getPatientData(patientId).doctorSummary,
    ibmAgent: ibmOutput
  };
}

module.exports = { handlePatientMessage };