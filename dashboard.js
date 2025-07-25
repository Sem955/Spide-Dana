// Ambil data dari localStorage
const username = localStorage.getItem("username");
const totalReward = parseInt(localStorage.getItem("totalReward") || "0");
let startTime = parseInt(localStorage.getItem("startTime") || Date.now());

// Elemen-elemen tampilan
const welcome = document.getElementById("welcome");
const totalRewardEl = document.getElementById("totalReward");
const miningEl = document.getElementById("mining");
const countdownEl = document.getElementById("countdown");
const claimBtn = document.getElementById("claimBtn");
const logoutBtn = document.getElementById("logout");

// Cek login
if (!username) {
  window.location.href = "index.html";
}

// Tampilkan username
welcome.textContent = `Selamat datang, ${username}!`;

// Atur nilai awal
totalRewardEl.textContent = totalReward;
claimBtn.disabled = true;

// Timer
const totalDuration = 24 * 60 * 60 * 1000; // 24 jam dalam ms
const updateInterval = 1000; // 1 detik

function updateProgress() {
  const now = Date.now();
  const elapsed = now - startTime;

  if (elapsed >= totalDuration) {
    miningEl.textContent = "1000";
    countdownEl.textContent = "Sudah 24 jam! Silakan klaim poin.";
    claimBtn.disabled = false;
  } else {
    const percentage = elapsed / totalDuration;
    const reward = Math.floor(percentage * 1000);
    miningEl.textContent = reward.toString();

    const remaining = totalDuration - elapsed;
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    countdownEl.textContent = `Tunggu ${hours}j ${minutes}m ${seconds}d lagi untuk klaim.`;
    claimBtn.disabled = true;
  }
}

// Klaim Poin
claimBtn.addEventListener("click", () => {
  const earned = parseInt(miningEl.textContent);
  const newTotal = totalReward + earned;

  localStorage.setItem("totalReward", newTotal);
  totalRewardEl.textContent = newTotal;

  // Reset waktu mulai
  startTime = Date.now();
  localStorage.setItem("startTime", startTime);

  // Reset tampilan
  claimBtn.disabled = true;
  updateProgress();
});

// Tombol keluar
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("username");
  window.location.href = "index.html";
});

// Jalankan timer setiap detik
updateProgress();
setInterval(updateProgress, updateInterval);
