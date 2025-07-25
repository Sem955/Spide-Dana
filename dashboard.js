// Cek login
const username = localStorage.getItem("username");
if (!username) {
  window.location.href = "index.html";
}

// Elemen
const totalRewardEl = document.getElementById("totalReward");
const pointsDisplay = document.getElementById("pointsDisplay");
const claimBtn = document.getElementById("claimBtn");
const countdownEl = document.getElementById("countdown");
const logoutBtn = document.getElementById("logoutBtn");

// Konstanta
const MAX_POINTS = 1000;
const MINING_DURATION = 24 * 60 * 60 * 1000; // 24 jam dalam ms
let startTime = localStorage.getItem("startTime");
let totalReward = parseInt(localStorage.getItem("totalReward")) || 0;

// Set awal
totalRewardEl.textContent = totalReward;

// Jika belum ada start time, buat baru
if (!startTime) {
  startTime = Date.now();
  localStorage.setItem("startTime", startTime);
}

// Fungsi untuk update poin
function updatePoints() {
  const now = Date.now();
  const elapsed = now - startTime;

  if (elapsed >= MINING_DURATION) {
    pointsDisplay.textContent = MAX_POINTS.toFixed(2);
    claimBtn.disabled = false;
    countdownEl.textContent = "Siap untuk klaim!";
  } else {
    const progress = elapsed / MINING_DURATION;
    const currentPoints = progress * MAX_POINTS;
    pointsDisplay.textContent = currentPoints.toFixed(2);
    claimBtn.disabled = true;

    const remaining = MINING_DURATION - elapsed;
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    countdownEl.textContent = `Tunggu ${hours}j ${minutes}m ${seconds}d`;
  }
}

// Jalankan per detik
setInterval(updatePoints, 1000);
updatePoints();

// Tombol klaim
claimBtn.addEventListener("click", () => {
  totalReward += MAX_POINTS;
  localStorage.setItem("totalReward", totalReward);
  totalRewardEl.textContent = totalReward;
  startTime = Date.now();
  localStorage.setItem("startTime", startTime);
  claimBtn.disabled = true;
  updatePoints();
});

// Tombol keluar
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("username");
  localStorage.removeItem("startTime");
  window.location.href = "index.html";
});
