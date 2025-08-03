// ✅ Get user data, score, and mock test name from localStorage
const userData = JSON.parse(localStorage.getItem('userData'));
const score = parseFloat(localStorage.getItem('testScore'));
const mockTestName = localStorage.getItem('mockTestName') || 'Mock Test';

// ✅ Display score with better formatting
const scoreDisplay = document.getElementById("scoreDisplay");
if (score !== null && !isNaN(score)) {
  // Determine performance badge
  let performance = '';
  let badgeClass = '';

  if (score >= 160) {
    performance = 'Excellent';
    badgeClass = 'excellent';
  } else if (score >= 120) {
    performance = 'Good';
    badgeClass = 'good';
  } else if (score >= 80) {
    performance = 'Average';
    badgeClass = 'average';
  } else {
    performance = 'Needs Improvement';
    badgeClass = 'needs-improvement';
  }

  const now = new Date();
  const formattedDateTime = now.toLocaleString(); 

  const mockTestName = localStorage.getItem('mockTestName') || 'Mock Test';


  scoreDisplay.innerHTML = `
    <h2>Your Test Results</h2> 

    <div class="main-score">${score}/200</div>
    <div class="result-date-time">Test taken on: ${formattedDateTime}</div>
    <div class="score-details">
      <div class="score-item">
        <div class="score-number">${score}</div>
        <div class="score-label">Total Score</div>
      </div>
      <div class="score-item">
        <div class="score-number">${((score / 200) * 100).toFixed(1)}%</div>
        <div class="score-label">Percentage</div>
      </div>
      <div class="score-item">
        <div class="score-number">${Math.ceil(score)}/200</div>
        <div class="score-label">Correct Answers</div>
      </div>
    </div>
    <div class="performance-badge ${badgeClass}">${performance}</div>
  `;
} else {
  scoreDisplay.innerHTML = '<h2>Score not available</h2>';
}

// ✅ Display user info with better structure including mock test name
if (userData) {
  document.getElementById('userInfo').innerHTML = `
    <div class="header-section">
      <h1>Result</h1>
   
      <div class="certificate-text">This is to certify that the following candidate has completed the mock test</div>
    </div>
    <h2>Candidate Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Full Name</div>
        <div class="info-value">${userData.name}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Age</div>
        <div class="info-value">${userData.age} years</div>
      </div>
      <div class="info-item">
        <div class="info-label">State</div>
        <div class="info-value">${userData.state}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Email</div>
        <div class="info-value">${userData.email}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Exam</div>
        <div class="info-value">${userData.exam}</div>
      </div>
      ${userData.exam === 'IMUCET' && userData.imucetOption ? `
      <div class="info-item">
        <div class="info-label">IMUCET Option</div>
        <div class="info-value">${userData.imucetOption}</div>
      </div>` : ''}
      <div class="info-item">
        <div class="info-label">Phone</div>
        <div class="info-value">${userData.phone}</div>
      </div> 
      <div class="info-item">
         <div class="info-label">Mock Test</div>
         <div class="info-value">${mockTestName}</div>
               </div>

    </div>
    <div class="official-seal">
      <div>OFFICIAL</div>
      <div>🎓</div>
      <div>TESTIFY</div>
    </div>
  `;
} else {
  document.getElementById('userInfo').innerHTML = `<p>User data not found.</p>`;
}

// ✅ Send result to Google Sheet
fetch("https://script.google.com/macros/s/AKfycbxPsRPuGCkuWzbvMueG7FbdOpYowKa-KJnSkPUXotc9neRodQTmPSoHXQDZcGbgDUjq/exec", {
  method: "POST",
  mode: "no-cors",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: userData?.name,
    age: userData?.age,
    state: userData?.state,
    email: userData?.email,
    exam: userData?.exam,
    phone: userData?.phone,
    imucetOption: userData?.imucetOption,
    score: score,
    mockTestName: mockTestName // Optional: send mock test name as well
  }),
})
  .then(() => console.log("Data sent to Google Sheet!"))
  .catch((error) => console.error("Error sending data:", error));

// ✅ Download result as JPG function
function downloadJPG() {
  const element = document.getElementById('pdf-content');
  html2canvas(element, {
    scale: 3,          // High resolution
    useCORS: true,
    scrollX: 0,
    scrollY: 0
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/jpeg', 1.0); // Max quality
    const link = document.createElement('a');
    link.href = imgData;
    link.download = "TESTIFY_Result.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
 

// function doPost(e) {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
//   var data = JSON.parse(e.postData.contents);

//   sheet.appendRow([
//     data.name,
//     data.age,
//     data.state,
//     data.email,
//     data.phone,
//     data.score,
 
   
//   ]);

//   return ContentService
//     .createTextOutput(JSON.stringify({ result: "success" }))
//     .setMimeType(ContentService.MimeType.JSON);
// }
