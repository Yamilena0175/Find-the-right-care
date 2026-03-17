function evaluateRisk(profile) {
  const symptoms = profile.symptoms.map(s => s.toLowerCase());

  const hasChestPain = symptoms.includes("chest pain");
  const hasBreathing =
    symptoms.includes("shortness of breath") ||
    symptoms.includes("trouble breathing") ||
    symptoms.includes("tightness in chest");

  const hasBlurredVision = symptoms.includes("blurred vision");
  const hasDizziness = symptoms.includes("dizziness");
  const hasFever = symptoms.includes("fever");

  if (hasChestPain && hasBreathing) {
    return {
      level: "High",
      reasons: ["Chest pain combined with breathing symptoms may need urgent care."]
    };
  }

  if (hasBlurredVision && hasDizziness) {
    return {
      level: "Moderate",
      reasons: ["Blurred vision with dizziness should be evaluated soon."]
    };
  }

  if (hasFever) {
    return {
      level: "Moderate",
      reasons: ["Fever may require follow-up depending on duration and severity."]
    };
  }

  return {
    level: "Low",
    reasons: ["No immediate high-risk symptom pattern detected from current chat."]
  };
}

module.exports = { evaluateRisk };