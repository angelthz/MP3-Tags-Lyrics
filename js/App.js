import { downloader } from "./helpers/FileDownloader.js";
import { asyncFetchLyrics } from "./helpers/FetchLyrics.js";
import { goTopBtn } from "./helpers/Utilities.js"
import { MP3_AUDIO } from "./consts/MIME_Types.js";
import { intializeSyncTool } from "./SyncTool.js";
import { SimpleTags } from "./helpers/SimpleTags.js";
import {Reader} from './helpers/ReadFiles.js';

//DOM vars
const uploaderForm = document.getElementById("uploader");
const trackForm = document.getElementById("track-form");
const albumImg = document.getElementById("album-image");
const lyricsArea = document.getElementById("lyrics-textarea");
const downloadBtn = document.getElementById("btn-download");
const syncBtn = document.getElementById("btn-sync-tool");
const syncModal = document.querySelector(".sync-modal");
//app vars
//store a mp3Tags object
let mp3 = null;
//event dispatcher to trigger the syncBtn
const textAreaChange = new Event("tchange");

/* 
    
*/
const readMp3File = async (file) => {
    let readFiles = new Reader();
    try{
        let res = await readFiles.asArrayBuffer(file);
        if(res.error) throw new Error(res);
        return new SimpleTags(res.result);
    }
    catch(error){
        console.log(error);
        return null;
    }
}

const initUiComponets = (mp3) => {
    document.getElementById("editor").classList.remove("visually-hidden");
    trackForm.song.value = mp3.getTitle();
    trackForm.album.value = mp3.getAlbum();
    trackForm.artist.value = mp3.getArtist();
    albumImg.src = mp3.getCoverArt() || "assets/default-album.png";
    location.hash = "editor";
    document.getElementById("upload-loader").classList.add("visually-hidden");
};

//clear inputs
const clearInputs = ()=>{
    location.hash = "";
    trackForm.song.value = "";
    trackForm.album.value = "";
    trackForm.artist.value = "";
    lyricsArea.value = "";
    syncBtn.disabled = true;
}

//change default input
uploaderForm.addEventListener("change", async e => {
    e.preventDefault();
    clearInputs();
    mp3 = await readMp3File(e.target.files[0]);
    initUiComponets(mp3);
})

//drag and drop input
uploaderForm.addEventListener("dragover", e => {
    e.preventDefault();
    uploaderForm.classList.add("drag-over");
})

uploaderForm.addEventListener("dragleave", e => {
    e.preventDefault();
    uploaderForm.classList.remove("drag-over");
})

uploaderForm.addEventListener("drop", async e => {
    e.preventDefault();
    clearInputs();
    uploaderForm.classList.remove("drag-over");
    mp3 = await readMp3File(e.dataTransfer.files[0]);
    initUiComponets(mp3);
})

trackForm.addEventListener("submit", async e => {
    e.preventDefault();
    //send a request to fetch lyrics
    document.querySelector("#lyrics-loader").classList.toggle("visually-hidden");
    let lyrics = await asyncFetchLyrics(trackForm.song.value, trackForm.album.value, trackForm.artist.value);
    document.querySelector("#lyrics-loader").classList.toggle("visually-hidden");
    lyricsArea.value = lyrics ? (lyrics.syncedLyrics || lyrics.plainLyrics) : "Lyrics Not Found";
    lyricsArea.dispatchEvent(textAreaChange);
})

//enables the syncBtn if there is a valid content in lyrics textarea
lyricsArea.addEventListener("tchange", e => {
    if( (lyricsArea.value !== "" && lyricsArea.value !== "Lyrics Not Found") )
        syncBtn.disabled = false;
    else
        syncBtn.disabled = true;
}, false);


lyricsArea.addEventListener("input",e=>{
    lyricsArea.dispatchEvent(textAreaChange);
})

document.addEventListener("click", e => {
    if (e.target === downloadBtn) {
        //save changes and download file
        mp3.setTitle(trackForm.song.value);
        mp3.setAlbum(trackForm.album.value);
        mp3.setArtist(trackForm.artist.value);
        mp3.setLyrics(lyricsArea.value);
        mp3.save();
        downloader.downloadFile(mp3.getBuffer(), mp3.getTitle(), MP3_AUDIO, "mp3");
    }

    if (e.target === syncBtn) {
        intializeSyncTool(mp3.getBuffer(), lyricsArea.value);
    }
})

document.addEventListener("DOMContentLoaded", e => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    const downloadBtn = document.getElementById("btn-download");
    goTopBtn(downloadBtn);
});