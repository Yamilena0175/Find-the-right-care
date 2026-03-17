const patients = {};

function createEmptyPatient(patientId) {
  return {
    patientId,
    chatHistory: [],
    profile: {
      symptoms: [],
      allergies: [],
      conditions: [],
      medications: [],
      durations: []
    },
    latestRisk: {
      level: "Low",
      reasons: []
    },
    doctorSummary: "No summary yet."
  };
}

function getPatientData(patientId) {
  if (!patients[patientId]) {
    patients[patientId] = createEmptyPatient(patientId);
  }
  return patients[patientId];
}

function addChatMessage(patientId, role, text) {
  const patient = getPatientData(patientId);
  patient.chatHistory.push({
    role,
    text,
    timestamp: new Date().toISOString()
  });
}

function updateProfile(patientId, extracted) {
  const patient = getPatientData(patientId);

  for (const symptom of extracted.symptoms || []) {
    if (!patient.profile.symptoms.includes(symptom)) {
      patient.profile.symptoms.push(symptom);
    }
  }

  for (const allergy of extracted.allergies || []) {
    if (!patient.profile.allergies.includes(allergy)) {
      patient.profile.allergies.push(allergy);
    }
  }

  for (const condition of extracted.conditions || []) {
    if (!patient.profile.conditions.includes(condition)) {
      patient.profile.conditions.push(condition);
    }
  }

  for (const medication of extracted.medications || []) {
    if (!patient.profile.medications.includes(medication)) {
      patient.profile.medications.push(medication);
    }
  }

  for (const duration of extracted.durations || []) {
    if (!patient.profile.durations.includes(duration)) {
      patient.profile.durations.push(duration);
    }
  }
}

function updateRisk(patientId, risk) {
  const patient = getPatientData(patientId);
  patient.latestRisk = risk;
}

function updateDoctorSummary(patientId, summary) {
  const patient = getPatientData(patientId);
  patient.doctorSummary = summary;
}

module.exports = {
  getPatientData,
  addChatMessage,
  updateProfile,
  updateRisk,
  updateDoctorSummary
};