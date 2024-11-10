import {downloader} from "./FileDownloader.js"
import { JPEG_IMG } from "./MIME_Types.js";

export default class Mp3TagReader {
    constructor(buffer) {
        this.mp3Tag = new MP3Tag(buffer, true);
        this.read();
    }
    //getters
    getArtist() {
        return this.mp3Tag.tags.v2.TPE2;
    }

    getAlbum() {
        return this.mp3Tag.tags.v2.TALB;
    }

    getSongTitle() {
        return this.mp3Tag.tags.v2.TIT2;
    }

    getSongNum() {
        return this.mp3Tag.tags.v2.TRCK;
    }

    hasLyrics() {
        return this.mp3Tag.tags.v2.hasOwnProperty("USLT") ? true : false;
    }

    getLyrics() {
        return this.mp3Tag.tags.v2.USLT;
    }

    
    getSimplifiedTags() {
        return {
            songTitle: this.getSongTitle(),
            artist: this.getArtist(),
            album: this.getAlbum(),
            lyrics: this.getLyrics()
        }
    }

    getBasicTags(){
        return{
            song: this.getSongTitle(),
            album: this.getAlbum(),
            artist: this.getArtist()
        }
    }
    
    getCompleteTags() {
        return this.mp3Tag.tags.v2;
    }

    getAlbumImage(){
        if(!this.getCompleteTags().hasOwnProperty("APIC")) return null;
        let imgUint8Array = new Uint8Array(this.getCompleteTags().APIC[0].data);
        return downloader.getUrl(imgUint8Array, JPEG_IMG);
    }
    
    read() {
        if(this.mp3Tag.error != "") throw new Error(this.mp3Tag.error);
        this.mp3Tag.read();
    }
    //setters
    setArtist(artist) {
        this.mp3Tag.tags.v2.TPE2 = artist;
    }

    setAlbum(album) {
        this.mp3Tag.tags.v2.TALB = album;
    }

    setTitle(songTitle) {
        this.mp3Tag.tags.v2.TIT2 = songTitle;
    }

    setLyrics(text) {
        this.mp3Tag.tags.v2.USLT = [
            {
                language : "DEF",
                descriptor : "Lyric Me/LRCLIB",
                text 
            }
        ];
    }

    save() {
        if(this.mp3Tag.error != "") throw new Error(this.mp3Tag.error);
        console.log("saving file")
        this.mp3Tag.save();
    }

    getAudioArray(){
        this.save();
        return this.mp3Tag.buffer;
    }
}