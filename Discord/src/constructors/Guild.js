// ============================================================ [ Libraries ]
import {
    joinVoiceChannel,
    getVoiceConnection,
    createAudioPlayer,
    createAudioResource,
} from "@discordjs/voice";
import { v4 as uuid } from "uuid";
// ============================================================ [ Config ]
import config from "../config.js";
// ============================================================ [ Constructor - Guild ]
export default class Guild {
    constructor(client, data, settings) {
        this.client = client;
        this.data = data;
        if (settings) this.settings = { ...this.settings, ...settings };
        this.checkSettings();
    }
    edit_QuranChannelMessage = () => {
        if (
            !this.settings.quran_channel?.id ||
            !this.settings.quran_channel?.message_id
        )
            return;
        try {
            this.client.channels.cache
                .get(this.settings.quran_channel.id)
                .messages.fetch(this.settings.quran_channel.message_id)
                .then((message) =>
                    message.edit(
                        this.data.embedHandler.getQuranChannelMessage(
                            this,
                            this.data.getRadioById(this.settings.audio_id),
                            this.settings.quran_channel.created_by
                                ? this.client.users.cache.get(
                                      this.settings.quran_channel.created_by
                                  )
                                : null
                        )
                    )
                );
        } catch (error) {}
    };
    createPrivateRadio() {
        const radio = this.data.installer.addNewAudioPlayer();
        this.settings.audio_id = radio.settings.audio_id;
        this.connect_Radio(radio);
    }
    connect_Radio(radio, override) {
        if (!radio || !this.getVoiceConnection()) return;
        this.settings.audio_id = radio.settings.audio_id;
        this.getVoiceConnection().subscribe(radio.getVoicePlayer());
        if (!radio.isPlaying() && !override) this.play_Quran(radio);
    }
    setQuranChannel({ channel, message, user }) {
        if (!channel) return;
        this.settings.quran_channel.id = channel.id;
        this.settings.quran_channel.message_id = message?.id;
        this.settings.quran_channel.created_by = user?.id;
        this.settings.quran_channel.created_at = new Date();
    }
    addAzkarChannel = (channel) =>
        channel && this.settings.azkar_channels.push(channel.id);

    JoinVoiceChannel(channel) {
        if (!channel) return;
        this.settings.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        return this.settings.connection;
    }
    getVoiceConnection = () =>
        this.settings.connection || getVoiceConnection(this.settings.id);
    isNoQuranChannel = () => !this.settings?.quran_channel?.id;
    checkSettings() {
        if (!this.settings.audio_id) this.createPrivateRadio();
    }
    getRadio = () => this.data.getRadioById(this.settings.audio_id);
    settings = {
        id: uuid(),
        connection: null,
        azkar_channels: [],
        audio_id: null,
        quran_channel: {
            id: null,
            message_id: null,
            created_by: null,
            created_at: null,
        },
    };
}
