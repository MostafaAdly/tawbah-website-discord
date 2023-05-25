// ============================================================== [ Libraries ]
// ============================================================== [ Handlers ]
import Site from "./website/Site.js";
import Global from "./Global.js";
import FilesHandler from "./handlers/FilesHandler.js";
// ============================================================== [ Loader - SubMain ]
export default class Loader {
    constructor(data) {
        this.data = data;
    }
    // ======================= METHODs ==========================
    Load_Site() {
        this.data.site = new Site(this.data);
        this.data.site.Initialize_Application();
        this.data.site.Load_Pages();
        this.data.site.start_Server();
    }
    Load_Global = () => {
        const global = new Global(this.data);
        global.initialize();
    };
    Load_FilesHandler = () => (this.data.files = new FilesHandler(this.data));
}
