// ========================================================= [ Libraries ]
import colors from "colors";
import dateFormat from "dateformat";
import PATH from "path";
// ========================================================= [ Config ]
import config from "./configuration/config.js";
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
        this.data.line = (name = "-------") =>
            this.data.print(
                `--------- ${
                    name[
                        ["error", "exit"].includes(name.toLowerCase())
                            ? "red"
                            : "magenta"
                    ]
                } ---------`,
                name
            );
        this.data.error = (msg, name) =>
            this.data.print(this.data.colors.red(msg), name);
        this.data.require = (path) =>
            createRequire(import.meta.url)(PATH.join(process.cwd(), path));
    }
    countSpaces(word = "", amount = 0) {
        let whiteSpaces = "";
        for (let i = 0; i < Math.abs(amount - word.length); i++)
            whiteSpaces += " ";
        return whiteSpaces;
    }
}
