// Konfigurasi Supabase
const SUPABASE_URL = 'https://xxxx.supabase.co'; // Ganti dengan URL proyek kamu
const SUPABASE_KEY = 'your-anon-key'; // Ganti dengan API Key kamu
const database = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Ambil username dari localStorage
const username = localStorage.getItem('username');
if (!username) {
  window.location.href = 'index.html';
}

// Tampilkan username
document.getElementById('username').textContent = username;

// Inisialisasi tampilan
let lastClaimTime = null;
let totalKoin = 0;
const REWARD_PER_DAY = 1000;
const CLAIM_INTERVAL = 24 * 60 * 60 * 1000; // 24 jam

// Fungsi ambil data user dari Supabase
async function fetchUserData() {
  const { data, error } = await database
    .from('users')
    .select()
    .eq('username', username)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  lastClaimTime = new Date(data.last_claim_time);
  totalKoin = data.koin;

  updateDashboard();
  updateCountdown();
}

function updateDashboard() {
  document.getElementById('totalRewards').textContent = totalKoin.toLocaleString();
  document.getElementById('rewardAmount').textContent = REWARD_PER_DAY.toLocaleString();
}

// Tombol logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('username');
  window.location.href = 'index.html';
});

// Fungsi cek apakah bisa klaim
function canClaim() {
  if (!lastClaimTime) return true;
  const now = Date.now();
  const last = new Date(lastClaimTime).getTime();
  return now - last >= CLAIM_INTERVAL;
}

// Update countdown dan tombol klaim
function updateCountdown() {
  const btn = document.getElementById('claimBtn');
  const countdown = document.getElementById('countdown');

  const now = Date.now();
  const last = lastClaimTime ? new Date(lastClaimTime).getTime() : 0;
  const nextClaim = last + CLAIM_INTERVAL;
  const remaining = nextClaim - now;

  if (remaining <= 0) {
    btn.disabled = false;
    countdown.textContent = 'Bisa klaim sekarang';
  } else {
    btn.disabled = true;
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    countdown.textContent = `Tunggu ${hours}j ${minutes}m ${seconds}d`;
    setTimeout(updateCountdown, 1000);
  }
}

// Fungsi klaim koin
document.getElementById('claimBtn').addEventListener('click', async () => {
  if (!canClaim()) return;

  const newKoin = totalKoin + REWARD_PER_DAY;
  const now = new Date().toISOString();

  const { error } = await database
    .from('users')
    .update({ koin: newKoin, last_claim_time: now })
    .eq('username', username);

  if (error) {
    alert('Gagal klaim.');
    return;
  }

  totalKoin = newKoin;
  lastClaimTime = new Date(now);
  updateDashboard();
  updateCountdown();
  alert(`Berhasil klaim ${REWARD_PER_DAY} koin!`);
});

fetchUserData();
