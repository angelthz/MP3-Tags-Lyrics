export class Reader {
    constructor(){
        this.reader = new FileReader();
    }

    read(readAs, file){
        return new Promise((resolve, reject) => {
            switch(readAs){
                case "arrayBuffer" :
                    this.reader.readAsArrayBuffer(file);
                break;
                case "dataURL" :
                    this.reader.readAsDataURL(file);
                break;
                case "text" :
                    this.reader.readAsText(file);
                break;
            }

            this.reader.addEventListener("error", e=> {
                reject({error: true, result: "Error reading file"});
            });

            this.reader.addEventListener("loadend", e=> {
                resolve({
                    error: false,
                    result : this.reader.result
                })
            })
        });
    }

    asArrayBuffer(file){
        return this.read("arrayBuffer", file);
    }

    asDataURL(file){
        return this.read("dataURL", file);
    }

    asText(file){
        return this.read("text", file);
    }

}