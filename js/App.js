import {downloadAudio} from "./FileDownloader.js";
import {asyncAudioReader} from "./AudioReader.js";
import {asyncFetchLyrics} from "./FetchLyrics.js";
import Mp3TagReader from "./Mp3TagReader.js";
import {goTopBtn} from "./Utilities.js"


const uploaderContainer = document.getElementById("uploader-container");
const defaultInput = uploaderContainer.querySelector("#default-input");
const dragInput = uploaderContainer.querySelector("#drag-input");
const trackForm = document.getElementById("track-form");
const albumImg = document.getElementById("album-image");
const lyricsArea = document.getElementById("lyrics-textarea");
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


async function readAudioTags(file){
    location.hash = "";
    trackForm.reset();
    lyricsArea.textContent = "";
    document.getElementById("editor").classList.remove("visually-hidden");
    try{
        buffer = await asyncAudioReader(file);
        mp3Tags = new Mp3TagReader(buffer);
        buffer=null;
        trackForm.song.value = mp3Tags.getSongTitle();
        trackForm.album.value = mp3Tags.getAlbum();
        trackForm.artist.value = mp3Tags.getArtist();
        albumImg.src = mp3Tags.getAlbumImage() || "assets/defaul-album.png";        
        console.log(mp3Tags)

    }catch(err){
        console.log(err)
    }
}


//change default input
defaultInput.addEventListener("change", e=> {
    e.preventDefault();
    readAudioTags(e.target.files[0]);
})

//drag and drop input
dragInput.addEventListener("dragover", e=> {
    e.preventDefault();
    uploaderContainer.classList.add("drag-over");
})

dragInput.addEventListener("dragleave", e=> {
    e.preventDefault();
    uploaderContainer.classList.remove("drag-over");
})

dragInput.addEventListener("drop", e=> {
    e.preventDefault();
    uploaderContainer.classList.remove("drag-over");
    readAudioTags(e.dataTransfer.files[0]);
})

document.addEventListener("submit", async e=> {
    e.preventDefault();
    if(!e.target.matches("#track-form")) return false;
    //send a request to fetch lyrics
    document.querySelector("#lyrics-loader").classList.toggle("visually-hidden");
    lyrics = await asyncFetchLyrics({
        song: trackForm.song.value,
        album: trackForm.album.value,
        artist: trackForm.artist.value
    });
    document.querySelector("#lyrics-loader").classList.toggle("visually-hidden");
    console.log(lyrics)
    lyricsArea.textContent = lyrics ? (lyrics.syncedLyrics || lyrics.plainLyrics) : "Lyrics Not Found";
})


document.addEventListener("click", e=>{
    if(!e.target.matches("#btn-download")) return false;
    //save changes and download file
    mp3Tags.setTitle(trackForm.song.value);
    mp3Tags.setAlbum(trackForm.album.value);
    mp3Tags.setArtist(trackForm.artist.value);
    mp3Tags.setLyrics(lyricsArea.textContent);
    console.log(mp3Tags);
    downloadAudio(mp3Tags.getAudioArray());
})
