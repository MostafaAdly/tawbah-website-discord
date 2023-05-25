// ============================================================ [ Libraries ]
import fs from "fs";
import PATH from "path";
import { createRequire } from "module";
// ============================================================ [ Files Managers ]
export default class FilesHandler {
    constructor(data) {
        this.data = data;
    }
    path = (pathName) => PATH.join(process.cwd(), pathName);
    require = (path) =>
        createRequire(import.meta.url)(PATH.join(process.cwd(), path));
    read(path) {
        return fs.readFileSync(
            PATH.join(process.cwd(), path),
            "utf8",
            () => {}
        );
    }
    write(path, data) {
        fs.writeFileSync(PATH.join(process.cwd(), path), data, () => {});
    }
    delete(path) {
        fs.unlinkSync(PATH.join(process.cwd(), path), () => {});
    }
    exists(path, absolutePath) {
        return fs.existsSync(
            PATH.join(absolutePath ? "" : process.cwd(), path),
            () => {}
        );
    }
    list(path) {
        return fs.readdirSync(PATH.join(process.cwd(), path), () => {});
    }
    mkdir(path) {
        fs.mkdirSync(PATH.join(process.cwd(), path), () => {});
    }
}
