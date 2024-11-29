let fileReader = new FileReader();

export function asyncAudioReader(file){
    return new Promise(function(resolve, reject){
        fileReader.readAsArrayBuffer(file);

        // fileReader.onloadend = ()=> resolve(fileReader);
        fileReader.addEventListener("loadstart", e=>{
            console.log("starting")
            // document.querySelector(".upload-loader").classList.remove("visually-hidden");
            // location.hash =  "";
        });

        fileReader.addEventListener("error",e=>{
            reject(null);
        })

        fileReader.addEventListener("progress", e=> {
            console.log("reading")
            
        });
        fileReader.addEventListener("loadend", e => {
            // document.querySelector(".upload-loader").classList.add("visually-hidden");
            location.hash = "editor";
            resolve(fileReader.result) 
        });
    });
}