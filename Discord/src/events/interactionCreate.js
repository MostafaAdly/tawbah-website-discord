// ================================================================= [ Config ]
import config from "../config.js";
// ================================================================= [ Event Handling ]
export default {
    name: "interactionCreate",
    Starter: class Starter {
        constructor(client, data) {
            this.client = client;
            this.data = data;
        }
        execute(interaction) {
            if (interaction.isChatInputCommand())
                this.data.cmds
                    .filter((cmd) => cmd.name == interaction.commandName)[0]
                    ?.starter.execute(interaction);
            else if (interaction.isButton()) {
                if (
                    ![
                        this.data.embedHandler.prefix + "play",
                        this.data.embedHandler.prefix + "pause",
                    ].includes(interaction.customId)
                )
                    return;
                // TODO: handle play, pause buttons
                switch (
                    interaction.customId.replace(
                        this.data.embedHandler.prefix,
                        ""
                    )
                ) {
                    case "play":
                        const played =
                            this.data.playerHandler.playQuranByGuildId(
                                interaction.guild.id,
                                interaction.member,
                                interaction
                            );
                        return (
                            played &&
                            this.data.embedHandler.sendStartedPlayingEmbed(
                                interaction,
                                this.data.getRadioByGuildId(
                                    interaction.guild.id
                                )
                            )
                        );
                    case "pause":
                        const radio = this.data.getRadioByGuildId(
                            interaction.guild.id
                        );
                        if (!radio) return;
                        radio.Pause();
                        return this.data.embedHandler.sendPausedEmbed(
                            interaction
                        );
                    default:
                        break;
                }
            } else if (
                interaction.isStringSelectMenu() &&
                interaction.customId ==
                    this.data.embedHandler.prefix + "reciters_menu"
            ) {
                // TODO: handle selection of reciters
                const radio = this.data.getRadioByGuildId(interaction.guild.id);
                radio.settings.quran.reciter =
                    this.data.getReciterByName(...interaction.values) ||
                    this.data.getReciterByName(
                        config.VIRTUAL_GLOBAL.reciter_name
                    );
                interaction
                    .reply({
                        content: `> Now \`${interaction.values}\` is reciting. (Starting from the next Ayah)`,
                        ephemeral: true,
                    })
                    .then((reply) =>
                        setTimeout(() => reply.delete().catch(), 5000)
                    );
            }
        }
    },
};
