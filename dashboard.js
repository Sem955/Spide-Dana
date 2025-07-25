// Ambil username dari localStorage
const username = localStorage.getItem("username");
if (!username) {
  window.location.href = "index.html";
}

// Tampilkan nama user
document.getElementById("usernameDisplay").textContent = username;

// Elemen
const miningAmount = document.getElementById("miningAmount");
const claimButton = document.getElementById("claimButton");
const totalRewardEl = document.getElementById("totalReward");
const logoutButton = document.getElementById("logoutButton");

// Data waktu dan poin
const startTimeKey = `miningStartTime_${username}`;
const totalRewardKey = `totalReward_${username}`;

let startTime = localStorage.getItem(startTimeKey);
let totalReward = parseInt(localStorage.getItem(totalRewardKey)) || 0;

// Update tampilan awal
totalRewardEl.textContent = totalReward;

// Kalau belum pernah mining, set waktu mulai sekarang
if (!startTime) {
  startTime = Date.now();
  localStorage.setItem(startTimeKey, startTime);
}

// Hitung poin berdasarkan waktu berjalan
function updateMining() {
  const now = Date.now();
  const elapsed = now - startTime;
  const seconds = Math.floor(elapsed / 1000);
  const reward = Math.min(seconds, 86400); // 24 jam = 86400 detik

  miningAmount.textContent = reward;

  // Aktifkan tombol klaim jika sudah 24 jam
  if (reward >= 1000) {
    claimButton.disabled = false;
  } else {
    claimButton.disabled = true;
  }
}

setInterval(updateMining, 1000);
updateMining();

// Tombol klaim
claimButton.addEventListener("click", () => {
  const claimed = Math.min(parseInt(miningAmount.textContent), 1000);
  totalReward += claimed;
  totalRewardEl.textContent = totalReward;
  localStorage.setItem(totalRewardKey, totalReward);

  // Reset waktu mulai
  startTime = Date.now();
  localStorage.setItem(startTimeKey, startTime);
  miningAmount.textContent = "0";
  claimButton.disabled = true;
});

// Tombol keluar
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("username");
  window.location.href = "index.html";
});
