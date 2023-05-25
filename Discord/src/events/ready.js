// ================================================================= [ Libraries ]
import config from "../config.js";
// ================================================================= [ Event - Ready ]
export default {
    name: "ready",
    Starter: class Starter {
        constructor(client, data) {
            this.client = client;
            this.data = data;
        }
        execute() {
            setTimeout(() => {
                this.client.user.setPresence({
                    activities: [
                        {
                            name: config.BOT.activity_name,
                            type: config.BOT.activity_type,
                        },
                    ],
                    status: config.BOT.status,
                });
                this.data.line("Ready");
                this.data.print(`Presence is set.`);
                this.data.print(
                    `Logged in as: ${this.data.colors.yellow(
                        this.client.user.tag
                    )}`
                );
            }, config.GENERAL.delay_on_start * 1000);
        }
    },
};
