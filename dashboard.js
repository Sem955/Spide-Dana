// dashboard.js - versi pakai Supabase database

const supabase = supabase.createClient( 'https://mppordupklxrmqhrtxrc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wcG9yZHVwa2x4cm1xaHJ0eHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NzQ3NjUsImV4cCI6MjA2ODQ1MDc2NX0.RtDugPVzWjIA6TjZmyXw3MI2oamApryHYmLArQq17Jw' );

let currentUserEmail = "";

async function initDashboard() { const { data: { user }, error } = await supabase.auth.getUser(); if (error || !user) { alert("Silakan login terlebih dahulu."); return location.href = "index.html"; }

currentUserEmail = user.email;

// Ambil reward user dari tabel const { data, error: fetchError } = await supabase .from("users") .select("total_rewards, last_claim") .eq("email", currentUserEmail) .single();

if (fetchError) { alert("Gagal mengambil data pengguna."); return; }

const totalReward = parseFloat(data.total_rewards || 0); const lastClaim = new Date(data.last_claim || 0).getTime(); const now = Date.now(); const cooldown = 1 * 60 * 60 * 1000; const elapsed = now - lastClaim;

const canClaim = elapsed >= cooldown; const claimBtn = document.getElementById("claimBtn"); const totalEl = document.getElementById("totalRewards"); const dailyEl = document.getElementById("dailyRewards"); const statusText = document.getElementById("statusText");

totalEl.innerText = totalReward.toLocaleString();

if (canClaim) { dailyEl.innerText = "500"; statusText.innerText = "Kamu bisa klaim sekarang!"; claimBtn.disabled = false; claimBtn.onclick = async () => { const newTotal = totalReward + 500; const { error: updateError } = await supabase .from("users") .update({ total_rewards: newTotal, last_claim: new Date().toISOString() }) .eq("email", currentUserEmail);

if (updateError) return alert("Gagal klaim: " + updateError.message);

  alert("Berhasil klaim 500 poin!");
  location.reload();
};

} else { const remaining = cooldown - elapsed; const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)); const secs = Math.floor((remaining % (1000 * 60)) / 1000); statusText.innerText = Tunggu ${mins}m ${secs}s lagi untuk klaim.; claimBtn.disabled = true; dailyEl.innerText = "0"; }

// Tombol withdraw const withdrawBtn = document.getElementById("withdrawBtn"); if (withdrawBtn) { withdrawBtn.onclick = async () => { const amountStr = prompt("Masukkan jumlah poin yang ingin di-withdraw:"); const amount = parseFloat(amountStr); if (!amount || amount <= 0 || amount > totalReward) return alert("Jumlah tidak valid atau saldo tidak cukup.");

const nomorDana = prompt("Masukkan nomor akun DANA:");
  if (!nomorDana) return alert("Nomor DANA wajib diisi.");

  const newTotal = totalReward - amount;
  const { error: withdrawError } = await supabase.from("withdraws").insert({
    email: currentUserEmail,
    jumlah: amount,
    nomor_dana: nomorDana
  });

  if (withdrawError) return alert("Gagal simpan withdraw: " + withdrawError.message);

  await supabase.from("users").update({ total_rewards: newTotal }).eq("email", currentUserEmail);

  alert("Berhasil withdraw: " + amount + " poin ke DANA: " + nomorDana);
  location.reload();
};

} }

initDashboard();

