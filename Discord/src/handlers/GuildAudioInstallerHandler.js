// ================================================================= [ Libraries ]
import { ChannelType } from "discord.js";
// ================================================================= [ Constructors ]
import Guild from "../constructors/Guild.js";
import AudioRadio from "../constructors/AudioRadio.js";
// ================================================================= [ Config ]
import config from "../config.js";
// ================================================================= [ Guild Installer Handler ]
export default class GuildAudioInstallerHandler {
    constructor(client, data) {
        this.client = client;
        this.data = data;
    }
    async installGuild(guildId, user, azkar_channel, quran_channel) {
        let guild = this.data.getGuildById(guildId);
        if (guild) {
            this.uninstallGuild(
                guildId,
                false,
                quran_channel && !guild.isNoQuranChannel(),
                false
            );
        } else {
            guild = this.createNewGuildData(guildId);
            this.data.guilds.push(guild);
        }
        if (azkar_channel)
            guild.addAzkarChannel(await this.createAzkarChannel(guildId));
        if (quran_channel)
            guild.setQuranChannel({
                ...(await this.createQuranChannel(guildId)),
                user,
            });
        await this.data.prisma.Save_Guild(guild);
        return true;
    }
    async uninstallGuild(
        guildId,
        delete_azkar_channel = true,
        delete_quran_channel = true,
        erase_saved_data = true
    ) {
        if (!this.isInstalled(guildId)) return false;
        const guild = this.data.getGuildById(guildId);
        if (delete_azkar_channel || delete_quran_channel)
            [
                ...(delete_azkar_channel ? guild.settings.azkar_channels : []),
                ...(delete_quran_channel
                    ? [guild.settings.quran_channel?.id] || []
                    : []),
            ].forEach((id) => {
                this.client.channels.cache?.get(id)?.delete();
            });
        if (erase_saved_data) await this.data.prisma.deleteById(guildId);
        return true;
    }
    createNewGuildData(guildId, settings = { id: guildId }) {
        this.data.print(
            this.data.colors.green("CREATED") +
                ` new guild with id:[${settings.id}]`
        );
        return new Guild(this.client, this.data, settings);
    }
    createNewAudioPlayer(
        settings = { audio_id: config.VIRTUAL_GLOBAL.audio_id }
    ) {
        this.data.print(
            this.data.colors.green("CREATED") +
                ` new audio player with id:[${settings.audio_id}]`
        );
        return new AudioRadio(this.client, this.data, settings);
    }
    addNewAudioPlayer = () => {
        const radio = new AudioRadio(this.client, this.data);
        this.data.audioPlayers.push(radio);
        return radio;
    };
    async createAzkarChannel(guildId) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return false;
        return await guild.channels.create({
            name: config.AZKAR.channel_name,
            type: ChannelType.GuildText,
        });
    }
    async createQuranChannel(guildId) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return false;
        let channel = await guild.channels.create({
            name: config.QURAN.channel_name,
            type: ChannelType.GuildText,
        });
        let message = await channel.send({
            embeds: [
                this.data.embedHandler.getQuranChannelMessageEmbedOnCreate(),
            ],
        });
        return { channel, message };
    }
    isInstalled = (guildId) => {
        const guild = this.data.getGuildById(guildId);
        return guild && guild.settings;
    };
}
