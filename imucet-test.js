const mockUnlockTimes = [
  new Date('2025-08-02T11:00:00+05:30'),
  new Date('2025-10-23T10:00:00+05:30'),
  new Date('2026-02-11T11:00:00+05:30'),
  new Date('2026-03-15T11:00:00+05:30'),
  new Date('2026-04-19T11:00:00+05:30'),
  new Date('2026-05-23T11:00:00+05:30')
];

function formatDateIST(date) {
  const options = { 
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  };
  return date.toLocaleString('en-IN', options) + ' IST';
}

function updateUnlockButtons() {
  const now = Date.now();
  
  // Select all test-card buttons in the order of your markup
  const buttons = document.querySelectorAll('.test-card button');

  buttons.forEach((btn, idx) => {
    const unlockTime = mockUnlockTimes[idx].getTime();

    if (now < unlockTime) {
      btn.disabled = true;
      btn.style.background = '#ccc';
      btn.style.cursor = 'not-allowed';
      btn.textContent = 'Available on ' + formatDateIST(mockUnlockTimes[idx]);
    } else {
      btn.disabled = false;
      btn.style.background = '';
      btn.style.cursor = '';
      btn.textContent = 'Start Test';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateUnlockButtons();
  setInterval(updateUnlockButtons, 30000); // update every 30 seconds for auto unlock
});

