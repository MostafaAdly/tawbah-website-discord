// ============================================================ [ Libraries ]
import { REST, Routes } from "discord.js";
// ============================================================ [ Handlers ]
import AzkarHandler from "./handlers/AzkarHandler.js";
import EmbedHandler from "./handlers/EmbedHandler.js";
import PlayerHandler from "./handlers/PlayerHandler.js";
import GuildAudioInstallerHandler from "./handlers/GuildAudioInstallerHandler.js";
// ============================================================ [ Config ]
import config from "./config.js";
// ============================================================ [ Enums ]
import RecitingType from "./enums/RecitingType.js";
// ============================================================ [ Constructors ]
import LoadedCommand from "./constructors/LoadedCommand.js";
import LoadedEvent from "./constructors/LoadedEvent.js";
import Reciter from "./constructors/Reciter.js";
// ============================================================ [ Loader ]
export default class Loader {
    constructor(client, data) {
        this.client = client;
        this.data = data;
    }
    // =============================================================[ Main-Process Loading Methods ]
    deployProcessExitListener() {
        process.on("uncaughtException", (error) => this.gracefullyExit(error));
        process.on("SIGINT", async () => await this.gracefullyExit());
    }
    start_SavialInterval() {
        setInterval(async () => {
            await this.data.prisma.Save_ToDatabase();
        }, config.GENERAL.save_interval * 1000);
    }
    async gracefullyExit(err) {
        if (err) {
            this.data.line(`ERROR`);
            this.data.error(`ERROR caught:`, "ERROR");
            console.error(err);
        }
        this.data.line("EXIT");
        await this.data.prisma.Save_ToDatabase();
        await this.data.prisma.$disconnect();
        setTimeout(
            async () => process.exit(1),
            config.GENERAL.delay_on_exit * 1000
        );
    }
    // =============================================================[ Install Azkar ]
    Load_AzkarHandler = () =>
        (this.data.azkarHandler = new AzkarHandler(this.client, this.data));
    Initialize_AzkarHandler = () =>
        this.data.azkarHandler.connect_BackendServer() &&
        this.data.azkarHandler.start_BackendListeners();
    // =============================================================[ Install Helping Handlers ]
    Load_GuildInstallerHandler = () =>
        (this.data.installer = new GuildAudioInstallerHandler(
            this.client,
            this.data
        ));
    Load_PlayerHandler = () =>
        (this.data.playerHandler = new PlayerHandler(this.client, this.data));
    Load_EmbedHandler = () =>
        (this.data.embedHandler = new EmbedHandler(this.client, this.data));
    // =============================================================[ Quran Loading Methods ]
    Load_TotalQuran() {
        this.data.quran.surahs = this.data.files.require(
            "../database/quran.json"
        ).surahs;
    }
    Load_AllReciters() {
        for (var type of [
            RecitingType.VERSE_BY_VERSE,
            RecitingType.CHAPTER_BY_CHAPTER,
        ])
            for (var reciter of this.data.files.list(
                `../database/reciters/${type}/`
            ))
                this.data.quran.reciters.push(
                    new Reciter({
                        id: this.data.quran.reciters.length + 1,
                        name: reciter,
                        en_name: reciter,
                        type,
                    })
                );
    }
    // =============================================================[ Discord Loading Methods ]
    async Load_Start_DiscordEvents() {
        this.data.line("Listeners");
        for (var file of this.data.files.list("./src/events/")) {
            if (!file.endsWith(".js")) continue;
            const event = (await import(`./events/${file}`)).default;
            this.client.on(event.name, async (...arg) =>
                new event.Starter(this.client, this.data).execute(...arg)
            );
            if (!this.data.events) this.data.events = [];
            this.data.events.push(
                new LoadedEvent(event.name, `./src/events/${file}`)
            );
            this.data.print(
                `Loaded Listener: [${this.data.colors.green(file)}]`
            );
        }
    }
    async Load_Commands() {
        this.data.line("Commands");
        const commands = [];
        for (var file of this.data.files.list("./src/cmds/")) {
            if (!file.endsWith(".js")) continue;
            const command = (await import(`./cmds/${file}`)).default;
            const starter = new command.Starter(this.client, this.data);
            commands.push(starter.createSlashCommand());
            if (!this.data.cmds) this.data.cmds = [];
            this.data.cmds.push(
                new LoadedCommand(
                    starter.name,
                    starter.description,
                    file,
                    command.permissions,
                    starter
                )
            );
            this.data.print(
                `Loaded Command: [${this.data.colors.green(file)}]`
            );
        }
        this.Deploy_Commands(commands);
    }
    Deploy_Commands(commands) {
        const rest = new REST().setToken(process.env.DISCORD_TOKEN);
        (async () => {
            try {
                const data = await rest.put(
                    Routes.applicationCommands(this.client.user.id),
                    { body: commands }
                );
                this.data.print(
                    `Successfully reloaded ${data.length} application (/) commands.`
                );
            } catch (error) {
                console.error(error);
            }
        })();
    }
}
