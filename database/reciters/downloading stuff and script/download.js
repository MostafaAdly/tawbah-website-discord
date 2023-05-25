import http from "http";
import https from "https";
import { v4 as uuid } from "uuid";
import fs, { mkdir } from "fs";
import fsextra from "fs-extra";
import unzipper from "unzipper";
import zeroFill from "zero-fill";
import path from "path";
import { createRequire } from "module";

import tar from "tar";

const require = createRequire(import.meta.url);

// tar.extract({
//     file: "./compressed/Minshawy_Mujawwad.tar",
//     cwd: "./downloaded/Minshawy_Mujawwad",
// })
//     .then(() => {
//         console.log("Tar archive extracted successfully");
//     })
//     .catch((error) => {
//         console.error("Error while extracting tar archive:", error);
//     });

const organizeFiles = async (dir) => {
    if (!fs.existsSync(path.join(process.cwd(), dir))) return;
    console.log("-------");
    let copied = 0;
    let totalfiles = 0;
    for (var surah of quran.surahs) {
        if (
            !fs.existsSync(
                path.join(
                    process.cwd(),
                    `./${dir}/${zeroFill(3, surah.number)} - ${surah.name}`
                )
            )
        )
            continue;
        for (var file of fs.readdirSync(dir)) {
            if (
                !file.endsWith(".mp3") ||
                file.replace(".mp3", "").length != 6 ||
                file.substring(0, 3) != zeroFill(3, surah.number)
            ) {
                if (!file.endsWith(".mp3") && file.includes("."))
                    fs.unlinkSync(path.join(process.cwd(), `${dir}/${file}`));
                // if (!file.endsWith(".mp3"))
                //     fsextra.remove(path.join(process.cwd(), `${dir}/${file}`));
                continue;
            }
            totalfiles += 1;
            let source = path.join(process.cwd(), `${dir}/${file}`);
            let dest = path.join(
                `${dir}/${zeroFill(3, surah.number)} - ${surah.name}`,
                path.basename(`${dir}/${file}`)
            );
            // Copy file
            fs.writeFileSync(dest, fs.readFileSync(source));

            // Remove original file
            fs.unlinkSync(source);
            // fs.copyFileSync(source, dest, (err) => {
            //     if (err) throw err;
            //     // console.log("File copied successfully! -> " + file);

            //     // Remove original file
            //     fs.unlinkSync(source, (err) => {
            //         if (err) throw err;
            //         // console.log("Original file removed!");
            //     });
            // });

            // fs.copyFile(
            //     `${dir}/${file}`,
            //     path.join(
            //         `${dir}/${zeroFill(3, surah.number)} - ${surah.name}`,
            //         path.basename(`${dir}/${file}`)
            //     ),
            //     (err) => {
            //         if (!err) {
            //             copied += 1;
            //         } else console.log(err);
            //         try {
            //             fs.unlinkSync(
            //                 path.join(process.cwd(), `${dir}/${file}`)
            //             );
            //             console.log("deleted");
            //         } catch (error) {}
            //     }
            // );
        }
    }
    console.log(
        `copied total of ${copied} in ${dir}, of total files ${totalfiles}`
    );
};
const deleteIfNotDirectory = (path) => {
    fs.stat(path, (err, stats) => {
        if (!err && !stats.isDirectory()) {
            try {
                // fs.unlinkSync(path);
                console.log(`deleted ${path}`);
            } catch (error) {}
        }
    });
};

const quran = require(`../quran.json`);
for (var file of fs.readdirSync("./downloaded/")) {
    for (var surah of quran.surahs)
        if (
            !fs.existsSync(
                `./downloaded/${file}/${zeroFill(3, surah.number)} - ${
                    surah.name
                }`
            )
        ) {
            mkdir(
                `./downloaded/${file}/${zeroFill(3, surah.number)} - ${
                    surah.name
                }`,
                () => {}
            );
        }
    // for (var asd of fs.readdirSync(`./downloaded/${file}/`)) {
    //     fs.stat(`./downloaded/${file}/${asd}`, (err, stats) => {
    //         if (err) {
    //             console.error(err);
    //         } else {
    //             if (stats.isDirectory()) {
    //                 fs.unlinkSync(`./downloaded/${file}/${asd}`);
    //             }
    //         }
    //     });
    // }
    organizeFiles(`./downloaded/${file}`);
    console.log(`Reciter ${file.split("-")[0]} done`);
}

const unzipped = [];
const unzipFile = (file) => {
    fs.createReadStream(file)
        .pipe(
            unzipper.Extract({
                path: file
                    .replace("/compressed/", "/downloaded/")
                    .replaceAll(".zip", "")
                    .replaceAll(".tar", ""),
            })
        )
        .on("finish", () => {
            console.log(`Extraction complete of ${file}`);
            unzipped.push(file);
            fs.unlinkSync(file);
            for (var a of fs.readdirSync("./compressed/"))
                if (
                    !unzipped.includes(`./compressed/${a}`) &&
                    (a.includes(".zip") || a.includes(".tar"))
                ) {
                    unzipFile(`./compressed/${a}`);
                    break;
                }
        })
        .on("error", (err) => {
            console.error(`Error while extracting[${file}]: ${err.message}`);
            unzipped.push(file);
            fs.unlinkSync(file);
            for (var a of fs.readdirSync("./compressed/"))
                if (
                    !unzipped.includes(`./compressed/${a}`) &&
                    a.includes(".zip")
                ) {
                    unzipFile(`./compressed/${a}`);
                    break;
                }
        });
};
// unzipFile("./compressed/Muhammad_AbdulKareem.zip");

const downloaded = [];
const downloadReciter = async (reciters, reciter, link) => {
    const filepath = `downloaded/${reciter}.zip`;
    const file = fs.createWriteStream(filepath);
    (link.startsWith("https") ? https : http)
        .get(link, function (response) {
            const time = new Date().getTime();
            console.log(`Started download of ${reciter}`);
            response.pipe(file);
            file.on("error", console.error);
            file.on("finish", async () => {
                file.close();
                downloaded.push(reciter);
                console.log(
                    `[${reciter}] Download Completed in ${
                        (new Date().getTime() - time) / 1000
                    } seconds`
                );
                for (const [key, value] of Object.entries(reciters))
                    if (!downloaded.includes(key)) {
                        await downloadReciter(reciters, key, value);
                        break;
                    }
            });
        })
        .on("error", async (err) => {
            fs.unlink(filepath);
            downloaded.push(reciter);

            for (const [key, value] of Object.entries(reciters))
                if (!downloaded.includes(key)) {
                    downloadReciter(reciters, key, value);
                    break;
                }
            console.log(`errored downloaded ${reciter}`);
        });
};

(async () => {
    const reciters = {
        // "Yasser_Ad-Dussary":
        //     "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/000_versebyverse.zip",
        // warsh_yassin_al_jazaery:
        //     "https://everyayah.com/data/warsh/warsh_yassin_al_jazaery_64kbps/000_versebyverse.zip",
        // warsh_ibrahim_aldosary:
        //     "https://everyayah.com/data/warsh/warsh_ibrahim_aldosary_128kbps/000_versebyverse.zip",
        // Abdul_Basit_Murattal:
        //     "https://everyayah.com/data/warsh/Abdul_Basit_Murattal_192kbps/000_versebyverse.zip",
        // Fares_Abbad:
        //     "https://everyayah.com/data/Fares_Abbad_64kbps/000_versebyverse.zip",
        // Abdul_Basit_Mujawwad:
        //     "https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/000_versebyverse.zip",
        // Abdullah_Basfar:
        //     "https://everyayah.com/data/Abdullah_Basfar_192kbps/000_versebyverse.zip",
        // "Abdurrahmaan_As-Sudais":
        //     "https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/000_versebyverse.zip",
        // "Abu_Bakr_Ash-Shaatree":
        //     "https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_128kbps/000_versebyverse.zip",
        // Hani_Rifai:
        //     "https://everyayah.com/data/Hani_Rifai_192kbps/000_versebyverse.zip",
        // Hudhaify:
        //     "https://everyayah.com/data/Hudhaify_128kbps/000_versebyverse.zip",
        // Ghamadi:
        //     "https://everyayah.com/data/Ghamadi_40kbps/000_versebyverse.zip",
        // Husary: "https://everyayah.com/data/Husary_128kbps/000_versebyverse.zip",
        // Ibrahim_Akhdar:
        //     "https://everyayah.com/data/Ibrahim_Akhdar_32kbps/000_versebyverse.zip",
        // Karim_Mansoori:
        //     "https://everyayah.com/data/Karim_Mansoori_40kbps/000_versebyverse.zip",
        // Husary_Mujawwad:
        //     "https://everyayah.com/data/Husary_128kbps_Mujawwad/000_versebyverse.zip",
        // MaherAlMuaiqly:
        //     "https://everyayah.com/data/MaherAlMuaiqly128kbps/000_versebyverse.zip",
        // mahmoud_ali_al_banna:
        //     "https://everyayah.com/data/mahmoud_ali_al_banna_32kbps/000_versebyverse.zip",
        // Minshawy_Murattal:
        //     "https://everyayah.com/data/Minshawy_Murattal_128kbps/000_versebyverse.zip",
        // Mohammad_al_Tablaway:
        //     "https://everyayah.com/data/Mohammad_al_Tablaway_128kbps/000_versebyverse.zip",
        // Muhammad_AbdulKareem:
        //     "https://everyayah.com/data/Muhammad_AbdulKareem_128kbps/000_versebyverse.zip",
        // Muhammad_Ayyoub:
        //     "https://everyayah.com/data/Muhammad_Ayyoub_128kbps/000_versebyverse.zip",
        // Muhammad_Jibreel:
        //     "https://everyayah.com/data/Muhammad_Jibreel_128kbps/000_versebyverse.zip",
        // Muhsin_Al_Qasim:
        //     "https://everyayah.com/data/Muhsin_Al_Qasim_192kbps/000_versebyverse.zip",
        // Basfar_Walk:
        //     "https://everyayah.com/data/MultiLanguage/Basfar_Walk_192kbps/000_versebyverse.zip",
        // Nasser_Alqatami:
        //     "https://everyayah.com/data/Nasser_Alqatami_128kbps/000_versebyverse.zip",
        // Yaser_Salamah:
        //     "https://everyayah.com/data/Yaser_Salamah_128kbps/000_versebyverse.zip",
        // "Saood_ash-Shuraym":
        //     "https://everyayah.com/data/Saood_ash-Shuraym_128kbps/000_versebyverse.zip",
        // Sahl_Yassin:
        //     "https://everyayah.com/data/Sahl_Yassin_128kbps/000_versebyverse.zip",
        // AlAfasy:
        //     "https://everyayah.com/data/Alafasy_128kbps/000_versebyverse.zip",
    };
    // await downloadReciter(reciters, "Sahl_Yassin", reciters["Sahl_Yassin"]);
})();
