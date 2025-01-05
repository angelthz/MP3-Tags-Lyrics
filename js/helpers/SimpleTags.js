import { JPEG_IMG } from "../consts/MIME_Types.js";
import { downloader } from "./FileDownloader.js";


export class SimpleTags extends MP3Tag{
    constructor(buffer){
        super(buffer, false);
        if (this.error !== '') throw new Error(this.error);
        this.read();
    }

    getSimpleTags(){
       return{
            artist : this.getArtist(),
            album : this.getAlbum(),
            title : this.getTitle(),
            lyrics : this.getLyrics(),
            number: this.getTrackNumber(),
            genre : this.getGenre(),
            year : this.getReleaseYear(),
            cover : this.getCoverArt()
       }
    }

    //GETTERS

    getArtist(){
        return this.tags.v2.TPE1;
    }

    getAlbum(){
        return this.tags.v2.TALB;
    }

    getTitle(){
        return this.tags.v2.TIT2;
    }

    getTrackNumber(){
        return this.tags.v2.TRCK;
    }

    getGenre(){
        return this.tags.v2.TCON;
    }

    getLyrics(){
        return this.tags.v2.USLT;
    }
    
    getReleaseYear(){
        return this.tags.v2.TYER;
    }
    
    //returns a image url
    getCoverArt(){
        if (!this.tags.v2.hasOwnProperty("APIC")) return null;
        let imgUint8Array = new Uint8Array(this.tags.v2.APIC[0].data);
        return downloader.getUrl([imgUint8Array], JPEG_IMG);
    }

    //SETTERS
    
    setTags({artist,album,song,number,genre, year, lyrics}){
        this.setArtist(artist);
        this.setAlbum(album)
        this.setTitle(song);
        this.setTrackNumber(number);
        this.setGenre(genre);
        this.setReleaseYear(year);
        this.setLyrics(lyrics);
        super.save();
    }

    setArtist(artist){
        this.tags.v2.TPE1 = artist || "";
    }

    setAlbum(album){
        this.tags.v2.TALB = album || "";
    }

    setTitle(song){
        this.tags.v2.TIT2 = song || "";
    }

    setTrackNumber(number){
        this.tags.v2.TRCK = number || "";
    }

    setGenre(genre){
        this.tags.v2.TCON = genre || "";
    }
    
    setReleaseYear(year){
        this.tags.v2.TYER = year || "";
    }

    setLyrics(lyrics){
        this.tags.v2.USLT = [
            {
                language: "",
                descriptor: "Lyric Me/LRCLIB",
                text : lyrics || ""
            }
        ];
    }

    setCoverArt(buffer){

    }

    //special methods
    getBuffer(){
        return [this.buffer];
    }
}