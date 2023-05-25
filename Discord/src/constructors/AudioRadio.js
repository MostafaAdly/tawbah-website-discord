// =========================================================== [ Libraries ]
import { v4 as uuid } from "uuid";
import { createAudioPlayer } from "@discordjs/voice";
// =========================================================== [ Config ]
import config from "../config.js";
// =========================================================== [ Enums ]
import RecitingType from "../enums/RecitingType.js";
// =========================================================== [ Constructor - Audio Radio ]
export default class AudioRadio {
    constructor(client, data, settings) {
        this.client = client;
        this.data = data;
        if (settings) this.settings = { ...this.settings, ...settings };
        this.checkSettings();
    }
    Pause = () => this.getVoicePlayer().pause();
    Resume = () => this.getVoicePlayer().unpause();
    getRecitation = () => {
        return {
            type: this.getRecitingType(),
            reciter: this.settings.quran?.reciter,
            surah: this.settings.quran?.surah,
            ayah: this.settings.quran?.ayah,
        };
    };
    getRecitingType = () =>
        this.settings.audio?.reciter?.settings.type ||
        RecitingType.VERSE_BY_VERSE;
    setRecitation(reciter, surah, ayah) {
        this.settings.quran.reciter = reciter || {};
        this.settings.quran.surah = surah || 1;
        this.settings.quran.ayah = ayah || 1;
    }
    setSurahAndAyah(list) {
        this.settings.quran.surah = list[0];
        this.settings.quran.ayah = list[1];
    }
    getResource = () => this.settings.resource;
    setResourcePath = (path) => {
        this.settings.resource_path = path;
    };
    setResource = (path = this.settings.resource_path) => {
        this.settings.resource = this.data.files.exists(path)
            ? createAudioResource(path)
            : null;
    };
    setVolume(volume) {}
    setReciter(reciter) {
        this.settings.quran.reciter = reciter || {};
        this.settings.quran.type =
            reciter?.type || RecitingType.CHAPTER_BY_CHAPTER;
    }
    getVoicePlayer() {
        if (!this.settings.voice_player)
            this.settings.voice_player = createAudioPlayer();
        return this.settings.voice_player;
    }
    isGlobalRadio = () =>
        this.settings.audio_id == config.VIRTUAL_GLOBAL.audio_id;
    isPlaying = () => this.getVoicePlayer().subscribers.length > 0;
    checkSettings() {
        if (!this.settings.quran) this.settings.quran = this.quran;
        if (
            !this.settings.quran.reciter ||
            !this.settings.quran.reciter?.settings ||
            !this.data.getReciterByName(
                this.settings.quran?.reciter?.settings?.name
            )
        )
            this.settings.quran.reciter = this.data.getReciterByName(
                config.VIRTUAL_GLOBAL.reciter_name
            );
    }
    isRadioServiceStarted = () => this.settings.radio_service == 1;
    settings = {
        audio_id: uuid(),
        radio_service: 0,
        resource_path: null,
        resource: null,
        voice_player: null,
        requested_by: null,
        quran: this.quran,
    };
    quran = {
        reciter: {},
        surah: 1,
        ayah: 1,
    };
}
