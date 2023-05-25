// ============================================================ [ Libraries ]
import PATH from "path";
// ============================================================ [ Enums ]
import RecitingType from "../enums/RecitingType.js";
// ============================================================ [ Constructor - Reciter ]
export default class Reciter {
    constructor(settings) {
        this.settings = { ...this.settings, ...settings };
    }
    path() {
        return PATH.join(
            process.cwd(),
            `./Discord/src/database/reciters/${this.settings.name}/`
        );
    }
    surah(surah) {
        return PATH.join(
            this.settings.path(),
            `./Discord/src/database/reciters/${this.settings.type}/${this.settings.name}/${surah.name}/`
        );
    }
    ayah(ayah) {
        return PATH.join(
            this.settings.path(),
            `./Discord/src/database/reciters/${this.settings.type}/${this.settings.name}/${surah.name}/${ayah.numberInSurah}`
        );
    }
    settings = {
        id: null,
        name: null,
        en_name: null,
        type: RecitingType.CHAPTER_BY_CHAPTER,
    };
}
