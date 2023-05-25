// ================================================================= [ Libraries ]
import {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    StringSelectMenuOptionBuilder,
    StringSelectMenuBuilder,
} from "discord.js";
import progressbar from "string-progressbar";
import zeroFill from "zero-fill";
// ================================================================= [ Config ]
import config from "../config.js";
// ================================================================= [ Enums ]
import RecitingType from "../enums/RecitingType.js";
// ================================================================= [ EmbedHandler ]
export default class EmbedHandler {
    constructor(client, data) {
        this.client = client;
        this.data = data;
        this.prefix = "tawbah_";
    }
    getAzkarEmbed = ({ type, content, description }) => {
        return new EmbedBuilder()
            .setColor("Random")
            .setTitle(type)
            .setDescription(content)
            .setTimestamp();
    };
    sendPausedEmbed(interaction) {
        if (!interaction) return;
        interaction
            .reply({
                embeds: [
                    new EmbedBuilder().setTitle(`تم توقف تلاوة القرآن الكريم`)
                        .setDescription(`
                        تم توقف تلاوة القرآن الكريم للشيخ: ${
                            this.data.getRadioByGuildId(interaction.guild.id)
                                .settings.quran.reciter.settings.name
                        }
                        بواسطة: ${interaction.member.user.tag}
                        `),
                ],
                ephemeral: true,
            })
            .then((reply) => setTimeout(() => reply.delete().catch(), 5000))
            .catch();
    }
    sendStartedPlayingEmbed(interaction) {
        if (!interaction) return;
        interaction
            .reply({
                embeds: [
                    new EmbedBuilder().setTitle(`بدأ تلاوة القرآن الكريم`)
                        .setDescription(`
        البوت سيبدأ الآن تلاوة القرآن الكريم
        لفضيلة الشيخ: ${
            this.data.getRadioByGuildId(interaction.guild.id).settings.quran
                .reciter.settings.name
        }
            `),
                ],
                ephemeral: true,
            })
            .then((reply) => setTimeout(() => reply.delete().catch(), 5000))
            .catch();
    }
    sendAlreadyPlayingInAnotherChannelEmbed(interaction) {
        if (!interaction) return;
        interaction
            .reply({
                embeds: [
                    new EmbedBuilder().setColor("Aqua").setTitle(`حدث خطأ`)
                        .setDescription(`
            هذا البوت يوجد بالفعل في حجرة صوتية اخرى
            `),
                ],
                ephemeral: true,
            })
            .then((reply) => setTimeout(() => reply.delete().catch(), 5000))
            .catch();
    }
    getQuranChannelMessageEmbedOnCreate() {
        return new EmbedBuilder()
            .setColor("Random")
            .setTitle(`Tawbah - قرآن`)
            .setDescription(
                `
                هنا ستعرض الآيات/السور القرآنية مع بداية بوت لقراءة القرآن
                أبدا القراءة عن طريقة الأمر /play
                `
            )
            .setFooter({ text: `لمعلومات اكثر: /help` })
            .setTimestamp();
    }
    getQuranChannelMessage(guild, radio, user) {
        const { reciter, surah = 1, ayah = 1 } = radio.getRecitation();
        const { surahData, ayahData } = {
            surahData: this.data.playerHandler.getSurahByNumber(surah || 1),
            ayahData: this.data.playerHandler.getAyahByNumber(
                surah || 1,
                ayah || 1
            ),
        };
        const progress = [...this.getProgressbar(surahData.ayahs.length, ayah)]
            .reverse()
            .join("");
        let fields = [
            {
                name: "التلاوة الحالية للقارئ",
                value: `${
                    reciter?.settings?.name ||
                    config.VIRTUAL_GLOBAL.reciter_name
                }`,
                inline: true,
            },
            {
                name: "الجزء الحالي",
                value: `${zeroFill(2, ayahData.juz)}`,
                inline: true,
            },
            {
                name: "السورة الحالية",
                value: `${surahData.name}`,
                inline: true,
            },
            {
                name: "شريط التقدم",
                value: `العدد الكلي: \`${surahData.ayahs.length}\` [${progress}] الآية: \`${ayah}\``,
            },
        ];
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`${zeroFill(3, surah)} - ${surahData.name}`)
            .setFields(fields.filter((field) => Object.keys(field).length > 0))
            .setFooter({
                iconURL: this.client.user.displayAvatarURL(),
                ...(user ? { text: `Last request by: ${user.tag}` } : {}),
            })
            .setTimestamp();

        if (this.isVerseByVerse(radio))
            embed.setDescription(`
            **:الآية الحالية**
            ${ayahData.text}
            `);
        return {
            embeds: [embed],
            components: [
                this.getComponentBuilder(this.getRecitersMenu()),
                this.getComponentBuilder(
                    this.createButton("play", "Play"),
                    this.createButton("pause", "Pause", ButtonStyle.Danger)
                ),
            ],
        };
    }
    createButton = (id, label, style) =>
        new ButtonBuilder()
            .setCustomId(this.prefix + id)
            .setLabel(label)
            .setStyle(!style ? ButtonStyle.Success : style);
    getComponentBuilder = (...components) =>
        new ActionRowBuilder().addComponents(...components);
    getRecitersMenu = () => {
        const options = [];
        this.data.quran.reciters.forEach((reciter) => {
            if (options.length < 24)
                options.push(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`الشيخ ${reciter.settings.name}`)
                        .setDescription(
                            `أضغط لتختر فضيلة الشيخ ${reciter.settings.name}`
                        )
                        .setValue(reciter.settings.name)
                );
        });

        return new StringSelectMenuBuilder()
            .setCustomId(this.prefix + "reciters_menu")
            .setPlaceholder("Choose a Reciter (Sheikh) - اختر قارئا (شيخ)")
            .addOptions(...options);
    };
    getProgressbar(total, current) {
        return progressbar.splitBar(total, current, 16)[0];
    }
    isVerseByVerse = (radio) =>
        radio.getRecitingType() == RecitingType.VERSE_BY_VERSE;
}
