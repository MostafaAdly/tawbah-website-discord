export default {
    name: "messageCreate",
    Starter: class Starter {
        constructor(client, data) {
            this.client = client;
            this.data = data;
        }
        execute(msg) {
            if (msg.author.bot || !msg.guild) return;
            console.log(msg.author.tag, msg.content);
        }
    },
};
