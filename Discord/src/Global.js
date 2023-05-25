// ========================================================= [ Libraries ]
import colors from "colors";
import dateFormat from "dateformat";
// ========================================================= [ Config ]
import config from "./config.js";
// ========================================================= [ Global ]
export default class Global {
    constructor(data) {
        this.data = data;
        this.data.colors = colors;
    }
    initialize() {
        this.data.print = (msg, name = "Global") =>
            console.log(
                `${
                    name
                        ? this.countSpaces("", 3) +
                          (name.toLowerCase() == "error"
                              ? this.data.colors.red("[" + name + "]")
                              : this.data.colors.cyan("[" + name + "]")) +
                          this.countSpaces(name, 12)
                        : ""
                }${dateFormat(Date.now())} - ${msg}`
            );
        this.data.line = (msg = "-------", name) =>
            this.data.print(
                `--------- ${
                    msg[
                        ["error", "exit"].includes(msg.toLowerCase())
                            ? "red"
                            : "magenta"
                    ]
                } ---------`,
                name || msg
            );
        this.data.error = (msg, name) =>
            this.data.print(this.data.colors.red(msg), name);
        this.data.getGuildById = (guildId) =>
            guildId &&
            this.data.guilds.filter((g) => g.settings.id == guildId)[0];
        this.data.getRadioById = (radioId) =>
            radioId &&
            this.data.audioPlayers.filter(
                (r) => r.settings.audio_id == radioId
            )[0];
        this.data.getRadioByGuildId = (guildId) =>
            guildId &&
            this.data.getRadioById(
                this.data.getGuildById(guildId).settings.audio_id
            );
        this.data.getGlobalRadio = () =>
            this.data.getRadioById(config.VIRTUAL_GLOBAL.audio_id);
        this.data.getByValue = (data, value) => {
            for (const [key, val] of Object.entries(data))
                if (val === value) return key;
            return null;
        };
        this.data.getReciterByName = (reciterName) =>
            this.data.quran.reciters.filter(
                (reciter) => reciter.settings.name == reciterName
            )[0];
        this.data.getReciterById = (reciterId) =>
            this.data.quran.reciters.filter(
                (reciter) => reciter.settings.id == reciterId
            )[0];
    }
    countSpaces(word = "", amount = 0) {
        let whiteSpaces = "";
        for (let i = 0; i < Math.abs(amount - word.length); i++)
            whiteSpaces += " ";
        return whiteSpaces;
    }
}
