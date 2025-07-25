// Konfigurasi Supabase
const supabaseUrl = 'https://mppordupklxrmqhrtxrc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wcG9yZHVwa2x4cm1xaHJ0eHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NzQ3NjUsImV4cCI6MjA2ODQ1MDc2NX0.RtDugPVzWjIA6TjZmyXw3MI2oamApryHYmLArQq17Jw';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Ambil username dari localStorage
const username = localStorage.getItem('currentUser');
if (!username) window.location.href = 'index.html';

const CLAIM_REWARD = 1000;
const COOLDOWN_HOURS = 24;

const totalRewardEl = document.getElementById('totalReward');
const dailyRewardEl = document.getElementById('dailyReward');
const statusText = document.getElementById('statusText');
const claimBtn = document.getElementById('claimBtn');
const logoutBtn = document.getElementById('logoutBtn');

let userData = null;

// Ambil data user dari Supabase
async function fetchUserData() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) {
    alert('Gagal ambil data pengguna.');
    return;
  }

  userData = data;
  updateUI();
}

// Perbarui tampilan poin
function updateUI() {
  const now = new Date();
  const lastClaim = new Date(userData.last_claim_time || 0);
  const elapsedMs = now - lastClaim;
  const maxMs = COOLDOWN_HOURS * 60 * 60 * 1000;

  let earned = 0;
  let canClaim = false;

  if (elapsedMs >= maxMs) {
    earned = CLAIM_REWARD;
    canClaim = true;
  } else {
    earned = (elapsedMs / maxMs) * CLAIM_REWARD;
  }

  dailyRewardEl.textContent = earned.toFixed(2);
  totalRewardEl.textContent = userData.total_reward.toFixed(2);

  if (canClaim) {
    claimBtn.disabled = false;
    claimBtn.classList.add('enabled');
    claimBtn.textContent = 'Claim 1000 Poin';
    statusText.textContent = 'Kamu bisa klaim sekarang!';
  } else {
    claimBtn.disabled = true;
    claimBtn.classList.remove('enabled');
    claimBtn.textContent = 'Claim 1000 Poin';
    const remaining = CLAIM_REWARD - earned;
    statusText.textContent = `Menunggu ${remaining.toFixed(2)} poin lagi sebelum klaim.`;
  }
}

// Proses klaim poin
async function claimReward() {
  const now = new Date().toISOString();
  const newTotal = userData.total_reward + CLAIM_REWARD;

  const { error } = await supabase
    .from('users')
    .update({
      total_reward: newTotal,
      last_claim_time: now
    })
    .eq('username', username);

  if (error) {
    alert('Gagal klaim poin.');
    return;
  }

  userData.total_reward = newTotal;
  userData.last_claim_time = now;
  updateUI();
}

// Event
claimBtn.addEventListener('click', claimReward);

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
});

// Jalankan awal
fetchUserData();
setInterval(fetchUserData, 5000); // Refresh tiap 5 detik
