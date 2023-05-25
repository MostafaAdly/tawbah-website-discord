// ============================================== [ Constructor - Loaded Command ]
export default class LoadedCommand {
    constructor(name, description, file, permissions, starter) {
        this.name = name;
        this.description = description;
        this.file = file;
        this.permissions = permissions;
        this.starter = starter;
    }
}
