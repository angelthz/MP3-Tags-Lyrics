export async function asyncFetchLyrics(songInfo){
    try{
        let songQuery = `track_name=${songInfo.song.replaceAll(" ","+")}`;
        let albumQuery = `album_name=${songInfo.album.replaceAll(" ","+")}`; 
        let artistQuery = `artist_name=${songInfo.artist.replaceAll(" ","+")}`;
        let endpoint = "https://lrclib.net/api/get?";
        let endpointRequest = `${endpoint}&${artistQuery}&${songQuery}&${albumQuery}`;
        let res = await fetch(endpointRequest);
        let songJson = await res.json();
        if(!res.ok) throw new Error(res);
        return songJson;
    }
    catch(err){
        console.log(err);
        return null;
    }
}