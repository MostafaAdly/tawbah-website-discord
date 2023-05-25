// ===================================================================== [ Enums ]
import RecitingType from "./enums/RecitingType.js";
// ===================================================================== [ Configuration ]
export default {
    // Discord Webhook
    GENERAL: {
        delay_on_exit: 0.18, // in seconds
        delay_on_start: 0.1, // in seconds
        save_interval: 600, // 10 minutes
    },
    PATHS: {
        recitation_verseByVerse: `../database/reciters/${RecitingType.VERSE_BY_VERSE}/%reciter_name%/%surah_number% - %surah_name%/%surah_number%%ayah_number%.mp3`,
        recitation_chapterByChapter: `../database/reciters/${RecitingType.CHAPTER_BY_CHAPTER}/%reciter_name%/%surah_number% - %surah_name%.mp3`,
    },
    BOT: {
        activity_name: "86% done, website soon.",
        activity_type: 5, // 5 is competing
        status: "idle",
    },
    VIRTUAL_GLOBAL: {
        audio_id: "VIRTUAL_PLAYER",
        requested_by: "Developer: Mostafa Adly",
        reciter_name: "عبد الباسط عبد الصمد (مجود)",
        surah: 1,
        ayah: 1,
    },
    WEBHOOK: {
        name: "Tawbah - Azkar",
        image: "https://cdn.discordapp.com/attachments/917901875280502815/1094093865264349234/Tawbah.png",
    },
    AZKAR: {
        channel_name: "azkar-أذكار",
        server_host: "103.252.91.90",
        server_port: 3000,
    },
    QURAN: {
        channel_name: "quran-قرآن",
    },
    // Azkar Channel Default Name
};
