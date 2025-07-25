document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  const welcome = document.getElementById("welcome");
  const status = document.getElementById("status");
  const totalRewardsEl = document.getElementById("totalRewards");
  const dailyRewardsEl = document.getElementById("dailyRewards");
  const claimBtn = document.getElementById("claimBtn");

  if (!username) {
    window.location.href = "index.html";
    return;
  }

  welcome.textContent = `Selamat datang, ${username}!`;

  const rewardPer24h = 0.015;
  let lastClaimTime = localStorage.getItem("lastClaimTime");
  let dailyPoints = parseFloat(localStorage.getItem("dailyPoints") || "0");
  let totalPoints = parseFloat(localStorage.getItem("totalPoints") || "0");

  function updateUI() {
    dailyRewardsEl.textContent = dailyPoints.toFixed(3);
    totalRewardsEl.textContent = totalPoints.toFixed(3);

    const now = Date.now();
    if (!lastClaimTime || now - parseInt(lastClaimTime) >= 86400000) {
      claimBtn.disabled = false;
      status.textContent = "Klaim tersedia!";
    } else {
      claimBtn.disabled = true;
      const remaining = 86400000 - (now - parseInt(lastClaimTime));
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      status.textContent = `Tunggu ${hours} jam ${minutes} menit untuk klaim lagi`;
    }
  }

  function claimReward() {
    const now = Date.now();
    if (!lastClaimTime || now - parseInt(lastClaimTime) >= 86400000) {
      totalPoints += dailyPoints;
      dailyPoints = rewardPer24h;
      lastClaimTime = now;

      localStorage.setItem("lastClaimTime", lastClaimTime);
      localStorage.setItem("dailyPoints", dailyPoints);
      localStorage.setItem("totalPoints", totalPoints);

      updateUI();
    }
  }

  function logout() {
    localStorage.removeItem("username");
    window.location.href = "index.html";
  }

  updateUI();
  setInterval(updateUI, 60000);
  window.claimReward = claimReward;
  window.logout = logout;
});
