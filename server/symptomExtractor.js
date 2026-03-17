const KNOWN_SYMPTOMS = [
  "headache",
  "nausea",
  "dizziness",
  "fever",
  "cough",
  "sore throat",
  "chest pain",
  "shortness of breath",
  "trouble breathing",
  "fatigue",
  "vomiting",
  "diarrhea",
  "blurred vision",
  "tightness in chest"
];

const KNOWN_CONDITIONS = [
  "asthma",
  "diabetes",
  "hypertension",
  "high blood pressure",
  "migraine"
];

const KNOWN_ALLERGIES = [
  "penicillin",
  "peanuts",
  "shellfish",
  "latex"
];

const KNOWN_MEDICATIONS = [
  "insulin",
  "ibuprofen",
  "acetaminophen",
  "albuterol"
];

function extractEntities(message) {
  const text = message.toLowerCase();

  const symptoms = KNOWN_SYMPTOMS.filter(item => text.includes(item));
  const conditions = KNOWN_CONDITIONS.filter(item => text.includes(item));
  const allergies = KNOWN_ALLERGIES.filter(item => text.includes(item));
  const medications = KNOWN_MEDICATIONS.filter(item => text.includes(item));

  const durations = [];
  const durationMatches = text.match(
    /\b(\d+\s?(day|days|week|weeks|hour|hours)|today|yesterday|since yesterday|for \d+\s?(day|days|week|weeks|hour|hours))\b/g
  );
  if (durationMatches) {
    durations.push(...durationMatches);
  }

  return {
    symptoms,
    conditions,
    allergies,
    medications,
    durations
  };
}

module.exports = { extractEntities };