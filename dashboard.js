const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const username = localStorage.getItem("username");
if (!username) window.location.href = "index.html";

const totalRewardElem = document.getElementById("totalReward");
const pointsDisplay = document.getElementById("pointsDisplay");
const claimBtn = document.getElementById("claimBtn");
const countdownElem = document.getElementById("countdown");

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("username");
  window.location.href = "index.html";
});

async function loadUserData() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) {
    alert("Data user tidak ditemukan!");
    return;
  }

  const lastClaim = new Date(data.last_claim_time);
  const now = new Date();
  const diffMs = now - lastClaim;
  const diffSec = Math.floor(diffMs / 1000);
  const totalSeconds = 86400;

  let miningProgress = Math.min(diffSec, totalSeconds);
  const rewardPerSecond = 1000 / totalSeconds;

  function updateMining() {
    miningProgress++;
    const earned = (miningProgress * rewardPerSecond).toFixed(2);
    pointsDisplay.textContent = earned;

    const remaining = totalSeconds - miningProgress;
    if (remaining <= 0) {
      countdownElem.textContent = "Bisa diklaim sekarang!";
      claimBtn.disabled = false;
      clearInterval(timer);
    } else {
      const hrs = Math.floor(remaining / 3600);
      const min = Math.floor((remaining % 3600) / 60);
      const sec = remaining % 60;
      countdownElem.textContent = `Klaim dalam ${hrs}j ${min}m ${sec}d`;
      claimBtn.disabled = true;
    }
  }

  updateMining();
  const timer = setInterval(updateMining, 1000);

  claimBtn.addEventListener("click", async () => {
    if (miningProgress < totalSeconds) return;

    const newTotal = data.total_reward + 1000;
    const { error: updateError } = await supabase
      .from('users')
      .update({
        total_reward: newTotal,
        last_claim_time: new Date().toISOString()
      })
      .eq('username', username);

    if (!updateError) {
      totalRewardElem.textContent = newTotal;
      window.location.reload();
    } else {
      alert("Gagal klaim reward.");
    }
  });

  totalRewardElem.textContent = data.total_reward;
}

loadUserData();
