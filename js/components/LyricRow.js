import { Time } from "../helpers/Time.js";

export function LyricRow({idx, lyric, tms}) {
    return (`
    <div class="lyric-row row fs-6 align-items-center" data-status="inactive" data-idx="${idx}">
        <span class="time-col col-2 text-center">${Time.format(tms)}</span>
        <span class="lyric-col col-8 ">${lyric}</span>
        <div class="remove-col btn-col col-1 h-100 d-flex justify-content-center align-items-center" data-idx="${idx}" data-lyric="${lyric}" data-tms="${tms}">
            <svg class="ignore-events" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="M200-440v-80h560v80H200Z"></path>
            </svg>
        </div>
        <div class="add-col btn-col col-1 h-100  d-flex justify-content-center align-items-center" data-idx="${idx}" data-lyric="${lyric}" data-tms="${tms}">
            <svg class="ignore-events d-block mx-auto" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"></path>
            </svg>
        </div>
    </div>    
    `);
}