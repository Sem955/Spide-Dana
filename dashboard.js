// === KONFIGURASI ===
const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_API_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
const username = localStorage.getItem('username');

// === KONSTANTA ===
const MAX_REWARD = 1000;
const SECONDS_IN_24H = 86400;
const REWARD_PER_SECOND = MAX_REWARD / SECONDS_IN_24H;

let miningReward = 0;
let canClaim = false;
let lastClaimTime = null;
let totalReward = 0;

// === ELEMENT HTML ===
const miningEl = document.getElementById('mining-reward');
const totalRewardEl = document.getElementById('total-rewards-value');
const claimBtn = document.getElementById('claimBtn');
const statusText = document.getElementById('statusText');

// === AMBIL DATA USER ===
async function loadUserData() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (data) {
    lastClaimTime = new Date(data.last_claim_time);
    totalReward = data.total_reward || 0;
    totalRewardEl.textContent = totalReward.toFixed(2);
    startMiningLoop();
  } else {
    console.error("Gagal ambil data user:", error);
  }
}

// === LOOP MINING REAL-TIME ===
function startMiningLoop() {
  setInterval(() => {
    const now = new Date();
    const elapsedSeconds = Math.floor((now - lastClaimTime) / 1000);

    if (elapsedSeconds >= SECONDS_IN_24H) {
      miningReward = MAX_REWARD;
      canClaim = true;
      claimBtn.disabled = false;
      claimBtn.classList.add('enabled');
      statusText.textContent = "Klaim tersedia! Klik tombol untuk ambil 1000 poin.";
    } else {
      miningReward = REWARD_PER_SECOND * elapsedSeconds;
      canClaim = false;
      claimBtn.disabled = true;
      claimBtn.classList.remove('enabled');
      statusText.textContent = "Menambang... " + miningReward.toFixed(2) + " / 1000";
    }

    miningEl.textContent = miningReward.toFixed(2);
  }, 1000);
}

// === KLAIM KOIN ===
claimBtn.addEventListener('click', async () => {
  if (!canClaim) return;

  const now = new Date().toISOString();
  const newTotal = totalReward + MAX_REWARD;

  const { error } = await supabase
    .from('users')
    .update({
      total_reward: newTotal,
      last_claim_time: now
    })
    .eq('username', username);

  if (!error) {
    miningReward = 0;
    totalReward = newTotal;
    totalRewardEl.textContent = totalReward.toFixed(2);
    lastClaimTime = new Date();
    claimBtn.disabled = true;
    claimBtn.classList.remove('enabled');
    statusText.textContent = "Berhasil klaim. Mining dimulai ulang.";
  } else {
    alert("Gagal klaim reward.");
  }
});

// === MULAI ===
loadUserData();
