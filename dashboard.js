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

// ✅ Tambahkan ini agar tombol bekerja dan poin berkurang
function handleWithdraw() {
  const withdrawAmountStr = prompt("Masukkan jumlah poin yang ingin di-withdraw:");
  if (!withdrawAmountStr) return;

  const withdrawAmount = parseFloat(withdrawAmountStr);
  if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
    alert("Jumlah tidak valid.");
    return;
  }

  const currentTotal = parseFloat(localStorage.getItem('totalRewards') || 0);
  if (withdrawAmount > currentTotal) {
    alert("Poin tidak cukup.");
    return;
  }

  const newTotal = currentTotal - withdrawAmount;
  localStorage.setItem('totalRewards', newTotal.toFixed(3));
  document.getElementById('totalRewards').innerText = newTotal.toFixed(3);

  alert("Withdraw berhasil sejumlah " + withdrawAmount.toFixed(3) + " poin.");
}

const withdrawBtn = document.getElementById("withdrawBtn");
if (withdrawBtn) {
  withdrawBtn.onclick = handleWithdraw;
}

// ✅ Jalankan update awal saat halaman dibuka
updateRewards();
setInterval(updateRewards, 5000); // Perbarui setiap 5 detik
