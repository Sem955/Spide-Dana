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

  // Contoh Total Rewards (bisa fetch dari Supabase jika diperlukan nanti)
  const total = parseFloat(localStorage.getItem('totalRewards') || 0);
  document.getElementById('totalRewards').innerText = total.toFixed(3);
}
