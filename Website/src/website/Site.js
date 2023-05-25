// ================================================================= [ Libraries ]
import express from "express";
import fs from "fs";
// ================================================================= [ Config ]
import config from "../configuration/config.js";
// ================================================================= [ Website - self ]
export default class Site {
    constructor(data) {
        this.data = data;
        this.pages = {};
    }
    Initialize_Application() {
        // ---------------- initializing data
        this.data.app = express();
        this.data.router = express.Router();
        // ---------------- Middleware
        this.data.app.use(express.json());
        this.data.app.use(express.urlencoded({ extended: true }));
        // ---------------- Routes
        this.data.app.use(this.data.router);
    }
    Load_Pages() {
        this.data.files.list("./src/website/routes").forEach(async (file) => {
            const Route = (await import(`./routes/${file}`)).default;
            this.pages[file.replace(".js", "")] = new Route(
                this.data
            ).start_Route();
        });
    }
    start_Server() {
        this.data.app.listen(
            config.WEBSITE.port || 80,
            this.data.print(
                `Website is available on port ${config.WEBSITE.port}`
            )
        );
    }
}
