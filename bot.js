// ===============================
// Telegram Video Downloader Bot
// Developer: Salim Ahmad
// ===============================

const TelegramBot = require('node-telegram-bot-api');
const { YTDlpWrap } = require('yt-dlp-wrap');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN missing! Set environment variable BOT_TOKEN');
    process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const ytdlp = new YTDlpWrap();

const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

// Command Handlers
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id,
`👋 Hello ${msg.from.first_name}!
💖 Developed by Salim Ahmad
━━━━━━━━━━━━━━
Commands:
/start - Start bot
/admin - Admin info
/status - Bot status
/help - Help info
/format - Video download format
━━━━━━━━━━━━━━
Send a video URL to download.`);
});

bot.onText(/\/admin/, (msg) => {
    bot.sendMessage(msg.chat.id,
`👤 Admin: Salim Ahmad
☪️ Religion: Islam
🏫 Education: Meherpur Tech & College
📞 Telegram: t.me/+33Srlf8jLsZlYjA1
💖 Developed by Salim Ahmad`);
});

bot.onText(/\/status/, (msg) => {
    bot.sendMessage(msg.chat.id, `✅ Bot is online and running.\n💖 Developed by Salim Ahmad`);
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id,
`💡 Help:
/start - Start bot
/admin - Admin info
/status - Bot status
/format - Video/audio download format
Send valid video URL to download.`);
});

bot.onText(/\/format/, (msg) => {
    bot.sendMessage(msg.chat.id,
`🎬 Format options:
- 4K, 2K, 1080p, 720p (video)
- Audio only (mp3)
💖 Developed by Salim Ahmad`);
});

// Video / Audio Download
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text || !text.startsWith('http')) return;

    const fileName = path.join(DOWNLOAD_DIR, `${Date.now()}.mp4`);
    bot.sendMessage(chatId, `⏳ Downloading video, please wait...`);

    try {
        await ytdlp.execPromise([text, '-o', fileName, '-f', 'bestvideo+bestaudio']);
        bot.sendMessage(chatId, `✅ Download complete!\n💖 Developed by Salim Ahmad`);
        bot.sendVideo(chatId, fileName);
    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, `❌ Download Failed\n💖 Developed by Salim Ahmad`);
    }
});
