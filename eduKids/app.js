const game = {
  voiceEnabled: true,
  players: [],
  activePlayerIndex: 0,
  selectedStartPlayerIndex: -1,
  snakeFocusKey: "",
  currentQuestion: null,
  questionRepeatTimerId: null,
  isAnswerLocked: false,
  isStartSequenceRunning: false,
  hasStarted: false
};

// Grade to base difficulty mapping
const GRADE_DIFFICULTY_MAP = {
  "Grade R": "easy",
  "Grade 1": "easy",
  "Grade 2": "easy",
  "Grade 3": "medium",
  "Grade 4": "medium",
  "Grade 5": "hard",
  "Grade 6": "hard",
  "Grade 7": "hard",
  "Grade 8": "hard",
  "Grade 9": "hard",
  "Grade 10": "hard",
  "Grade 11": "hard",
  "Grade 12": "hard"
};

// Level to available operations mapping
const LEVEL_OPERATIONS_MAP = {
  1: ["add"],
  2: ["add"],
  3: ["add"],
  4: ["add", "sub"],
  5: ["add", "sub"],
  6: ["add", "sub"],
  7: ["add", "sub", "mul"],
  8: ["add", "sub", "mul"],
  9: ["add", "sub", "mul"],
  10: ["add", "sub", "mul", "div"]
};

function getBaseDifficultyFromGrade(grade) {
  return GRADE_DIFFICULTY_MAP[grade] || "medium";
}

function getOperationsForLevel(level) {
  for (let l = level; l >= 1; l--) {
    if (LEVEL_OPERATIONS_MAP[l]) {
      return LEVEL_OPERATIONS_MAP[l];
    }
  }
  return ["add", "sub", "mul", "div"];
}

function getScaledDifficulty(baseGradeDifficulty, level) {
  const difficulties = ["easy", "medium", "hard"];
  let baseIndex = difficulties.indexOf(baseGradeDifficulty);
  if (baseIndex < 0) baseIndex = 1;
  
  // Every 8 levels, escalate difficulty one tier
  const levelTier = Math.floor((level - 1) / 8);
  const finalIndex = Math.min(baseIndex + levelTier, 2);
  return difficulties[finalIndex];
}

const API_BASE = "/api";

const avatarChoices = [
  { icon: "🦊", color: "#ff8a3d" },
  { icon: "🐼", color: "#36c2a6" },
  { icon: "🦁", color: "#5f8dff" },
  { icon: "🐨", color: "#e25fd7" },
  { icon: "🐸", color: "#f0b429" },
  { icon: "🐯", color: "#29b6f6" },
  { icon: "🐙", color: "#ef5350" },
  { icon: "🐵", color: "#66bb6a" }
];

const els = {
  setupCard: document.getElementById("setupCard"),
  gameArea: document.getElementById("gameArea"),
  nameForm: document.getElementById("nameForm"),
  avatarPreview: document.getElementById("avatarPreview"),
  kidAvatarSelect: document.getElementById("kidAvatarSelect"),
  kidGradeSelect: document.getElementById("kidGradeSelect"),
  kidNameInput: document.getElementById("kidNameInput"),
  kidList: document.getElementById("kidList"),
  startKidSelect: document.getElementById("startKidSelect"),
  startGameBtn: document.getElementById("startGameBtn"),
  playerSelect: document.getElementById("playerSelect"),
  voiceEnabled: document.getElementById("voiceEnabled"),
  readQuestionBtn: document.getElementById("readQuestionBtn"),
  newGameBtn: document.getElementById("newGameBtn"),
  question: document.getElementById("question"),
  countingAid: document.getElementById("countingAid"),
  choiceBoard: document.getElementById("choiceBoard"),
  answerForm: document.getElementById("answerForm"),
  answerInput: document.getElementById("answerInput"),
  feedback: document.getElementById("feedback"),
  score: document.getElementById("score"),
  streak: document.getElementById("streak"),
  levelLabel: document.getElementById("levelLabel"),
  progressText: document.getElementById("progressText"),
  snakeViewport: document.getElementById("snakeViewport"),
  snakeTrack: document.getElementById("snakeTrack")
};

function createCountingIcons(count, icon = "🍎") {
  const fragment = document.createDocumentFragment();
  const maxVisible = 16;
  const visibleCount = Math.min(count, maxVisible);

  for (let i = 0; i < visibleCount; i += 1) {
    const item = document.createElement("span");
    item.className = "counting-icon";
    item.textContent = icon;
    fragment.appendChild(item);
  }

  if (count > maxVisible) {
    const more = document.createElement("span");
    more.className = "counting-note";
    more.textContent = `+${count - maxVisible} more`;
    fragment.appendChild(more);
  }

  return fragment;
}

function appendCountingRow(container, labelText, count, icon) {
  const row = document.createElement("div");
  row.className = "counting-row";

  const label = document.createElement("span");
  label.className = "counting-label";
  label.textContent = labelText;

  const icons = document.createElement("div");
  icons.className = "counting-icons";
  icons.appendChild(createCountingIcons(count, icon));

  row.appendChild(label);
  row.appendChild(icons);
  container.appendChild(row);
}

function renderCountingAid(question) {
  if (!els.countingAid) {
    return;
  }

  els.countingAid.innerHTML = "";
  const activePlayer = getActivePlayer();
  if (!activePlayer || activePlayer.grade !== "Grade R") {
    return;
  }

  if (!question || (question.op !== "add" && question.op !== "sub")) {
    return;
  }

  const a = Number(question.a || 0);
  const b = Number(question.b || 0);
  if (a <= 0 || b <= 0) {
    return;
  }

  appendCountingRow(els.countingAid, "First", a, "🍎");

  const sign = document.createElement("p");
  sign.className = "counting-sign";
  sign.textContent = question.op === "add" ? "+" : "-";
  els.countingAid.appendChild(sign);

  appendCountingRow(els.countingAid, "Second", b, question.op === "add" ? "🍊" : "🍎");

  const hint = document.createElement("p");
  hint.className = "counting-note";
  hint.textContent = question.op === "add"
    ? "Count all the fruits together."
    : "Count first row, then take away the second row.";
  els.countingAid.appendChild(hint);
}

function isMultipleChoiceGrade(grade) {
  return grade === "Grade R" || grade === "Grade 1";
}

function isActivePlayerMultipleChoice() {
  const activePlayer = getActivePlayer();
  return !!activePlayer && isMultipleChoiceGrade(activePlayer.grade);
}

function getGradeRAnswerCap(player) {
  if (!player || player.grade !== "Grade R") {
    return null;
  }

  if (player.level < 10) {
    return 10;
  }

  if (player.level < 20) {
    return 20;
  }

  return null;
}

function generateMultipleChoiceAnswers(correctAnswer, maxExclusive = null) {
  const options = new Set([correctAnswer]);
  let safety = 0;

  while (options.size < 3 && safety < 80) {
    const offset = rand(1, 6);
    const direction = rand(0, 1) === 0 ? -1 : 1;
    let option = correctAnswer + (offset * direction);
    if (option < 0) {
      option = correctAnswer + offset;
    }

    if (maxExclusive !== null && option >= maxExclusive) {
      safety += 1;
      continue;
    }

    options.add(option);
    safety += 1;
  }

  if (options.size < 3) {
    for (let fallback = 0; options.size < 3 && fallback < 100; fallback += 1) {
      if (fallback === correctAnswer) {
        continue;
      }
      if (maxExclusive !== null && fallback >= maxExclusive) {
        break;
      }
      options.add(fallback);
    }
  }

  const shuffled = Array.from(options);
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = rand(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function renderAnswerMode() {
  if (!els.choiceBoard || !els.answerForm) {
    return;
  }

  els.choiceBoard.innerHTML = "";
  const useMultipleChoice = isActivePlayerMultipleChoice();

  if (!useMultipleChoice) {
    els.answerForm.style.display = "grid";
    if (els.answerInput) {
      els.answerInput.disabled = false;
    }
    return;
  }

  els.answerForm.style.display = "none";
  if (!game.currentQuestion || !Array.isArray(game.currentQuestion.choices)) {
    return;
  }

  game.currentQuestion.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-btn";
    button.textContent = String(choice);
    button.addEventListener("click", () => {
      handleAnswer(choice);
    });
    els.choiceBoard.appendChild(button);
  });
}

function toWordsQuestion(text) {
  return String(text || "")
    .replace(/\+/g, " plus ")
    .replace(/-/g, " minus ")
    .replace(/×/g, " times ")
    .replace(/÷/g, " divided by ")
    .replace(/\s+/g, " ")
    .trim();
}

function speakText(text) {
  if (!game.voiceEnabled || !("speechSynthesis" in window) || !text) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function speakTextAndWait(text, fallbackMs = 950) {
  if (!game.voiceEnabled || !("speechSynthesis" in window) || !text) {
    return sleep(fallbackMs);
  }

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    let settled = false;
    let safetyTimer = null;

    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      if (safetyTimer) {
        window.clearTimeout(safetyTimer);
        safetyTimer = null;
      }
      resolve();
    };

    utterance.onend = finish;
    utterance.onerror = finish;

    try {
      window.speechSynthesis.speak(utterance);
      // Safety net only: give plenty of time (100ms per character + 3s buffer).
      // The onend event is the primary completion signal.
      const safetyMs = Math.max(5000, text.length * 100 + 3000);
      safetyTimer = window.setTimeout(finish, safetyMs);
    } catch (_error) {
      finish();
    }
  });
}

async function runStartCountdown(player) {
  if (!player) {
    return;
  }

  const playerName = player.name || "Player";
  const startLine = `${playerName} prepare your self your game will start in`;
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  setFeedback(`${startLine} 5`, "good");
  await speakTextAndWait(startLine);

  for (let seconds = 5; seconds >= 1; seconds -= 1) {
    setFeedback(`${startLine} ${seconds}`, "good");
    await speakTextAndWait(String(seconds), 900);
  }

  setFeedback(`${playerName} time to start`, "good");
  await speakTextAndWait(`${playerName} time to start`, 900);
}

function speakQuestion(includeAnswer = false) {
  if (!game.currentQuestion) {
    return;
  }

  const spokenQuestion = toWordsQuestion(game.currentQuestion.text);
  if (includeAnswer) {
    speakText(`${spokenQuestion} equals ${game.currentQuestion.answer}`);
    return;
  }
  speakText(`${spokenQuestion}. What is the answer?`);
}

async function speakQuestionAndWait(includeAnswer = false) {
  if (!game.currentQuestion) {
    return;
  }

  const spokenQuestion = toWordsQuestion(game.currentQuestion.text);
  if (includeAnswer) {
    await speakTextAndWait(`${spokenQuestion} equals ${game.currentQuestion.answer}`, 1200);
    return;
  }

  await speakTextAndWait(`${spokenQuestion}. What is the answer?`, 1200);
}

async function speakAnswerFeedback(player, userAnswer, correctAnswer) {
  const playerName = (player && player.name) ? player.name : "Player";
  await speakTextAndWait(
    `${playerName}, that was not correct. You answered ${userAnswer}. The correct answer is ${correctAnswer}.`,
    1500
  );
}

function clearQuestionRepeatLoop() {
  if (game.questionRepeatTimerId) {
    window.clearTimeout(game.questionRepeatTimerId);
    game.questionRepeatTimerId = null;
  }
}

function scheduleQuestionRepeatLoop() {
  clearQuestionRepeatLoop();

  game.questionRepeatTimerId = window.setTimeout(() => {
    const waitingForTypedAnswer = (
      !isActivePlayerMultipleChoice()
      && els.answerInput
      && !els.answerInput.disabled
      && String(els.answerInput.value || "").trim() === ""
    );
    const waitingForChoiceAnswer = isActivePlayerMultipleChoice() && !!game.currentQuestion;

    const speechBusy = ("speechSynthesis" in window) && window.speechSynthesis.speaking;
    if (game.voiceEnabled && game.hasStarted && game.currentQuestion && (waitingForTypedAnswer || waitingForChoiceAnswer) && !speechBusy) {
      speakQuestion(false);
    }

    scheduleQuestionRepeatLoop();
  }, 8000);
}

function getGameOperationsForCurrentLevel() {
  const player = getActivePlayer();
  if (!player) return ["add"];
  return getOperationsForLevel(player.level);
}

function getGameDifficultyForCurrentLevel() {
  const player = getActivePlayer();
  if (!player) return "medium";
  const baseGradeDifficulty = getBaseDifficultyFromGrade(player.grade);
  return getScaledDifficulty(baseGradeDifficulty, player.level);
}

function renderSnakeProgress(player) {
  if (!els.snakeTrack || !els.snakeViewport) {
    return;
  }

  const totalNodes = Math.max(24, player.level + 10);
  els.snakeTrack.innerHTML = "";

  for (let level = 1; level <= totalNodes; level += 1) {
    const node = document.createElement("div");
    node.className = "snake-node";
    if (level < player.level) {
      node.classList.add("is-complete");
      node.textContent = "✓";
    } else if (level === player.level) {
      node.classList.add("is-current");
      node.textContent = String(level);
      node.dataset.current = "true";
    } else {
      node.classList.add("is-future");
      node.textContent = String(level);
    }

    const offset = level % 2 === 0 ? 9 : -9;
    node.style.setProperty("--node-offset", `${offset}px`);

    if (level % 4 === 0 || level === player.level || level === 1 || level === totalNodes) {
      const label = document.createElement("span");
      label.className = "snake-node-label";
      label.textContent = `L${level}`;
      node.appendChild(label);
    }

    els.snakeTrack.appendChild(node);
  }

  const focusKey = `${game.activePlayerIndex}:${player.level}`;
  if (game.snakeFocusKey !== focusKey) {
    game.snakeFocusKey = focusKey;
    const currentNode = els.snakeTrack.querySelector('[data-current="true"]');
    if (currentNode) {
      currentNode.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRangeByDifficulty() {
  const currentDifficulty = getGameDifficultyForCurrentLevel();
  if (currentDifficulty === "easy") {
    return { min: 1, max: 10 };
  }
  if (currentDifficulty === "hard") {
    return { min: 5, max: 40 };
  }
  return { min: 2, max: 20 };
}

function isAnswerWithinCap(player, answer) {
  const cap = getGradeRAnswerCap(player);
  if (cap === null) {
    return true;
  }
  return Number(answer) < cap;
}

function pickOperation() {
  const ops = getGameOperationsForCurrentLevel();
  return ops[rand(0, ops.length - 1)];
}

function getActivePlayer() {
  if (!game.players.length) {
    return null;
  }
  return game.players[game.activePlayerIndex];
}

function calculateLevelFromScore(score) {
  // Levels based on score thresholds: 0-149=L1, 150-299=L2, 300-449=L3, etc.
  return Math.floor(score / 150) + 1;
}

function createPlayer(name, avatarChoiceIndex, grade) {
  const choice = avatarChoices[avatarChoiceIndex] || avatarChoices[0];
  return {
    id: "",
    name,
    grade,
    icon: choice.icon,
    color: choice.color,
    score: 0,
    streak: 0,
    level: 1
  };
}

function createPlayerFromServer(kid) {
  const safeName = String(kid.name || "").trim();
  const fallback = avatarChoices[0];
  const score = Number(kid.score || 0);
  return {
    id: String(kid.id || ""),
    name: safeName,
    grade: String(kid.grade || "").trim(),
    icon: kid.icon || fallback.icon,
    color: kid.color || fallback.color,
    score: score,
    streak: 0,
    level: calculateLevelFromScore(score)
  };
}

async function saveKidProgressToServer(player) {
  if (!player || !player.id) {
    return;
  }

  const response = await fetch(`${API_BASE}/kids/${encodeURIComponent(player.id)}/progress`, {
    method: "PATCH",
    keepalive: true,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      score: player.score,
      level: player.level
    })
  });

  if (!response.ok) {
    throw new Error("Could not save score progress.");
  }
}

function saveKidProgressOnUnload(player) {
  if (!player || !player.id || !navigator.sendBeacon) {
    return;
  }

  const endpoint = `${API_BASE}/kids/${encodeURIComponent(player.id)}/progress`;
  const payload = {
    score: player.score,
    level: player.level
  };
  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  navigator.sendBeacon(endpoint, blob);
}

async function loadKidsFromServer() {
  const response = await fetch(`${API_BASE}/kids`);
  if (!response.ok) {
    throw new Error("Unable to load kid profiles.");
  }

  const payload = await response.json();
  const kids = Array.isArray(payload.kids) ? payload.kids : [];
  game.players = kids.map((kid) => createPlayerFromServer(kid));
  game.activePlayerIndex = 0;
}

async function saveKidToServer(player) {
  const response = await fetch(`${API_BASE}/kids`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: player.name,
      grade: player.grade,
      icon: player.icon,
      color: player.color
    })
  });

  if (response.status === 409) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "This kid has already been added.");
  }

  if (!response.ok) {
    throw new Error("Could not save this kid. Please try again.");
  }

  const payload = await response.json();
  return payload;
}

function resolveAvatarChoiceIndex() {
  const selectedValue = els.kidAvatarSelect.value;
  if (selectedValue === "random") {
    return rand(0, avatarChoices.length - 1);
  }
  return Number(selectedValue);
}

function updateAvatarPreview() {
  if (!els.avatarPreview) {
    return;
  }

  const selectedValue = els.kidAvatarSelect.value;
  if (selectedValue === "random") {
    els.avatarPreview.textContent = "🎲";
    els.avatarPreview.style.background = "linear-gradient(140deg, #fff7d8, #e7efff)";
    return;
  }

  const choiceIndex = Number(selectedValue);
  const choice = avatarChoices[choiceIndex] || avatarChoices[0];
  els.avatarPreview.textContent = choice.icon;
  els.avatarPreview.style.background = `color-mix(in srgb, ${choice.color} 24%, white)`;
}

function renderKidList() {
  els.kidList.innerHTML = "";
  game.players.forEach((player) => {
    const chip = document.createElement("div");
    chip.className = "kid-chip";
    chip.style.setProperty("--kid-color", player.color);

    const avatar = document.createElement("span");
    avatar.className = "kid-chip__avatar";
    avatar.textContent = player.icon;

    const name = document.createElement("span");
    name.textContent = player.name;

    const grade = document.createElement("span");
    grade.className = "kid-chip__grade";
    grade.textContent = player.grade || "No grade";

    chip.appendChild(avatar);
    chip.appendChild(name);
    chip.appendChild(grade);
    els.kidList.appendChild(chip);
  });
  renderStartKidSelect();
}

function renderStartKidSelect() {
  if (!els.startKidSelect || !els.startGameBtn) {
    return;
  }

  els.startKidSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select child";
  els.startKidSelect.appendChild(placeholder);

  game.players.forEach((player, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${player.icon} ${player.name} (${player.grade || "No grade"})`;
    els.startKidSelect.appendChild(option);
  });

  const hasPlayers = game.players.length > 0;
  els.startKidSelect.disabled = !hasPlayers;
  els.startKidSelect.value = "";
  game.selectedStartPlayerIndex = -1;
  els.startGameBtn.disabled = true;
}

function renderPlayerSelect() {
  els.playerSelect.innerHTML = "";
  game.players.forEach((player, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${player.icon} ${player.name} (${player.grade || "No grade"})`;
    els.playerSelect.appendChild(option);
  });
  els.playerSelect.disabled = game.players.length === 0;
  els.playerSelect.value = String(game.activePlayerIndex);
}

function createQuestion() {
  const activePlayer = getActivePlayer();
  const { min, max } = getRangeByDifficulty();
  let op = "add";
  let a = rand(min, max);
  let b = rand(min, max);
  let text = "";
  let answer = 0;

  let attempts = 0;
  do {
    attempts += 1;
    op = pickOperation();
    a = rand(min, max);
    b = rand(min, max);
    text = "";
    answer = 0;

    if (op === "add") {
      text = `${a} + ${b}`;
      answer = a + b;
    }

    if (op === "sub") {
      if (b > a) {
        [a, b] = [b, a];
      }
      text = `${a} - ${b}`;
      answer = a - b;
    }

    if (op === "mul") {
      const currentDifficulty = getGameDifficultyForCurrentLevel();
      if (currentDifficulty === "easy") {
        a = rand(1, 10);
        b = rand(1, 10);
      }
      text = `${a} × ${b}`;
      answer = a * b;
    }

    if (op === "div") {
      b = rand(min, Math.max(min, Math.min(max, 12)));
      answer = rand(min, max);
      a = b * answer;
      text = `${a} ÷ ${b}`;
    }
  } while (!isAnswerWithinCap(activePlayer, answer) && attempts < 80);

  // Safety fallback: guarantee Grade R cap is respected even if random retries miss.
  if (!isAnswerWithinCap(activePlayer, answer)) {
    const cap = getGradeRAnswerCap(activePlayer);
    if (cap !== null) {
      op = "add";
      a = rand(0, cap - 1);
      b = rand(0, cap - 1 - a);
      answer = a + b;
      text = `${a} + ${b}`;
    }
  }

  const answerCap = getGradeRAnswerCap(activePlayer);
  const choices = isActivePlayerMultipleChoice()
    ? generateMultipleChoiceAnswers(answer, answerCap)
    : null;
  game.currentQuestion = { text, answer, op, a, b, choices };
  game.isAnswerLocked = false;
  els.question.textContent = `${text} = ?`;
  renderCountingAid(game.currentQuestion);
  renderAnswerMode();
  // Do NOT auto-speak here — callers must await feedback speech first,
  // then explicitly call speakQuestionAndWait() to avoid cancelling in-progress speech.
}

function setFeedback(msg, type) {
  els.feedback.textContent = msg;
  els.feedback.classList.remove("good", "bad");
  if (type) {
    els.feedback.classList.add(type);
  }
}

function updateStats() {
  const player = getActivePlayer();
  if (!player) {
    return;
  }
  els.score.textContent = String(player.score);
  els.streak.textContent = String(player.streak);
  els.levelLabel.textContent = `${player.icon} ${player.name} - Level ${player.level}`;
  els.levelLabel.style.background = `linear-gradient(130deg, ${player.color}, #2a3555)`;
  const nextLevelThreshold = player.level * 150;
  const currentLevelThreshold = (player.level - 1) * 150;
  const progressInLevel = player.score - currentLevelThreshold;
  const pointsNeededForLevel = 150;
  els.progressText.textContent = `${progressInLevel} / ${pointsNeededForLevel}`;
  renderSnakeProgress(player);
}

function handleLevelProgress(player) {
  const newLevel = calculateLevelFromScore(player.score);
  if (newLevel > player.level) {
    player.level = newLevel;
    setFeedback(`Level up! Now Level ${newLevel}, ${player.name}!`, "good");
  }
}



async function resetActivePlayerGame() {
  const player = getActivePlayer();
  if (!player) {
    return;
  }

  player.score = 0;
  player.streak = 0;
  player.level = 1;
  if (els.answerInput) {
    els.answerInput.disabled = false;
    els.answerInput.value = "";
  }
  setFeedback(`New game started for ${player.name}!`, "good");
  createQuestion();
  updateStats();
  await saveKidProgressToServer(player).catch(() => {
    setFeedback("Could not sync score right now. Will retry on next change.", "bad");
  });
  await speakQuestionAndWait(false);
  scheduleQuestionRepeatLoop();
  if (els.answerInput && !isActivePlayerMultipleChoice()) {
    els.answerInput.focus();
  }
}

async function switchActivePlayer(index) {
  if (index < 0 || index >= game.players.length) {
    return;
  }
  game.activePlayerIndex = index;
  game.snakeFocusKey = "";
  if (els.answerInput) {
    els.answerInput.disabled = false;
    els.answerInput.value = "";
  }
  createQuestion();
  updateStats();
  setFeedback(`Now playing: ${game.players[index].name}`);
  await speakQuestionAndWait(false);
  scheduleQuestionRepeatLoop();
  if (!isActivePlayerMultipleChoice() && els.answerInput) {
    els.answerInput.focus();
  }
}

async function handleAnswer(userAnswer) {
  const player = getActivePlayer();
  if (!player || !game.currentQuestion || game.isAnswerLocked || !game.hasStarted) {
    return;
  }

  game.isAnswerLocked = true;

  const numericAnswer = Number(userAnswer);
  if (Number.isNaN(numericAnswer)) {
    setFeedback("Please choose or type a number.", "bad");
    game.isAnswerLocked = false;
    return;
  }

  if (numericAnswer === game.currentQuestion.answer) {
    await speakQuestionAndWait(true);
    player.score += 10 + player.streak;
    player.streak += 1;
    handleLevelProgress(player);
    setFeedback(`Correct, ${player.name}!`, "good");
  } else {
    await speakAnswerFeedback(player, numericAnswer, game.currentQuestion.answer);
    player.streak = 0;
    player.score = Math.max(0, player.score - 4);
    setFeedback(`Oops! Correct answer: ${game.currentQuestion.answer}`, "bad");
  }

  await saveKidProgressToServer(player).catch(() => {
    setFeedback("Could not sync score right now. Will retry on next change.", "bad");
  });

  createQuestion();
  updateStats();
  if (els.answerInput) {
    els.answerInput.value = "";
  }

  await speakQuestionAndWait(false);
  scheduleQuestionRepeatLoop();

  if (els.answerInput && !isActivePlayerMultipleChoice()) {
    els.answerInput.focus();
  }
}

async function submitAnswer(event) {
  event.preventDefault();
  if (isActivePlayerMultipleChoice()) {
    return;
  }

  if (!els.answerInput || els.answerInput.disabled) {
    return;
  }

  await handleAnswer(els.answerInput.value);
}

async function addKid(event) {
  event.preventDefault();
  const rawName = els.kidNameInput.value.trim();
  const grade = String(els.kidGradeSelect.value || "").trim();
  const avatarChoiceIndex = resolveAvatarChoiceIndex();
  if (!rawName || !grade) {
    setFeedback("Please enter name and select grade.", "bad");
    return;
  }

  const name = rawName.slice(0, 20);
  const exists = game.players.some((player) => player.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    setFeedback("That name already exists. Add a different one.", "bad");
    els.kidNameInput.select();
    return;
  }

  const newPlayer = createPlayer(name, avatarChoiceIndex, grade);

  try {
    const payload = await saveKidToServer(newPlayer);
    if (payload && payload.kid && payload.kid.id) {
      newPlayer.id = String(payload.kid.id);
    }
  } catch (error) {
    setFeedback(error.message, "bad");
    return;
  }

  game.players.push(newPlayer);
  els.kidNameInput.value = "";
  els.kidGradeSelect.value = "";
  if (els.kidAvatarSelect.value !== "random") {
    els.kidAvatarSelect.value = String((avatarChoiceIndex + 1) % avatarChoices.length);
  }
  updateAvatarPreview();
  renderKidList();
  renderPlayerSelect();
  setFeedback(`${name} added! Add more kids or start game.`, "good");
  els.kidNameInput.focus();
}

async function startGameSession() {
  if (!game.players.length || game.isStartSequenceRunning) {
    return;
  }

  if (game.selectedStartPlayerIndex < 0 || game.selectedStartPlayerIndex >= game.players.length) {
    setFeedback("Please select the child who is playing first.", "bad");
    return;
  }

  game.isStartSequenceRunning = true;
  game.hasStarted = false;

  try {
    game.activePlayerIndex = game.selectedStartPlayerIndex;
    els.setupCard.classList.add("hidden");
    if (els.gameArea) {
      els.gameArea.classList.remove("hidden");
      els.gameArea.setAttribute("aria-hidden", "false");
    }

    renderPlayerSelect();
    const activePlayer = getActivePlayer();
    await runStartCountdown(activePlayer);

    game.hasStarted = true;
    switchActivePlayer(game.activePlayerIndex);
  } finally {
    game.isStartSequenceRunning = false;
  }
}

function bindEvents() {
  els.nameForm.addEventListener("submit", (event) => {
    addKid(event);
  });
  els.startGameBtn.addEventListener("click", async () => {
    await startGameSession();
  });
  els.kidAvatarSelect.addEventListener("change", updateAvatarPreview);

  if (els.startKidSelect) {
    els.startKidSelect.addEventListener("change", (event) => {
      const rawValue = String(event.target.value || "").trim();
      if (rawValue === "") {
        game.selectedStartPlayerIndex = -1;
        els.startGameBtn.disabled = true;
        return;
      }

      const index = Number(rawValue);
      const valid = Number.isInteger(index) && index >= 0 && index < game.players.length;
      game.selectedStartPlayerIndex = valid ? index : -1;
      els.startGameBtn.disabled = !valid;
    });
  }

  els.playerSelect.addEventListener("change", (event) => {
    const index = Number(event.target.value);
    switchActivePlayer(index);
  });

  els.voiceEnabled.addEventListener("change", (event) => {
    game.voiceEnabled = event.target.checked;
    if (!game.voiceEnabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      clearQuestionRepeatLoop();
      return;
    }

    // Voice was turned back on: restart the repeat loop and replay once.
    speakQuestion(false);
    scheduleQuestionRepeatLoop();
  });

  els.readQuestionBtn.addEventListener("click", () => {
    speakQuestion(false);
  });

  els.newGameBtn.addEventListener("click", async () => {
    await resetActivePlayerGame();
  });
  els.answerForm.addEventListener("submit", (event) => {
    submitAnswer(event);
  });

  els.answerInput.addEventListener("input", () => {
    if (isActivePlayerMultipleChoice()) {
      return;
    }

    const hasText = String(els.answerInput.value || "").trim().length > 0;
    if (hasText) {
      clearQuestionRepeatLoop();
      return;
    }

    scheduleQuestionRepeatLoop();
  });

  window.addEventListener("beforeunload", () => {
    const activePlayer = getActivePlayer();
    clearQuestionRepeatLoop();
    saveKidProgressOnUnload(activePlayer);
  });
}

async function init() {
  bindEvents();
  setFeedback("Loading kids...");
  try {
    await loadKidsFromServer();
    setFeedback("Add your kids, then click Start Playing.");
  } catch (error) {
    setFeedback("Backend is offline. Start the server to save kid profiles.", "bad");
  }
  updateAvatarPreview();
  game.voiceEnabled = els.voiceEnabled ? els.voiceEnabled.checked : true;
  game.hasStarted = false;
  renderKidList();
  renderPlayerSelect();
}

init();
