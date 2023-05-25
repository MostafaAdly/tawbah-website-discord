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
            this.name = "install";
            this.description =
                "Installs the Azkar/Quran channels for your guild.";
        }
        createSlashCommand = () =>
            new SlashCommandBuilder()
                .setName(this.name)
                .setDescription(this.description)
                .addBooleanOption((option) =>
                    option
                        .setName("azkar")
                        .setDescription(
                            "This option defines whether you want to create an azkar channel or not."
                        )
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("quran")
                        .setDescription(
                            "This option defines whether you want to create a quran channel or not."
                        )
                        .setRequired(true)
                )
                .toJSON();
        async execute(inter) {
            let created = await this.data.installer.installGuild(
                inter.guild.id,
                inter.user,
                inter.options.getBoolean("azkar"),
                inter.options.getBoolean("quran")
            );
            return await inter.reply({
                content: created ? "created" : "failed to create",
            });
        }
    },
};
