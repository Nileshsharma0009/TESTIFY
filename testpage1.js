const totalQuestions = 100;
let currentSection = 'A';
let currentQuestionIndex = 0;

let questionStatusA = Array(totalQuestions).fill('unseen');
let questionStatusB = Array(totalQuestions).fill('unseen');

let questionLockA = Array(totalQuestions).fill(false);
let questionLockB = Array(totalQuestions).fill(false);

let selectedOptionsA = Array(totalQuestions).fill(null);
let selectedOptionsB = Array(totalQuestions).fill(null);

let userAnswers = [];

let fullQuestionSetA = [];
let fullQuestionSetB = [];

// Shuffle utility
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
} 

//for mcok testt logic 

// Function to get URL query parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get mock test number from URL, default to 1 if none given
const mockTestNumber = getQueryParam('mock') || '1';

// Create JSON file name from mock number
const jsonFileName = `imu${mockTestNumber}.json`;

// Fetch the JSON file dynamically
fetch(jsonFileName)
  .then(res => {
    if (!res.ok) throw new Error(`Couldn't load ${jsonFileName}`);
    return res.json();
  })
  .then(data => {
    // This function should display your questions using `data`
    initializeQuestions(data);
  })
  .catch(err => {
    alert(`Failed to load questions for mock test ${mockTestNumber}`);
  });

function initializeQuestions(data) {
  // YOUR logic to show questions using `data` goes here
}


let questionsData;
// Fetch and load questions from JSON
// fetch('question2.json')
//   .then(res => res.json())
//   .then(data => {
//     const englishA = ([...data.A.english]);
//     const gkA = ([...data.A.gk]);
//     const apptitudeA = ([...data.A.apptitude]);
//     fullQuestionSetA = [...englishA, ...gkA, ...apptitudeA].slice(0, totalQuestions); // this if for without suffele function 

//     const physicsB = ([...data.B.physics]);
//     const chemistryB = ([...data.B.chemistry]);
//     const mathsB = ([...data.B.maths]);
//     fullQuestionSetB = [...physicsB, ...mathsB,  ...chemistryB,].slice(0, totalQuestions);

//     // Initialize interface after loading
//     changeSection('A');
//   })
//   .catch(err => console.error("Failed to load questions.json:", err));

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("hidden");
}

document.getElementById('darkModeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
// fetch('question2.json')
//   .then(res => res.json())
//   .then(data => {
//     const englishA = shuffle([...data.A.english]);
//     const apptitudeA = shuffle([...data.A.apptitude]);
//     const gkA = shuffle([...data.A.gk]);
//     fullQuestionSetA = [...englishA, ...apptitudeA, ...gkA].slice(0, totalQuestions);

//     const physicsB = shuffle([...data.B.physics]);
//     const chemistryB = shuffle([...data.B.chemistry]);
//     const mathsB = shuffle([...data.B.maths]);
//     fullQuestionSetB = [...physicsB, ...chemistryB, ...mathsB].slice(0, totalQuestions);

//     // Initialize interface after loading
//     changeSection('A');
//   })
//   .catch(err => console.error("Failed to load questions.json:", err));

// function toggleSidebar() {
//   document.getElementById("sidebar").classList.toggle("hidden");
// }

// document.getElementById('darkModeToggle').addEventListener('click', () => {
//   document.body.classList.toggle('dark-mode');
// });

function updateProgressBar(current, total) {
  const percent = (current / total) * 100;
  document.getElementById('quizProgressBar').style.width = percent + '%';
}

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

  // Combine total score, correct answers, attempted
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


let statsBarVisible = true;

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

function submitTest() {
  const confirmed = confirm("Are you sure you want to submit the test?");
  if (!confirmed) return;

  // Calculate score per section and combined
  const combinedResult = calculateCombinedScore(fullQuestionSetA, selectedOptionsA, fullQuestionSetB, selectedOptionsB);

  // Store the combined total data in localStorage
  localStorage.setItem('testScore', combinedResult.total.score);
  localStorage.setItem('correct', combinedResult.total.correct);
  localStorage.setItem('attempted', combinedResult.total.attempted);
  localStorage.setItem('accuracy', combinedResult.total.accuracy);

  // Optionally store per section results if you want to show them individually later
  localStorage.setItem('sectionAScore', combinedResult.sectionA.score);
  localStorage.setItem('sectionACorrect', combinedResult.sectionA.correct);
  localStorage.setItem('sectionBScore', combinedResult.sectionB.score);
  localStorage.setItem('sectionBCorrect', combinedResult.sectionB.correct);

  alert("Test submitted successfully!");
  window.location.href = "thankyou.html";
}

