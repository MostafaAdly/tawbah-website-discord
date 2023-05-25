// =========================================================== [ Libraries ]
import {
    VoiceConnectionStatus,
    AudioPlayerStatus,
    createAudioResource,
    getVoiceConnection,
} from "@discordjs/voice";
import zeroFill from "zero-fill";
// =========================================================== [ Config ]
import config from "../config.js";
// =========================================================== [ Enums - Reciting Types ]
import RecitingType from "../enums/RecitingType.js";
// =========================================================== [ Player Handler ]
export default class PlayerHandler {
    constructor(client, data) {
        this.client = client;
        this.data = data;
        this.initializeAudioPlayerListenerHandler();
    }
    playQuranByGuildId(guildId, member, interaction) {
        if (this.isPlayingInAnotherChannel(guildId, member, interaction))
            return;
        if (!this.data.getGuildById(guildId))
            this.data.installer.installGuild(guildId);
        const guild = this.data.getGuildById(guildId);
        if (!guild)
            return (
                this.data.error(
                    `Error occured while installing guild ${guildId}`
                ) && false
            );
        if (member?.voice?.channel)
            guild.JoinVoiceChannel(member.voice.channel);
        if (!guild.getRadio().isRadioServiceStarted())
            this.AudioPlayerListenerHandler.start_RadioPlayerService(
                guild.getRadio()
            );
        else this.AudioPlayerListenerHandler.play_Quran(guild.getRadio());
        return true;
    }
    isPlayingInAnotherChannel = (guildId, member, interaction) => {
        if (this.isInSameChannelWithBot(guildId, member)) return false;
        this.data.embedHandler.sendAlreadyPlayingInAnotherChannelEmbed(
            interaction
        );
        return true;
    };
    isInSameChannelWithBot = (guildId, member) =>
        (member &&
            member.voice?.channel &&
            getVoiceConnection(guildId) &&
            member.voice.channel.id ==
                getVoiceConnection(guildId)?.joinConfig?.channelId) ||
        !getVoiceConnection(guildId);
    initializeAudioPlayerListenerHandler() {
        this.AudioPlayerListenerHandler = new this.PlayerListenerHandler(
            this.client,
            this.data,
            this
        );
        this.AudioPlayerListenerHandler.start_Listeners();
        this.AudioPlayerListenerHandler.start_AllRadioPlayerService();
    }
    getGuild = (id) => this.data.guilds.filter((g) => g.id === id)[0];
    getNextAyahOrSurah(radio) {
        if (!radio || !radio.settings) return;
        radio.setSurahAndAyah(
            this.getNextAyah(
                radio.settings.quran.surah,
                radio.settings.quran.ayah
            )
        );
    }
    getSurahByNumber = (number) => {
        return (
            (number &&
                number <= 114 &&
                number > 0 &&
                this.data.quran.surahs[number - 1]) ||
            this.getSurahByNumber(1)
        );
    };
    getAyahByNumber = (surahNumber, ayahNumber) => {
        let surahId = surahNumber > 0 && surahNumber <= 114 ? surahNumber : 1;
        return ayahNumber < 1 || ayahNumber > 286
            ? this.getAyahByNumber(surahId, 1)
            : this.getSurahByNumber(surahId).ayahs[ayahNumber - 1];
    };
    getNextSurah = (surahNumber) =>
        this.getSurahByNumber(
            this.isLastSurah(surahNumber) ? 1 : surahNumber + 1
        );
    getNextAyah = (surahNumber, ayahNumber) =>
        this.isLastAyah(surahNumber, ayahNumber)
            ? [this.getNextSurah(surahNumber).number, 1]
            : [this.getSurahByNumber(surahNumber).number, ayahNumber + 1];
    isLastSurah = (surahNumber) => surahNumber == 114;
    isLastAyah = (surahNumber, ayahNumber) =>
        this.getSurahByNumber(surahNumber).ayahs.length === ayahNumber;
    getResourceByRecitation(
        type,
        reciter = this.data.getReciterByName(
            config.VIRTUAL_GLOBAL.reciter_name
        ),
        surahNumber = 1,
        ayahNumber = 1
    ) {
        let mp3file;
        switch (type) {
            case RecitingType.VERSE_BY_VERSE:
                mp3file = this.data.files.path(
                    this.filterPath(
                        config.PATHS.recitation_verseByVerse,
                        reciter,
                        surahNumber,
                        ayahNumber
                    )
                );
                return this.data.files.exists(mp3file, true)
                    ? createAudioResource(mp3file)
                    : null;
            default:
                mp3file = this.data.files.path(
                    this.filterPath(
                        config.PATHS.recitation_chapterByChapter,
                        reciter,
                        surahNumber,
                        ayahNumber
                    )
                );
                return this.data.files.exists(mp3file, true)
                    ? createAudioResource(mp3file)
                    : null;
        }
    }
    filterPath(path, reciter, surahNumber, ayahNumber) {
        return path
            .replaceAll("%reciter_name%", reciter.settings.name)
            .replaceAll("%surah_name%", this.getSurahByNumber(surahNumber).name)
            .replaceAll("%surah_number%", zeroFill(3, surahNumber))
            .replaceAll("%ayah_number%", zeroFill(3, ayahNumber));
    }
    getConnectedGuildsByRadioId(radioId) {
        const guilds = [];
        this.data.guilds.forEach((guild) => {
            if (
                guild.settings.audio_id == radioId &&
                !guilds.includes(guild.settings.id)
            )
                guilds.push(guild.settings.id);
        });
        return guilds;
    }
    PlayerListenerHandler = class AudioPlayerListenerHandler {
        constructor(client, data, handler) {
            this.client = client;
            this.data = data;
            this.handler = handler;
        }
        start_Listeners() {
            this.data.Events.on(
                "ClientVoiceJoin",
                (guild, radio, connection) => {
                    if (radio.isGlobalRadio()) guild.connect_Radio(radio);
                    else this.play_Quran(radio);
                }
            );
            this.data.Events.on("ClientVoiceLeave", (guild, radio) => {});
        }
        start_AllRadioPlayerService = () =>
            this.data.audioPlayers.forEach((radio) =>
                this.start_RadioPlayerService(radio)
            );
        start_RadioPlayerService(radio, calculateAtFirst) {
            if (calculateAtFirst) this.handler.getNextAyahOrSurah(radio);
            this.play_Quran(radio);
            radio.settings.radio_service = 1;
            radio.getVoicePlayer().on("idle", () => {
                this.handler.getNextAyahOrSurah(radio);
                this.play_Quran(radio);
            });
        }
        play_Quran(radio, overridePlayingState) {
            if (!radio) return;
            const recitation = radio.getRecitation();
            radio.settings.resource = this.handler.getResourceByRecitation(
                recitation.type,
                recitation.reciter,
                recitation.surah,
                recitation.ayah
            );
            if (!radio.settings.resource) return;
            radio.getVoicePlayer().play(radio.settings.resource);
            for (var guildId of this.handler.getConnectedGuildsByRadioId(
                radio.settings.audio_id
            )) {
                const guild = this.data.getGuildById(guildId);
                if (!guild) continue;
                guild.edit_QuranChannelMessage();
                guild.connect_Radio(radio, true);
            }
        }
    };
}
