class Download{
    constructor(){
        this.link = document.createElement("a");
        this.blob = null;
    }

    getUrl(buffer, type){
        try{
            this.blob = new Blob(buffer,{type});
            return URL.createObjectURL(this.blob);
        }
        catch(err){
            console.error(err);
            return null;
        }
    }

    downloadFile(buffer, name, type, ext){
        this.link.href = this.getUrl(buffer, type);
        try{
            this.link.download = `${name}.${ext}`;
            this.link.click();
            URL.revokeObjectURL(this.link.href);
            return true;
        }
        catch(err){
            console.error(err);
            return false;
        }
    }
}

export const downloader = new Download();