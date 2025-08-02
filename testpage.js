// ------------ TOP: Config and Utilities -------------
const totalQuestions = 100;
let currentSection = 'A';
let currentQuestionIndex = 0; 

let totalSeconds = 180 * 60;
let timer;
let statsBarVisible = true;


// State Arrays
let questionStatusA = Array(totalQuestions).fill('unseen');
let questionStatusB = Array(totalQuestions).fill('unseen');
let questionLockA = Array(totalQuestions).fill(false);
let questionLockB = Array(totalQuestions).fill(false);
let selectedOptionsA = Array(totalQuestions).fill(null);
let selectedOptionsB = Array(totalQuestions).fill(null);

let fullQuestionSetA = [];
let fullQuestionSetB = [];

// --------- Utility Functions ------------

// Get parameter from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Optional: Shuffle (if you want to shuffle questions)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ------------ Load Questions --------------
if (document.getElementById('questionsPanel')) {
  const mockTestNumber = getQueryParam('mock') || '1';
  const jsonFileName = `imu${mockTestNumber}.json`;

  fetch(jsonFileName)
    .then(res => {
      if (!res.ok) throw new Error(`Couldn't load ${jsonFileName}`);
      return res.json();
    })
    .then(data => {
      initializeQuestions(data);
      startTimer(); // start timer only after questions load
    })
    .catch(err => {
      alert(`Failed to load questions for mock test ${mockTestNumber}`);
      console.error(err);
    });
}



// Fill question arrays and start the test
function initializeQuestions(data) {
  // Use shuffle([...data.A.english]) if you want questions shuffled each load

  // --- SECTION A ---
  const englishA   = shuffle([...data.A.english]);
  const gkA        = shuffle([...data.A.gk]);
  const apptitudeA = shuffle([...data.A.apptitude]);
  fullQuestionSetA = [...englishA, ...gkA, ...apptitudeA].slice(0, totalQuestions);

  // --- SECTION B ---
  const physicsB   =shuffle([...data.B.physics]);
  const mathsB     =shuffle([...data.B.maths]);
  const chemistryB =shuffle( [...data.B.chemistry]);
  fullQuestionSetB = [...physicsB, ...mathsB, ...chemistryB].slice(0, totalQuestions);

  changeSection('A'); // Start with section A
} 

 // Start the timer here
  startTimer();

// ------------ UI and Logic Functions ---------

function changeSection(section) {
  currentSection = section;
  currentQuestionIndex = 0;
  document.getElementById("statsSidebarA").classList.toggle("hidden", section !== 'A');
  document.getElementById("statsSidebarB").classList.toggle("hidden", section !== 'B');
  renderQuestionStats();
  renderCurrentQuestion();
}

function renderQuestionStats() {
  const container = currentSection === 'A'
    ? document.getElementById('questionStatsA')
    : document.getElementById('questionStatsB');
  const questionStatus = currentSection === 'A' ? questionStatusA : questionStatusB;
  container.innerHTML = '';
  for (let i = 0; i < totalQuestions; i++) {
    const box = document.createElement('div');
    box.classList.add('question-box');
    const status = questionStatus[i];
    if (status && status !== 'unseen') box.classList.add(status);
    if (i === currentQuestionIndex) box.classList.add('active-question');
    box.textContent = i + 1;
    box.onclick = () => {
      currentQuestionIndex = i;
      renderCurrentQuestion();
      renderQuestionStats();
    };
    container.appendChild(box);
  }
}

function renderCurrentQuestion() {
  const questionSet = currentSection === 'A' ? fullQuestionSetA : fullQuestionSetB;
  const selectedOptions = currentSection === 'A' ? selectedOptionsA : selectedOptionsB;
  const q = questionSet[currentQuestionIndex];
  const selected = selectedOptions[currentQuestionIndex];
  let html = `<div><h2>Question ${currentQuestionIndex + 1} of ${totalQuestions}</h2>`;
  if (q.paragraph) {
    html += `<div class="paragraph-box"><p>${q.paragraph}</p></div>`;
  }
  html += `<p>${q.question}</p><div class="options-container">`;
  q.options.forEach((opt, i) => {
    if (q.imageOptions) {
      html += `
        <button onclick="selectOption(${i})" class="option-button ${selected === i ? 'selected' : ''}">
          <img src="${opt}" alt="Option ${i + 1}" style="width:100px;height:auto;" />
        </button>`;
    } else {
      html += `
        <button onclick="selectOption(${i})" class="option-button ${selected === i ? 'selected' : ''}">
          ${String.fromCharCode(65 + i)}) ${opt}
        </button>`;
    }
  });
  html += '</div></div>';
  document.getElementById("questionsPanel").innerHTML = html;
}

function selectOption(selectedIndex) {
  let statusArray, selectedOptions;
  if (currentSection === 'A') {
    statusArray = questionStatusA;
    selectedOptions = selectedOptionsA;
  } else {
    statusArray = questionStatusB;
    selectedOptions = selectedOptionsB;
  }
  selectedOptions[currentQuestionIndex] = selectedIndex;
  statusArray[currentQuestionIndex] = 'answered';
  renderQuestionStats();
  renderCurrentQuestion();
}

function updateStatusAndMove(status) {
  const questionStatus = currentSection === 'A' ? questionStatusA : questionStatusB;
  const questionLock = currentSection === 'A' ? questionLockA : questionLockB;
  if (!questionLock[currentQuestionIndex]) {
    questionStatus[currentQuestionIndex] = status;
    questionLock[currentQuestionIndex] = true;
  }
  currentQuestionIndex = (currentQuestionIndex + 1) % totalQuestions;
  renderQuestionStats();
  renderCurrentQuestion();
}

function markAnswered() {
  const selected = currentSection === 'A' ? selectedOptionsA : selectedOptionsB;
  if (selected[currentQuestionIndex] === null) {
    alert("Please select an option before saving.");
    return;
  }
  updateStatusAndMove('answered');
}

function markForReview() {
  const statusArray = currentSection === 'A' ? questionStatusA : questionStatusB;
  statusArray[currentQuestionIndex] = 'review';
  currentQuestionIndex = (currentQuestionIndex + 1) % totalQuestions;
  renderQuestionStats();
  renderCurrentQuestion();
}

function goBackward() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderCurrentQuestion();
    renderQuestionStats();
  } else {
    alert("You're already on the first question.");
  }
}

function markSkipped() {
  const statusArray = currentSection === 'A' ? questionStatusA : questionStatusB;
  if (statusArray[currentQuestionIndex] === 'unseen') {
    updateStatusAndMove('skipped');
  } else {
    currentQuestionIndex = (currentQuestionIndex + 1) % totalQuestions;
    renderQuestionStats();
    renderCurrentQuestion();
  }
}

function calculateSectionScore(questions, answers) {
  let score = 0, correct = 0, attempted = 0;
  questions.forEach((q, index) => {
    const userAnswer = answers[index];
    if (userAnswer !== null && userAnswer !== undefined) {
      attempted++;
      if (userAnswer == q.answer) {
        score += 1;
        correct++;
      } else {
        score -= 0.25;
      }
    }
  });
  return {
    score,
    correct,
    attempted,
    accuracy: attempted > 0 ? (correct / attempted * 100).toFixed(2) : 0
  };
}

function calculateCombinedScore(fullSetA, answersA, fullSetB, answersB) {
  const resultA = calculateSectionScore(fullSetA, answersA);
  const resultB = calculateSectionScore(fullSetB, answersB);
  const totalScore = resultA.score + resultB.score;
  const totalCorrect = resultA.correct + resultB.correct;
  const totalAttempted = resultA.attempted + resultB.attempted;
  const totalQuestions = fullSetA.length + fullSetB.length;
  const accuracy = totalAttempted > 0 ? ((totalCorrect / totalAttempted) * 100).toFixed(2) : 0;
  return {
    sectionA: resultA,
    sectionB: resultB,
    total: {
      score: totalScore,
      correct: totalCorrect,
      attempted: totalAttempted,
      totalQuestions,
      accuracy
    }
  };
} 


function toggleStatsBar() {
  const currentStatsBar = document.getElementById(`statsSidebar${currentSection}`);
  const toggleBtn = document.getElementById('statsToggleBtn');
  const container = document.querySelector('.container');

  if (statsBarVisible) {
    currentStatsBar.style.transform = 'translateX(100%)';
    toggleBtn.classList.remove('stats-open');
    toggleBtn.textContent = '📊';
    if (container) container.style.paddingRight = '20px';
    statsBarVisible = false;
  } else {
    currentStatsBar.style.transform = 'translateX(0)';
    toggleBtn.classList.add('stats-open');
    toggleBtn.textContent = '❌';
    if (container && window.innerWidth > 768) {
      container.style.paddingRight = '270px';
    }
    statsBarVisible = true;
  }
}

// Responsive padding for stats bar
window.addEventListener('resize', () => {
  const container = document.querySelector('.container');
  if (container) {
    if (window.innerWidth <= 768) {
      container.style.paddingRight = '15px';
    } else if (statsBarVisible) {
      container.style.paddingRight = '270px';
    } else {
      container.style.paddingRight = '20px';
    }
  }
}); 



//timer logic 
 // Start the timer here
  startTimer();

function startTimer() {
  updateTimerDisplay(totalSeconds); // Initialize display immediately
  timer = setInterval(() => {
    totalSeconds--;
    if (totalSeconds < 0) {
      clearInterval(timer);
      alert("⏰ Time's up! Submitting your test.");
      submitTest(); // Your existing submit function
      return;
    }
    updateTimerDisplay(totalSeconds);
  }, 1000);
}

function updateTimerDisplay(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  document.getElementById("timer").textContent =
    `${String(hours).padStart(2, '0')}:` +
    `${String(minutes).padStart(2, '0')}:` +
    `${String(secs).padStart(2, '0')}`;
}


// Optional: Progress bar (if you use it)
function updateProgressBar(current, total) {
  const percent = (current / total) * 100;
  document.getElementById('quizProgressBar').style.width = percent + '%';
}

// Sidebar controls and responsive logic if you use them
// (copy over if needed from your original if they interact with your HTML)

// Test submission
function submitTest() {
  const confirmed = confirm("Are you sure you want to submit the test?");
  if (!confirmed) return;
  const combinedResult = calculateCombinedScore(fullQuestionSetA, selectedOptionsA, fullQuestionSetB, selectedOptionsB);
  localStorage.setItem('testScore', combinedResult.total.score);
  localStorage.setItem('correct', combinedResult.total.correct);
  localStorage.setItem('attempted', combinedResult.total.attempted);
  localStorage.setItem('accuracy', combinedResult.total.accuracy);
  localStorage.setItem('sectionAScore', combinedResult.sectionA.score);
  localStorage.setItem('sectionACorrect', combinedResult.sectionA.correct);
  localStorage.setItem('sectionBScore', combinedResult.sectionB.score);
  localStorage.setItem('sectionBCorrect', combinedResult.sectionB.correct);
  alert("Test submitted successfully!");
  window.location.href = "thankyou.html";
}


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
});

 document.addEventListener('copy', function(e) {
    e.preventDefault(); // Prevent the default copy action
    const customMessage = "sorry brruh ,Copying is not allowed from this page. focus on studies . ";
    if (e.clipboardData) {
      e.clipboardData.setData('text/plain', customMessage);
    } else if (window.clipboardData) { // For IE
      window.clipboardData.setData('Text', customMessage);
    }
  });