export function downloadAudio(file){
    let {fileName, fileArray} = file;
    let link = document.createElement("a");
    let blob = new Blob([fileArray],{type: "audio/*"});
    let url = URL.createObjectURL(blob);
    link.download = `${fileName}.mp3`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(link.href);
}