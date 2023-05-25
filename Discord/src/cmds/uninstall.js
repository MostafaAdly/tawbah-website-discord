// =================================================================== [ Libraries ]
import { joinVoiceChannel } from "@discordjs/voice";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import progressbar from "string-progressbar";
// =================================================================== [ Player ]
export default {
    permissions: [],
    Starter: class Starter {
        constructor(client, data) {
            this.client = client;
            this.data = data;
            this.name = "uninstall";
            this.description =
                "Uninstalls the Azkar/Quran channels of your guild.";
        }
        createSlashCommand = () =>
            new SlashCommandBuilder()
                .setName(this.name)
                .setDescription(this.description)
                .addBooleanOption((option) =>
                    option
                        .setName("delete-channels")
                        .setDescription(
                            "This option defines whether you want to delete Azkar/Quran channels or not."
                        )
                        .setRequired(true)
                )
                .toJSON();
        async execute(inter) {
            let deleted = await this.data.installer.uninstallGuild(
                inter.guild.id,
                inter.options.getBoolean("delete-channels"),
                inter.options.getBoolean("delete-channels")
            );
            return await inter.reply({
                content: deleted ? "deleted" : "failed to delete",
            });
        }
    },
};
