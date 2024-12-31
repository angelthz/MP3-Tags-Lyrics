import { downloader } from "./helpers/FileDownloader.js";
import { Time } from "./helpers/Time.js";
import { LyricRow } from "./components/LyricRow.js";
import { LYRIC_RGX, TIME_STAPM_RGX } from "./consts/RegexExp.js";
import { Queue } from "./helpers/Queue.js";

const audio = document.getElementById("song-player");
const current = document.querySelector(".current");
const duration = document.querySelector(".duration");
const progress = document.querySelector(".progress-audio");
let lyricsStorage = []
const lyricQueue = Queue();
let runningTest = false;


export function intializeSyncTool(buffer, lyricString) {
    let lyricTable = document.getElementById("lyric-table");
    // let lyrics = lyric.split("\n").filter(line => line !== "");
    let lyrics = lyricString.split("\n");
    let rows = "";
    lyricsStorage = [];
    lyrics.forEach((lyricLine, idx) => {
        let lyric = lyricLine.match(LYRIC_RGX) ? lyricLine.match(LYRIC_RGX)[0] : lyricLine;
        let tms = lyricLine.match(TIME_STAPM_RGX) ? lyricLine.match(TIME_STAPM_RGX)[0] : `00:00.00`;
        lyricsStorage.push({ idx, lyric, tms: Time.parse(tms) });
        rows += LyricRow({ idx, lyric, tms });
        console.log(tms)
    });
    audio.src = downloader.getUrl(buffer);
    progress.value = 0;
    lyricTable.insertAdjacentHTML("afterbegin", rows);
    console.log(lyricsStorage)
};


function runLyricTest() {
    let current = audio.currentTime;
    let query = lyricsStorage.find(el => current >= (el.tms - 0.2) && current <= (el.tms + 0.2));
    if (query) {
        if (!lyricQueue.isEmpty()) {
            lyricQueue.front().row.classList.remove("active");
            lyricQueue.clear();
            let top = document.querySelector(".modal-body").scrollTop;
            document.querySelector(".modal-body").scrollTop = top + 20;
        }
        document.querySelector(`.lyric-row[data-idx="${query.idx}"]`).classList.add("active");

        lyricQueue.add({
            query,
            row: document.querySelector(`.lyric-row[data-idx="${query.idx}"]`)
        });
    }
}

function saveLyrics() {
    let lrc = lyricsStorage.reduce((prev, curr) => prev + `${Time.format(curr.tms)} ${curr.lyric}\n`, "");
}

function resetPlayer() {
    resumeButton()
    audio.currentTime = 0;
}

function playButton(e = null) {
    document.querySelector(".play-btn").classList.add("visually-hidden");
    document.querySelector(".resume-btn").classList.remove("visually-hidden");
    console.log("play");
    audio.play();
}

function resumeButton(e = null) {
    document.querySelector(".resume-btn").classList.add("visually-hidden");
    document.querySelector(".play-btn").classList.remove("visually-hidden");
    console.log("resume");
    audio.pause();
}

function resetLyricTable() {
    document.querySelector(".modal-body").scrollTop = 0;
    document.querySelectorAll(".lyric-row").forEach(el => el.classList.remove("active"));
}

export default (() => {
    console.log("running Sync Setup");

    audio.addEventListener("loadedmetadata", e => {
        progress.setAttribute("max", audio.duration);
        duration.textContent = `${Time.parseMm(audio.duration)}:${Time.parseSs(audio.duration)}`;
    });

    audio.addEventListener("timeupdate", e => {
        current.textContent = `${Time.parseMm(audio.currentTime)}:${Time.parseSs(audio.currentTime)}`;
        progress.value = audio.currentTime;
        console.log(Math.floor(audio.currentTime))
        if (runningTest)
            runLyricTest();
    });

    progress.addEventListener("input", e => {
        audio.currentTime = e.target.value;
    })

    document.addEventListener("click", e => {
        if (e.target.matches(".play-btn")) {
            playButton(e);
        }

        if (e.target.matches(".resume-btn")) {
            resumeButton(e);
        }

        if (e.target.matches(".backward-btn")) {
            console.log("backward")
            audio.currentTime = audio.currentTime - 5;
        }

        if (e.target.matches(".forward-btn")) {
            console.log("forward")
            audio.currentTime = audio.currentTime + 5;
        }


        //add new timestamp
        if (e.target.matches(".add-col")) {
            let time = audio.currentTime;
            let idx = Number.parseInt(e.target.dataset.idx);
            e.target.parentElement.classList.add("active");
            e.target.parentElement.querySelector(".time-col").textContent = Time.format(time);
            lyricsStorage[idx].tms = time;
            console.log("added timestamp", lyricsStorage[idx])
        }

        //reset selected row timestap to 0
        if (e.target.matches(".remove-col")) {
            let idx = Number.parseInt(e.target.dataset.idx);
            e.target.parentElement.classList.remove("active");
            lyricsStorage[idx].tms = 0;
            console.log("removed timestamp")
        }
        /* runs lyric test */
        if (e.target.matches("#btn-test-modal")) {
            if (e.target.dataset.running === "false") {
                runningTest = true;
                resetLyricTable();
                resetPlayer();
                playButton(e);
                e.target.dataset.running = "true";
                e.target.textContent = "Stop Test";
            }
            else {
                runningTest = false;
                resumeButton(e);
                e.target.dataset.running = "false";
                e.target.textContent = "Run Test";
            }
        }

        //update textarea lyrics
        if (e.target.matches("#btn-close-modal")) {
            runningTest = false;
            resetLyricTable();
            resetPlayer();
            // console.log(lyricsStorage)
            let lrc = "";
            lyricsStorage.forEach((lyric,idx)=>{
                if(idx === lyricsStorage.length-1)
                    lrc += `${Time.format(lyric.tms)} ${lyric.lyric}`;
                else
                    lrc += `${Time.format(lyric.tms)} ${lyric.lyric}\n`;
            })
            // document.querySelector("#lyrics-textarea").value = "";
            // document.querySelector("#lyrics-textarea").value = lyricsStorage.reduce((prev, curr) => prev + `${Time.format(curr.tms)} ${curr.lyric}`, "");
            document.querySelector("#lyrics-textarea").value = lrc;
            // console.log(lrc)
        }
    })

})();



