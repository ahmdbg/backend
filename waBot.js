// File: waBot.js
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

const client = new Client({
    authStrategy: new LocalAuth({
        // Folder untuk menyimpan data sesi
        dataPath: './whatsapp-session'
    }),
    // Tambahan options untuk menghindari error browser
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
});

let isReady = false;

client.on('qr', (qr) => {
    console.log('📲 Scan QR ini pakai WhatsApp Web:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp bot aktif!');
    isReady = true;
});

// Tambahkan event authenticated
client.on('authenticated', () => {
    console.log('🔒 WhatsApp berhasil diautentikasi!');
});

// Fungsi untuk format nomor WA
const formatPhoneNumber = (number) => {
    // Hapus karakter non-digit
    let cleaned = number.replace(/\D/g, '');
    // Hapus awalan 0 atau 62
    cleaned = cleaned.replace(/^0|^62/, '');
    // Tambah awalan 62
    return '62' + cleaned + '@c.us';
};

// Fungsi untuk kirim pesan ke nomor user
export const sendWA = async (number, message) => {
    if (!isReady) {
        throw new Error('WhatsApp client belum siap');
    }

    try {
      const formattedNumber = formatPhoneNumber(number);
      await client.sendMessage(formattedNumber, message);
      console.log(`✅ Pesan dikirim ke ${number}`);
    } catch (err) {
      console.error('❌ Gagal kirim pesan:', err.message);
      throw err; // Re-throw error untuk ditangkap di route
    }
};

client.initialize();
