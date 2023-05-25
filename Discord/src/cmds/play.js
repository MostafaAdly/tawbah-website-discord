// =================================================================== [ Libraries ]
import {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
} from "@discordjs/voice";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
// =================================================================== [ Player ]
export default {
    permissions: [],
    Starter: class Starter {
        constructor(client, data) {
            this.client = client;
            this.data = data;
            this.name = "play";
            this.description = "Plays Quran in a voice channel.";
        }
        createSlashCommand = () =>
            new SlashCommandBuilder()
                .setName(this.name)
                .setDescription(this.description)
                .addNumberOption((option) =>
                    option
                        .setName("reciter")
                        .setDescription(
                            "Choose a Reciter by their id (You can display the available reciters by /reciters)"
                        )
                )
                .addNumberOption((option) =>
                    option
                        .setName("surah-number")
                        .setDescription(
                            "Choose a Surah by its number [ 1 -> 114 ] (i.e. 1 = Al-Faatiha , 2 -> An-Naas)"
                        )
                )
                .addNumberOption((option) =>
                    option
                        .setName("ayah-number")
                        .setDescription(
                            "Choose an Ayah by its number in the surah"
                        )
                )
                .toJSON();
        async execute(interaction) {
            const voiceChannel = interaction.member.voice.channel;
            if (!voiceChannel)
                return await interaction.reply({
                    content: "> You need to join a voice channel first.",
                    ephemeral: true,
                });
            const played = this.data.playerHandler.playQuranByGuildId(
                voiceChannel.guild.id,
                interaction.member,
                interaction
            );
            return (
                played &&
                this.data.embedHandler.sendStartedPlayingEmbed(
                    interaction,
                    this.data.getRadioByGuildId(interaction.guild.id)
                )
            );
        }
    },
};
