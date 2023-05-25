// ======================================================== [ Libraries ]
import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";
// ======================================================== [ Config ]
import config from "../config.js";
// ======================================================== [ Constructors ]
import Guild from "../constructors/Guild.js";
import AudioRadio from "../constructors/AudioRadio.js";
// ============================================================ [ Enums - RecitingType ]
import RecitingType from "../enums/RecitingType.js";
// ======================================================== [ Database Framework - Prisma ]
export default class Prisma extends PrismaClient {
    constructor(data) {
        // { log: ["warn", "info", "query", "error"] }
        super();
        this.data = data;
        this.data.line("PRISMA");
        this.data.print(`Prisma-MySQL was connected successfully.`, "PRISMA");
        this.includeConfiguration = {
            include: {
                quran_channel: true,
            },
        };
        this.saved = {
            radios: 0,
            guilds: 0,
        };
    }
    async Save_Guild(guild) {
        if (!guild || !guild.settings) return;
        const data = {
            id: guild.settings.id,
            azkar_channels: guild.settings.azkar_channels,
            audio_id: guild.settings.audio_id,
            ...(guild.isNoQuranChannel()
                ? {}
                : {
                      quran_channel: {
                          connectOrCreate: {
                              where: {
                                  id: guild.settings.quran_channel?.id,
                              },
                              create: guild.settings.quran_channel || {},
                          },
                      },
                  }),
        };
        await this.guild.upsert({
            create: data,
            update: data,
            where: {
                id: data.id,
            },
            ...this.includeConfiguration,
        });
        this.saved.guilds = this.saved.guilds + 1;
    }
    async Save_AudioPlayer(player) {
        if (
            !player ||
            !player.settings ||
            (!player.isGlobalRadio() && !this.isAudioPlayerUsed(player))
        )
            return;
        const data = {
            audio_id: player.settings.audio_id,
            resource_path: player.settings.resource_path,
            requested_by: player.settings.requested_by,
            quran: {
                create: {
                    reciter: player.settings.quran.reciter || {},
                    surah: player.settings.quran.surah,
                    ayah: player.settings.quran.ayah,
                },
            },
        };
        try {
            await this.quran.delete({
                where: {
                    audio_id: data.audio_id,
                },
            });
        } catch (error) {}
        await this.audio.upsert({
            create: data,
            update: data,
            where: {
                audio_id: data.audio_id,
            },
            include: {
                quran: true,
            },
        });
        this.saved.radios = this.saved.radios + 1;
    }
    async Save_ToDatabase() {
        for (var doMethod of [
            async () => {
                // Save All Audio Players
                this.data.audioPlayers.forEach(
                    async (player) => await this.Save_AudioPlayer(player)
                );
                setTimeout(() => {
                    this.data.print(
                        `Saved ${this.data.colors.yellow(
                            this.saved.radios
                        )} audio player(s) to database.`,
                        "PRISMA"
                    );
                    this.saved.radios = 0;
                }, 170);
            },
            async () => {
                // Save All Guilds
                this.data.guilds.forEach(
                    async (guild) => await this.Save_Guild(guild)
                );
                setTimeout(() => {
                    this.data.print(
                        `Saved ${this.data.colors.yellow(
                            this.saved.guilds
                        )} guild(s) to database.`,
                        "PRISMA"
                    );
                    this.saved.guilds = 0;
                }, 150);
            },
        ])
            await doMethod();
    }
    async Load_FromDatabase() {
        // await this.deleteAll();
        for (var doMethod of [
            async () => {
                // Initialize Virtual Audio Player
                let player = await this.audio.findFirst({
                    where: {
                        audio_id: config.VIRTUAL_GLOBAL.audio_id,
                    },
                    include: {
                        quran: true,
                    },
                });
                this.data.audioPlayers.push(
                    player
                        ? new AudioRadio(
                              this.data.manager.client,
                              this.data,
                              player
                          )
                        : this.data.installer.createNewAudioPlayer({
                              audio_id: config.VIRTUAL_GLOBAL.audio_id,
                              requested_by: config.VIRTUAL_GLOBAL.requested_by,
                              quran: {
                                  reciter:
                                      this.data.getReciterByName(
                                          config.VIRTUAL_GLOBAL.reciter_name
                                      ) || {},
                                  surah: config.VIRTUAL_GLOBAL.surah,
                                  ayah: config.VIRTUAL_GLOBAL.ayah,
                              },
                          })
                );
            },
            async () => {
                // Load Radio Players
                for (var player of await this.audio.findMany({
                    include: {
                        quran: true,
                    },
                }))
                    if (player.audio_id != config.VIRTUAL_GLOBAL.audio_id)
                        this.data.audioPlayers.push(
                            new AudioRadio(
                                this.data.manager.client,
                                this.data,
                                player
                            )
                        );
                this.data.print(
                    `Loaded ${this.data.colors.yellow(
                        this.data.audioPlayers.length
                    )} audio player(s) from database.`,
                    "PRISMA"
                );
            },
            async () => {
                // Load Guilds
                for (var guild of await this.guild.findMany(
                    this.includeConfiguration
                ))
                    this.data.guilds.push(
                        new Guild(
                            this.data.manager.client,
                            this.data,
                            this.LoadConfiguration(guild)
                        )
                    );
                this.data.print(
                    `Loaded ${this.data.colors.yellow(
                        this.data.guilds.length
                    )} guild(s) from database.`,
                    "PRISMA"
                );
            },
        ])
            await doMethod();
    }
    isAudioPlayerUsed(audioPlayer) {
        for (var guild of this.data.guilds)
            if (guild.settings.audio_id == audioPlayer.settings.audio_id)
                return true;
        return false;
    }
    delete = async (guild) => {
        if (!guild || !guild.settings) return;
        if (guild.settings.quran_channel?.id)
            await this.quranchannel.delete({
                where: {
                    id: guild.settings.quran_channel?.id,
                },
            });
        await this.guild.delete({
            where: {
                id: guild.settings.id,
            },
        });
        this.data.guilds = this.data.guilds.filter(
            (g) => g.settings.id != guild.settings.id
        );
        this.data.print(
            this.data.colors.red("DELETED") +
                ` guild with id ${guild.settings.id}`
        );
    };
    deleteById = async (guildId) =>
        guildId && (await this.delete(this.data.getGuildById(guildId)));
    deleteAll = async () =>
        [this.quranchannel, this.guild, this.quran, this.audio].forEach(
            async (db) => await db.deleteMany()
        );
    LoadConfiguration = (guild) => {
        return {
            id: guild.id,
            azkar_channels: guild.azkar_channels,
            audio_id: guild.audio_id,
            quran_channel: {
                id: guild.quran_channel?.id,
                message_id: guild.quran_channel?.message_id,
                created_by: guild.quran_channel?.created_by,
                created_at: guild.quran_channel?.created_at,
            },
            // audio: {
            //     audio_id: guild.audio?.audio_id,
            //     resource_path: guild.audio?.resource,
            //     requested_by: guild.audio?.requested_by,
            //     quran: {
            //         reciter: guild.audio?.quran?.reciter,
            //         surah: guild.audio?.quran?.surah,
            //         ayah: guild.audio?.quran?.ayah,
            //     },
            // },
        };
    };
}
