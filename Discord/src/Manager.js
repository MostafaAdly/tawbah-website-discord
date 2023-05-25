// ============================================================= [ Libraries ]
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { EventEmitter } from "events";
// ============================================================= [ Handlers ]
import Loader from "./Loader.js";
import Global from "./Global.js";
import FilesHandler from "./handlers/FilesHandler.js";
import Prisma from "./handlers/PrismaHandler.js";
// ============================================================= [ Manager ]
export default class Manager {
    constructor() {
        this.data = {
            manager: this,
            Events: new EventEmitter(),
            files: new FilesHandler(this.data),
            audioPlayers: [],
            events: [],
            cmds: [],
            guilds: [],
            prisma: null,
            quran: {
                reciters: [],
                surahs: [],
            },
            azkar: {
                connectionSettings: null,
            },
        };
        dotenv.config();
    }
    intialize() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
            ],
        });
        (async () => {
            new Global(this.data).initialize(); // initializes global variables
            await this.startLoader();
            await this.client.login(process.env.DISCORD_TOKEN);
            await this.loader.Load_Commands();
        })();
    }
    async startPrisma() {
        this.data.prisma = new Prisma(this.data);
        await this.data.prisma.Load_FromDatabase();
    }
    async startLoader() {
        this.loader = new Loader(this.client, this.data);
        // ===== [ Load Guild Installer ] =====
        this.loader.Load_GuildInstallerHandler();
        // ===== [ Load Quran ] =====
        this.loader.Load_AllReciters();
        this.loader.Load_TotalQuran();
        // ===== [ Load Prisma ] =====
        await this.startPrisma();
        // ===== [ Load Late Handlers ] =====
        this.loader.Load_EmbedHandler();
        this.loader.Load_PlayerHandler();
        // ===== [ Load Azkar ] =====
        this.loader.Load_AzkarHandler();
        this.loader.Initialize_AzkarHandler();
        // ===== [ Load Discord ] =====
        await this.loader.Load_Start_DiscordEvents();
        // ===== [ Load Late Main Process ] =====
        await this.loader.deployProcessExitListener();
        await this.loader.start_SavialInterval();
    }
}
