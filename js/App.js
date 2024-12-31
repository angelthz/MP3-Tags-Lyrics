import { downloader } from "./helpers/FileDownloader.js";
import { asyncAudioReader } from "./helpers/AudioReader.js";
import { asyncFetchLyrics } from "./helpers/FetchLyrics.js";
import Mp3TagReader from "./helpers/Mp3TagReader.js";
import { goTopBtn } from "./components/Utilities.js"
import { DEFAULT_ALBUM_IMG } from "./consts/Assets.js";
import { MP3_AUDIO } from "./consts/MIME_Types.js";
import SyncTool, { intializeSyncTool } from "./SyncTool.js";


const uploaderContainer = document.getElementById("uploader-container");
const defaultInput = uploaderContainer.querySelector("#default-input");
const dragInput = uploaderContainer.querySelector("#drag-input");
const trackForm = document.getElementById("track-form");
const albumImg = document.getElementById("album-image");
const lyricsArea = document.getElementById("lyrics-textarea");
const syncModal = document.querySelector(".sync-modal");
let track = null;
let buffer = null;
let mp3Tags = null;
let lyrics = "";


document.addEventListener("DOMContentLoaded", e => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    const downloadBtn = document.getElementById("btn-download");
    goTopBtn(downloadBtn);
});


async function readAudioTags(file) {
    location.hash = "";
    trackForm.reset();
    lyricsArea.textContent = "";
    document.getElementById("editor").classList.remove("visually-hidden");
    try {
        document.getElementById("upload-loader").classList.toggle("visually-hidden");
        buffer = await asyncAudioReader(file);
        mp3Tags = new Mp3TagReader(buffer);
        buffer = null;
        trackForm.song.value = mp3Tags.getSongTitle();
        trackForm.album.value = mp3Tags.getAlbum();
        trackForm.artist.value = mp3Tags.getArtist();
        albumImg.src = mp3Tags.getAlbumImage() || DEFAULT_ALBUM_IMG;
        
        document.getElementById("upload-loader").classList.toggle("visually-hidden");

    } catch (err) {
        console.error(err)
    }
}

//clear inputs
const clearInputs = ()=>{
    trackForm.song.value = "";
    trackForm.album.value = "";
    trackForm.artist.value = "";
    lyricsArea.value = "";
}


//change default input
defaultInput.addEventListener("change", e => {
    e.preventDefault();
    clearInputs();
    
    readAudioTags(e.target.files[0]);
    e.target.files = null;
})

//drag and drop input
dragInput.addEventListener("dragover", e => {
    e.preventDefault();
    uploaderContainer.classList.add("drag-over");
})

dragInput.addEventListener("dragleave", e => {
    e.preventDefault();
    uploaderContainer.classList.remove("drag-over");
})

dragInput.addEventListener("drop", e => {
    e.preventDefault();
    clearInputs();
    uploaderContainer.classList.remove("drag-over");
    readAudioTags(e.dataTransfer.files[0]);
    e.dataTransfer.files = null;
})

document.addEventListener("submit", async e => {
    e.preventDefault();
    if (!e.target.matches("#track-form")) return false;
    //send a request to fetch lyrics
    document.querySelector("#lyrics-loader").classList.toggle("visually-hidden");
    lyrics = await asyncFetchLyrics({
        song: trackForm.song.value,
        album: trackForm.album.value,
        artist: trackForm.artist.value
    });
    document.querySelector("#lyrics-loader").classList.toggle("visually-hidden");
    
    lyricsArea.value = lyrics ? (lyrics.syncedLyrics || lyrics.plainLyrics) : "Lyrics Not Found";
    document.getElementById("btn-sync-tool").disabled = false;
})


lyricsArea.addEventListener("input",e=>{
    
    document.getElementById("btn-sync-tool").disabled = false;
})

document.addEventListener("click", e => {
    if (e.target.matches("#btn-download")) {
        //save changes and download file
        mp3Tags.setTitle(trackForm.song.value);
        mp3Tags.setAlbum(trackForm.album.value);
        mp3Tags.setArtist(trackForm.artist.value);
        mp3Tags.setLyrics(lyricsArea.value);
        ;
        downloader.downloadFile(mp3Tags.getAudioArray(), mp3Tags.getSongTitle(), ".mp3", MP3_AUDIO);
    }

    if (e.target.matches("#btn-sync-tool")) {
        intializeSyncTool(mp3Tags.getAudioArray(), lyricsArea.value);
    }
})