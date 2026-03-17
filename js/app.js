const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const followUpBtn = document.getElementById("followUpBtn");
const clearBtn = document.getElementById("clearBtn");

const profileBox = document.getElementById("profileBox");
const riskBadge = document.getElementById("riskBadge");
const riskReasonText = document.getElementById("riskReasonText");
const routingBox = document.getElementById("routingBox");
const summaryBox = document.getElementById("summaryBox");
const ibmBox = document.getElementById("ibmBox");
const patientQueue = document.getElementById("patientQueue");
const selectedPatientCard = document.getElementById("selectedPatientCard");
const timelineBox = document.getElementById("timelineBox");

const tabButtons = document.querySelectorAll(".tab-btn");
const views = document.querySelectorAll(".view");

const patientName = document.getElementById("patientName");
const patientAge = document.getElementById("patientAge");
const patientHistory = document.getElementById("patientHistory");
const patientMeds = document.getElementById("patientMeds");

let selectedQueueId = "demo-patient";

const demoQueue = [
  {
    id: "demo-patient",
    name: "JEANNETTE",
    age: 22,
    risk: "Low",
    concern: "Peanut exposure and breathing concern",
    route: "Primary care or telehealth",
    history: "Asthma",
    meds: "Inhaler and peanut allergy"
  },
  {
    id: "patient-2",
    name: "MARIA",
    age: 34,
    risk: "Moderate",
    concern: "Fever and dizziness",
    route: "Urgent care",
    history: "Migraine",
    meds: "Ibuprofen"
  },
  {
    id: "patient-3",
    name: "ALEX",
    age: 61,
    risk: "High",
    concern: "Chest pain and shortness of breath",
    route: "Emergency care",
    history: "Hypertension",
    meds: "Blood pressure medication"
  },
  {
    id: "patient-4",
    name: "SOFIA",
    age: 29,
    risk: "Low",
    concern: "Sore throat and mild fever",
    route: "Telehealth",
    history: "None reported",
    meds: "None reported"
  }
];

const localTimeline = [];

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function setActiveView(viewId) {
  views.forEach(view => {
    view.classList.toggle("active", view.id === viewId);
  });

  tabButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === viewId);
  });
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    setActiveView(btn.dataset.view);
  });
});

function renderProfile(profile) {
  profileBox.innerHTML = `
    <div><strong>Name:</strong> ${patientName.value || "Unknown"}</div>
    <div><strong>Age:</strong> ${patientAge.value || "Unknown"}</div>
    <div><strong>Symptoms:</strong> ${profile.symptoms.join(", ") || "None"}</div>
    <div><strong>Conditions:</strong> ${profile.conditions.join(", ") || "None"}</div>
    <div><strong>Allergies:</strong> ${profile.allergies.join(", ") || "None"}</div>
    <div><strong>Medications:</strong> ${profile.medications.join(", ") || "None"}</div>
    <div><strong>Durations:</strong> ${profile.durations.join(", ") || "None"}</div>
  `;
}

function renderRisk(risk) {
  const level = risk.level.toLowerCase();
  riskBadge.className = `risk-pill ${level}`;
  riskBadge.textContent = `${risk.level.toUpperCase()} RISK`;
  riskReasonText.textContent = risk.reasons.join(" ");
}

function renderIBM(ibmAgent) {
  routingBox.textContent = ibmAgent.providerRecommendation || "Primary care or telehealth";

  ibmBox.innerHTML = `
    <div><strong>Recommendation:</strong> ${ibmAgent.providerRecommendation}</div>
    <div><strong>Urgency:</strong> ${ibmAgent.estimatedUrgency}</div>
    <div><strong>Notes:</strong> ${ibmAgent.notes}</div>
  `;
}

function renderQueue() {
  patientQueue.innerHTML = "";

  demoQueue.forEach(patient => {
    const item = document.createElement("div");
    item.className = `queue-item ${selectedQueueId === patient.id ? "active" : ""}`;

    item.innerHTML = `
      <div class="queue-top">
        <div class="queue-name">${patient.name}</div>
        <div class="queue-meta">${patient.risk}</div>
      </div>
      <div class="queue-meta">Age ${patient.age}</div>
      <div class="queue-meta">${patient.concern}</div>
    `;

    item.addEventListener("click", () => {
      selectedQueueId = patient.id;
      renderQueue();
      renderSelectedPatient(patient);
    });

    patientQueue.appendChild(item);
  });
}

function renderSelectedPatient(patient) {
  selectedPatientCard.innerHTML = `
    <div><strong>Name:</strong> ${patient.name}</div>
    <div><strong>Age:</strong> ${patient.age}</div>
    <div><strong>Risk:</strong> ${patient.risk}</div>
    <div><strong>Concern:</strong> ${patient.concern}</div>
    <div><strong>History:</strong> ${patient.history}</div>
    <div><strong>Medications / Allergies:</strong> ${patient.meds}</div>
    <div><strong>Suggested Route:</strong> ${patient.route}</div>
  `;
}

function renderTimeline() {
  timelineBox.innerHTML = "";

  if (!localTimeline.length) {
    timelineBox.innerHTML = `<div class="timeline-item">No timeline data yet.</div>`;
    return;
  }

  localTimeline
    .slice()
    .reverse()
    .forEach(entry => {
      const div = document.createElement("div");
      div.className = "timeline-item";
      div.innerHTML = `
        <div><strong>${entry.time}</strong></div>
        <div><strong>Symptoms:</strong> ${entry.concern}</div>
        <div><strong>Risk:</strong> ${entry.risk}</div>
        <div><strong>Route:</strong> ${entry.route}</div>
      `;
      timelineBox.appendChild(div);
    });
}

function updateTopMetrics() {
  const highRiskCount = demoQueue.filter(p => p.risk === "High").length;
  document.getElementById("metricPatients").textContent = demoQueue.length;
  document.getElementById("metricHighRisk").textContent = highRiskCount;
  document.getElementById("metricFollowups").textContent = "2";
  document.getElementById("metricPending").textContent = "3";
}

function currentTimeLabel() {
  return new Date().toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  addMessage(
    `Patient: ${patientName.value}, age ${patientAge.value}. Symptoms: ${message}`,
    "user"
  );

  messageInput.value = "";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        patientId: "demo-patient",
        message: `
Name: ${patientName.value}
Age: ${patientAge.value}
Medical History: ${patientHistory.value}
Medications / Allergies: ${patientMeds.value}
Current Concern: ${message}
        `
      })
    });

    const data = await response.json();

    if (data.error) {
      addMessage(data.error, "bot");
      return;
    }

    addMessage(data.reply, "bot");

    renderProfile(data.profile);
    renderRisk(data.risk);
    renderIBM(data.ibmAgent);
    summaryBox.textContent = data.doctorSummary;

    const queuePatient = demoQueue.find(p => p.id === "demo-patient");
    if (queuePatient) {
      queuePatient.name = patientName.value || queuePatient.name;
      queuePatient.age = patientAge.value || queuePatient.age;
      queuePatient.concern = message;
      queuePatient.history = patientHistory.value;
      queuePatient.meds = patientMeds.value;
      queuePatient.risk = data.risk.level;
      queuePatient.route = data.ibmAgent.providerRecommendation;
    }

    localTimeline.push({
      time: currentTimeLabel(),
      concern: message,
      risk: data.risk.level,
      route: data.ibmAgent.providerRecommendation
    });

    renderQueue();
    renderSelectedPatient(queuePatient);
    renderTimeline();
  } catch (error) {
    console.error(error);
    addMessage("Unable to contact server right now.", "bot");
  }
}

function simulateFollowUp() {
  addMessage(
    "Follow-up agent check-in: Are your symptoms improving, staying the same, or getting worse?",
    "bot"
  );

  localTimeline.push({
    time: currentTimeLabel(),
    concern: "24-hour follow-up sent",
    risk: "Follow-up",
    route: "Awaiting patient response"
  });

  renderTimeline();
}

function clearChat() {
  chatBox.innerHTML = "";
  addMessage(
    "Hi, I’m your intake assistant. Tell me your symptoms, medical history, allergies, or medications.",
    "bot"
  );
}

sendBtn.addEventListener("click", sendMessage);
followUpBtn.addEventListener("click", simulateFollowUp);
clearBtn.addEventListener("click", clearChat);

messageInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

renderQueue();
renderSelectedPatient(demoQueue[0]);
renderTimeline();
updateTopMetrics();
clearChat();