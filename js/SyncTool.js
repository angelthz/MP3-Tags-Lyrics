import { downloader } from "./helpers/FileDownloader.js";
import { Time } from "./helpers/Time.js";
import { LyricRow } from "./components/LyricRow.js";
import { LYRIC_RGX, TIME_STAPM_RGX } from "./consts/RegexExp.js";
import { Queue } from "./helpers/Queue.js";

const currentEl = document.querySelector(".current");
const durationEl = document.querySelector(".duration");
const progressEl = document.querySelector(".progress-audio");
const volumeBar = document.getElementById("volume-bar");
const lyricsStorage = []
const lyricQueue = Queue();
//player elements
const playBtn  = document.getElementById("play-btn");
const resumeBtn = document.getElementById("resume-btn");
const backwardBtn  = document.getElementById("backward-btn");
const forwardBtn  = document.getElementById("forward-btn");
const muteBtn = document.getElementById("mute-btn");
const unmuteBtn = document.getElementById("unmute-btn");
let runningTest = false;
//
const track = new Audio();

function runLyricTest() {
    let current = track.currentTime;
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

function playButton() {
    playBtn.classList.add("visually-hidden");
    resumeBtn.classList.remove("visually-hidden");
    track.play();
}

function resumeButton(){
    resetPlayButton();
    track.pause();
}

function resetPlayButton(){
    playBtn.classList.remove("visually-hidden");
    resumeBtn.classList.add("visually-hidden");
}

function muteButton(){
    muteBtn.classList.add("visually-hidden");
    unmuteBtn.classList.remove("visually-hidden");
}

function unmuteButton(){
    muteBtn.classList.remove("visually-hidden");
    unmuteBtn.classList.add("visually-hidden");
}

function clearLyricTable() {
    document.querySelector(".modal-body").scrollTop = 0;
    document.getElementById("lyric-table").innerHTML = "";
}

function resetLyricTable() {
    document.querySelector(".modal-body").scrollTop = 0;
    document.querySelectorAll(".lyric-row").forEach(el => el.classList.remove("active"));
}

function resetTest() {
    runningTest = false;
    document.getElementById("btn-test-modal").dataset.running = "false";
    document.getElementById("btn-test-modal").textContent = "Run Test";
}

function resetPlayer() {
    resumeButton();
    track.currentTime = 0;
}

function modalClosed() {
    resetTest();
    resetPlayer();
    clearLyricTable();
}

function saveLyrics() {
    let lrc = "";
    lyricsStorage.forEach((lyric, idx) => {
        if (idx === lyricsStorage.length - 1)
            lrc += `${Time.format(lyric.tms)} ${lyric.lyric}`;
        else
            lrc += `${Time.format(lyric.tms)} ${lyric.lyric}\n`;
    })
    document.querySelector("#lyrics-textarea").value = lrc;
}

export default (() => {
    track.addEventListener("loadedmetadata", e => {
        progressEl.max = Math.round(track.duration);
        volumeBar.style.background = `linear-gradient(to right, var(--range-color) ${volumeBar.value}%, var(--range-bg) ${volumeBar.value}%)`;
        durationEl.textContent = `${Time.parseMm(track.duration)}:${Time.parseSs(track.duration)}`;
    });

    track.addEventListener("timeupdate", e => {
        progressEl.value = track.currentTime;
        let progressPercent = ( (progressEl.value * 100 ) / progressEl.max );
        currentEl.textContent = `${Time.parseMm(track.currentTime)}:${Time.parseSs(track.currentTime)}`;
        progressEl.style.background = `linear-gradient(to right, var(--range-color) ${progressPercent}%, var(--range-bg) ${progressPercent}%)`;
        if (runningTest)
            runLyricTest();
    });

    track.addEventListener("volumechange", e=> {
        if(track.volume > 0)
            unmuteButton();
        else if(track.volume == 0)
            muteButton();
        volumeBar.style.background = `linear-gradient(to right, var(--range-color) ${Math.round(track.volume*100)}%, var(--range-bg) ${Math.round(track.volume*100)}%)`;
        console.log(track.volume*100)
    });

    track.addEventListener("ended", resetPlayButton);

    progressEl.addEventListener("input", e => {
        track.currentTime = e.target.value;
    });

    volumeBar.addEventListener("input", () => track.volume = volumeBar.value / 100);
    
    muteBtn.addEventListener("click",()=> track.volume = 0);
    
    unmuteBtn.addEventListener("click",()=> track.volume = 1);

    playBtn.addEventListener("click", playButton);

    resumeBtn.addEventListener("click", resumeButton);

    backwardBtn.addEventListener("click", () => track.currentTime = track.currentTime - 5);

    forwardBtn.addEventListener("click", () => track.currentTime = track.currentTime + 5);

    document.addEventListener("click", e => {

        //add new timestamp to the current row and saves it in lyricstorage
        if (e.target.matches(".add-col")) {
            let time = track.currentTime;
            let idx = Number.parseInt(e.target.dataset.idx);
            e.target.parentElement.classList.add("active");
            e.target.parentElement.querySelector(".time-col").textContent = Time.format(time);
            lyricsStorage[idx].tms = time;
            lyricsStorage[idx].marked = true;
            document.getElementById("btn-test-modal").disabled = !lyricsStorage.every(el => el.marked);
        }

        //reset selected row timestap to 0
        if (e.target.matches(".remove-col")) {
            let idx = Number.parseInt(e.target.dataset.idx);
            e.target.parentElement.classList.remove("active");
            lyricsStorage[idx].tms = 0;
            lyricsStorage[idx].marked = false;
            document.getElementById("btn-test-modal").disabled = !lyricsStorage.every(el => el.marked);
        }
        /* runs lyric test */
        if (e.target.matches("#btn-test-modal")) {
            if (e.target.dataset.running === "false") {
                runningTest = true;
                resetLyricTable();
                resetPlayer();
                playButton();
                e.target.dataset.running = "true";
                e.target.textContent = "Stop Test";
            }
            else {
                runningTest = false;
                resetLyricTable();
                resetPlayer();
                e.target.dataset.running = "false";
                e.target.textContent = "Test Lyrics";
            }
        }
        if (e.target.matches("#close-modal-icon")) {
            modalClosed();
        }

        //update textarea lyrics
        if (e.target.matches("#btn-close-modal")) {
            saveLyrics();
            modalClosed();
        }
    })

})();


export function intializeSyncTool(buffer, lyricString) {
    //element to append new rows
    let lyricTable = document.getElementById("lyric-table");
    //split the lyricString into array
    let lyrics = lyricString.split("\n");
    //save the rows html content
    let rows = "";

    //reset the lyricsStorage
    while(lyricsStorage.length>0){lyricsStorage.pop()}

    //fill the lyricsStorage with an object with lyric stats
    lyrics.forEach((lyricLine, idx) => {
        let lyric = lyricLine.match(LYRIC_RGX) ? lyricLine.match(LYRIC_RGX)[0] : lyricLine;
        let tms = lyricLine.match(TIME_STAPM_RGX) ? lyricLine.match(TIME_STAPM_RGX)[0] : `00:00.00`;
        let marked = TIME_STAPM_RGX.test(lyricLine);
        lyricsStorage.push({ idx, lyric, tms: Time.parse(tms), marked });
    });
    
    //filter the lyricstorage to remove the last elements if lyric prop is a blank spaces
    while(lyricsStorage[lyricsStorage.length-1].lyric === ""){
        // console.log("removed: ", lyricsStorage.pop() );
        lyricsStorage.pop();
    }
    //then render the lyric rows
    lyricsStorage.forEach(lyricRow => rows += LyricRow(lyricRow));
    
    //set the buufer as track src
    track.src = downloader.getUrl(buffer);
    track.currentTime = 0;
    lyricTable.insertAdjacentHTML("afterbegin", rows);
    //if rows has not a timestamp block user to run test
    document.getElementById("btn-test-modal").disabled = !lyricsStorage.every(el => el.marked);
};