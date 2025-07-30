// Konfigurasi Telegram Bot
const TELEGRAM_BOT_TOKEN = '8302323286:AAEM6xferO3kn5Bfx9Gc1tNu2iGeDEhXdr4';
const TELEGRAM_CHAT_ID = '6632988160';

// Fungsi kirim notifikasi ke Telegram
async function sendTelegramNotification(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
  };

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Gagal kirim notifikasi Telegram:', error);
  }
}
