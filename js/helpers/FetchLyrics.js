export async function asyncFetchLyrics(song, album, artist){
    try{
        let songQuery = `track_name=${song.replaceAll(" ","+")}`;
        let albumQuery = `album_name=${album.replaceAll(" ","+")}`; 
        let artistQuery = `artist_name=${artist.replaceAll(" ","+")}`;
        let endpoint = "https://lrclib.net/api/get?";
        let endpointRequest = `${endpoint}&${artistQuery}&${songQuery}&${albumQuery}`;
        let res = await fetch(endpointRequest);
        let songJson = await res.json();
        if(!res.ok) throw new Error(res);
        return songJson;
    }
    catch(err){
        console.error(err);
        return null;
    }
} 