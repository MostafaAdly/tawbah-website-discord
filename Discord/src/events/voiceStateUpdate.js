// ======================================================================= [ Libraries ]
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
// ======================================================================= [ Event Handling ]
export default {
    name: "voiceStateUpdate",
    Starter: class Starter {
        constructor(client, data) {
            this.client = client;
            this.data = data;
        }
        execute(oldState, newState) {
            if (oldState.id != this.client.user.id) return;
            const guild = this.data.getGuildById(oldState.guild.id);
            if (
                !guild ||
                !this.data.installer.isInstalled(guild.settings?.id)
                //||oldState.channelId == newState.channelId
            )
                return;
            const radio =
                this.data.getRadioById(guild.settings.audio_id) ||
                this.data.getGlobalRadio();
            if (newState.channel) {
                guild.settings.connection = getVoiceConnection(
                    newState.guild.id
                );
                this.data.Events.emit(
                    "ClientVoiceJoin",
                    guild,
                    radio,
                    guild.settings.connection
                );
            }
            if (oldState.channel)
                this.data.Events.emit("ClientVoiceLeave", guild, radio);
        }
    },
};
