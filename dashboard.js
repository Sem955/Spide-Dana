// Konfigurasi Supabase
const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_API_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Ambil username dari localStorage
const username = localStorage.getItem('username');
const CLAIM_REWARD = 1000;
const COOLDOWN_HOURS = 24;

const rewardEl = document.getElementById('reward');
const totalRewardEl = document.getElementById('total-rewards-value');
const statusText = document.getElementById('statusText');
const claimBtn = document.getElementById('claimBtn');

let userData = null;

// Ambil data user dari Supabase
async function fetchUserData() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) {
    console.error('Gagal ambil data:', error);
    return;
  }

  userData = data;
  updateUI();
}

function updateUI() {
  const lastClaim = new Date(userData.last_claim_time);
  const now = new Date();
  const diffHours = (now - lastClaim) / (1000 * 60 * 60);

  const canClaim = diffHours >= COOLDOWN_HOURS;

  rewardEl.textContent = userData.total_reward.toFixed(2);
  totalRewardEl.textContent = userData.total_reward.toFixed(2);

  if (canClaim) {
    claimBtn.disabled = false;
    claimBtn.classList.add('enabled');
    claimBtn.textContent = 'Claim Koin';
    statusText.textContent = 'Kamu bisa klaim 1000 poin sekarang!';
  } else {
    const remaining = CLAIM_REWARD - (diffHours / COOLDOWN_HOURS) * CLAIM_REWARD;
    claimBtn.disabled = true;
    claimBtn.classList.remove('enabled');
    claimBtn.textContent = 'Claim Koin';
    statusText.textContent = `Menunggu ${remaining.toFixed(2)} poin lagi untuk klaim.`;
  }
}

// Fungsi klaim koin
async function claimReward() {
  const now = new Date().toISOString();

  const { error } = await supabase
    .from('users')
    .update({
      total_reward: userData.total_reward + CLAIM_REWARD,
      last_claim_time: now
    })
    .eq('username', username);

  if (error) {
    alert('Gagal klaim poin.');
    return;
  }

  await fetchUserData();
}

// Event tombol
claimBtn.addEventListener('click', async () => {
  if (!claimBtn.disabled) {
    await claimReward();
  }
});

// Inisialisasi
fetchUserData();
