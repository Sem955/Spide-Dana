// Konfigurasi Supabase
const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_API_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Ambil username dari localStorage
const username = localStorage.getItem('currentUser');
const CLAIM_REWARD = 1000;
const COOLDOWN_HOURS = 24;

const rewardEl = document.getElementById('reward');
const totalRewardEl = document.getElementById('total-rewards-value');
const statusText = document.getElementById('statusText');
const claimBtn = document.getElementById('claimBtn');
const logoutBtn = document.getElementById('logoutBtn');

let userData = null;

async function fetchUserData() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) {
    console.error('Gagal ambil data:', error);
    alert("Data user tidak ditemukan.");
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

  rewardEl.textContent = canClaim ? CLAIM_REWARD.toFixed(2) : "0.000";
  totalRewardEl.textContent = userData.total_reward.toFixed(2);

  if (canClaim) {
    claimBtn.disabled = false;
    statusText.textContent = 'Kamu bisa klaim 1000 poin sekarang!';
  } else {
    const remaining = (COOLDOWN_HOURS - diffHours).toFixed(2);
    claimBtn.disabled = true;
    statusText.textContent = `Klaim tersedia dalam ${remaining} jam lagi`;
  }
}

// Fungsi klaim
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

// Event listener tombol
claimBtn.addEventListener('click', async () => {
  if (!claimBtn.disabled) {
    await claimReward();
  }
});

// Tombol logout
logoutBtn.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});

// Inisialisasi
if (!username) {
  alert("Kamu belum login.");
  window.location.href = 'index.html';
} else {
  fetchUserData();
}
