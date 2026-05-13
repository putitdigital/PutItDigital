const form = document.getElementById("upgradeForm");
const runBtn = document.getElementById("runBtn");
const statusEl = document.getElementById("status");

const resultCard = document.getElementById("resultCard");
const resultMessage = document.getElementById("resultMessage");
const originalPath = document.getElementById("originalPath");
const improvedPath = document.getElementById("improvedPath");
const reportPath = document.getElementById("reportPath");
const previewLink = document.getElementById("previewLink");
const improvementsJson = document.getElementById("improvementsJson");

function setBusy(isBusy) {
  runBtn.disabled = isBusy;
  runBtn.textContent = isBusy ? "Upgrading..." : "Upgrade Website";
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b91c1c" : "#0f172a";
}

function renderResult(data) {
  resultCard.hidden = false;
  resultMessage.textContent = data.message;
  originalPath.textContent = data.files.originalPath;
  improvedPath.textContent = data.files.improvedPath;
  reportPath.textContent = data.files.reportPath;
  previewLink.href = data.files.improvedPreview;
  improvementsJson.textContent = JSON.stringify(data.report.improvements, null, 2);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    url: String(formData.get("url") || "").trim(),
    project: String(formData.get("project") || "improved-site").trim(),
    depth: Number(formData.get("depth") || 1),
    mode: String(formData.get("mode") || "balanced")
  };

  if (!payload.url) {
    setStatus("Please provide a URL.", true);
    return;
  }

  if (Number.isNaN(payload.depth) || payload.depth < 1 || payload.depth > 5) {
    setStatus("Depth must be between 1 and 5.", true);
    return;
  }

  setBusy(true);
  setStatus("Downloading and upgrading website...");

  try {
    const response = await fetch("/api/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Upgrade failed");
    }

    renderResult(data);
    setStatus("Completed successfully.");
  } catch (error) {
    setStatus(error.message || "Something went wrong.", true);
  } finally {
    setBusy(false);
  }
});
