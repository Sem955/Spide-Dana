// Ganti dengan URL dan Anon Key kamu sendiri
const supabaseUrl = "https://mhztkmbguofqoukzvelq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oenRrbWJndW9mcW91a3p2ZWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODI3MTIsImV4cCI6MjA2ODg1ODcxMn0.1ExnNIDb7kG5NlsCds7nOxX14i1sh1pSoRlfFNyO3qw";

const db = supabase.createClient(supabaseUrl, supabaseKey);

async function getSaldo(username) {
  const { data, error } = await db
    .from("users")
    .select("saldo")
    .eq("username", username)
    .single();

  if (error) {
    console.log("Akun belum ada, membuat baru...");
    await db.from("users").insert({ username: username, saldo: 0 });
    document.getElementById("saldo").textContent = 0;
  } else {
    document.getElementById("saldo").textContent = data.saldo;
  }
}

async function claimKoin(username) {
  const { data, error } = await db
    .from("users")
    .select("saldo")
    .eq("username", username)
    .single();

  if (error || !data) {
    alert("Gagal klaim. User tidak ditemukan.");
    return;
  }

  const saldoBaru = data.saldo + 10; // Tambah 10 koin
  await db
    .from("users")
    .update({ saldo: saldoBaru })
    .eq("username", username);

  document.getElementById("saldo").textContent = saldoBaru;
  alert("Berhasil klaim 10 koin!");
    }
