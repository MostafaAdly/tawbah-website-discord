// ================================================================ [ Libraries ]
// ================================================================ [ Handlers ]
import Loader from "./Loader.js";
// ================================================================ [ Webiste - Main ]
export default class Website {
    constructor() {
        this.data = {
            website: this,
            app: null,
        };
    }
    // ============================== METHODs =============================
    Initialize_Website() {
        (async () => {
            this.start_Loader();
        })();
    }
    start_Loader() {
        this.loader = new Loader(this.data);
        this.loader.Load_Global();
        this.loader.Load_FilesHandler();
        this.loader.Load_Site();
    }
}
