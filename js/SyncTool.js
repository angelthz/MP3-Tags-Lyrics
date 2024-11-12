import { downloader } from "./FileDownloader.js";

const audio = document.getElementById("song-player");
const current = document.querySelector(".current");
const duration = document.querySelector(".duration");
const progress = document.querySelector(".progress-audio");
const lyricsMap = new Map();

function getTime(time){
    let mm = Math.floor(time/60);
    let ss = Math.floor(time%60);
    let cs = Number.parseFloat(time%1).toFixed(2);

    return {
        mm : mm<10 ?`0${mm}` : `${mm}`,
        ss : ss<10 ?`0${ss}` : `${ss}`,
        cs : cs.replace(/0+\./,"")
    };
}

export function SyncLyrics(buffer,lyric){
    console.log(lyric)
    let template = document.getElementById("lyric-row-template").content;
    let fragment = document.createDocumentFragment();
    let lyricTable = document.getElementById("lyric-table");
    let lyricArray = lyric.split("\n").filter(line=> line!=="");

    lyricArray.forEach((lyricLine,idx)=> {
        template.querySelector(".time-col").textContent = `[00:00:00]`;
        template.querySelector(".lyric-col").textContent = `${lyricLine}`;
        template.querySelector(".remove-col").dataset.idx = `${idx}`;
        template.querySelector(".add-col").dataset.idx = `${idx}`;
        template.querySelector(".add-col").dataset.lyric = `${lyricLine}`;
        fragment.appendChild(document.importNode(template,"true"));
        lyricsMap.set(`${idx}`,null);
    });
    audio.src = downloader.getUrl(buffer);
    progress.value = 0;
    lyricTable.appendChild(fragment);
};

export function ClearLyrics(){
    document.getElementById("lyric-table").innerHTML = "";
}

export default (()=>{
    console.log("running Sync Setup");

    audio.addEventListener("loadedmetadata",e=>{
        let time = getTime(audio.duration);
        progress.setAttribute("max",Math.floor(audio.duration));
        duration.textContent = `${time.mm}:${time.ss}`;
    });

    audio.addEventListener("timeupdate", e=>{
        let time = getTime(audio.currentTime);
        current.textContent = `${time.mm}:${time.ss}`;
        progress.value=Math.floor(audio.currentTime);
    });

    progress.addEventListener("input",e => {
        audio.currentTime = e.target.value;
    })

    document.addEventListener("click",e=>{  
        if(e.target.matches(".play-btn")){
            e.target.classList.add("visually-hidden")
            document.querySelector(".resume-btn").classList.remove("visually-hidden");
            console.log("play");
            audio.play();
        }

        if(e.target.matches(".resume-btn")){
            e.target.classList.add("visually-hidden")
            document.querySelector(".play-btn").classList.remove("visually-hidden");
            console.log("resume");
            audio.pause();
        }

        if(e.target.matches(".backward-btn")){
            console.log("backward")
            audio.currentTime = audio.currentTime - 5;
        }

        if(e.target.matches(".forward-btn")){
            console.log("forward")
            audio.currentTime = audio.currentTime + 5;
        }

        if(e.target.matches(".add-col")){
            let time = getTime(audio.currentTime);
            let formatedTime = `[${time.mm}:${time.ss}:${time.cs}]`;
            e.target.parentElement.classList.add("active");
            e.target.parentElement.querySelector(".time-col").textContent = formatedTime;
            lyricsMap.set(
                e.target.dataset.idx,
                {timeStamp:formatedTime, lyric:e.target.dataset.lyric}
            );
            console.log("add")
        }

        if(e.target.matches(".remove-col")){
            e.target.parentElement.classList.remove("active");
            lyricsMap.set(e.target.dataset.idx,null);
            console.log("removed")
        }
    })
    
})();



