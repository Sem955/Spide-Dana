const supabase = supabase.createClient(
  'https://mppordupklxrmqhrtxrc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wcG9yZHVwa2x4cm1xaHJ0eHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NzQ3NjUsImV4cCI6MjA2ODQ1MDc2NX0.RtDugPVzWjIA6TjZmyXw3MI2oamApryHYmLArQq17Jw'
);

// Simulasi pertumbuhan reward dari 0 ke 1000 dalam 24 jam
const startTime = localStorage.getItem('miningStart') || Date.now();
localStorage.setItem('miningStart', startTime);

function updateRewards() {
  const now = Date.now();
  const elapsed = now - startTime;
  const totalMillisIn24h = 24 * 60 * 60 * 1000;

  let progress = elapsed / totalMillisIn24h;
  if (progress > 1) progress = 1;

  const dailyReward = 1000 * progress;
  document.getElementById('dailyRewards').innerText = dailyReward.toFixed(3);

  const total = parseFloat(localStorage.getItem('totalRewards') || 0);
  document.getElementById('totalRewards').innerText = total.toFixed(3);
}

// ✅ Tambahkan ini agar tombol bekerja
function handleWithdraw() {
  alert("Fitur withdraw sedang dalam pengembangan.");
}

const withdrawBtn = document.getElementById("withdrawBtn");
if (withdrawBtn) {
  withdrawBtn.onclick = handleWithdraw;
}
