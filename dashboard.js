const CLAIM_REWARD = 1000;
const COOLDOWN_HOURS = 24;

const rewardEl = document.getElementById('dailyRewards');
const totalRewardEl = document.getElementById('totalRewards');
const startTime = localStorage.getItem('miningStart') || Date.now();
localStorage.setItem('miningStart', startTime);

function updateRewards() {
  const now = Date.now();
  const elapsed = now - startTime;
  const progress = Math.min(elapsed / (COOLDOWN_HOURS * 60 * 60 * 1000), 1);

  const dailyReward = CLAIM_REWARD * progress;
  rewardEl.textContent = dailyReward.toFixed(3);

  const total = parseFloat(localStorage.getItem('totalRewards') || 0);
  totalRewardEl.textContent = total.toFixed(3);
}

setInterval(updateRewards, 1000);
updateRewards();
