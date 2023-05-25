// ================================================================= [ Libraries ]
import net from "net";
// ================================================================= [ Azkar Handler ]
export default class AzkarHandler {
    constructor(client, data) {
        this.client = client;
        this.data = data;
    }
    connect_BackendServer = () => {
        this.data.line("Azkar Backend Server", "Azkar");
        this.data.print(
            `Connecting to Azkar Backend Server on ${process.env.AZKAR_SERVER_HOST}:${process.env.AZKAR_SERVER_PORT}`,
            "Azkar"
        );
        this.socket = net.connect(
            process.env.AZKAR_SERVER_PORT,
            process.env.AZKAR_SERVER_HOST
        );
        this.data.print(`Connected to the Azkar Server.`, "Azkar");
    };
    start_BackendListeners = () => {
        if (!this.socket) return;
        this.socket.on("data", (response) => {
            const data = JSON.parse(response.toString("utf-8"));
            if (data.type) this.data.Events.emit("azkar", data);
            else this.data.azkar.connectionSettings = data;
        });
        this.data.Events.on("azkar", (azkar) => {
            for (var guild of this.data.guilds) {
                if (
                    !guild?.settings ||
                    !guild?.settings?.azkar_channels?.length
                )
                    continue;
                for (var channelId of guild.settings.azkar_channels) {
                    const channel = this.client.channels.cache.get(channelId);
                    if (!channel) continue;
                    channel.send({
                        embeds: [this.data.embedHandler.getAzkarEmbed(azkar)],
                    });
                }
            }
        });
    };
}
