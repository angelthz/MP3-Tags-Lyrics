export default function generateAlbumImage(buffer){
    let imgUint8Array = new Uint8Array(buffer);
    let blob = new Blob([imgUint8Array], {type: "image/*"});
    let imgURL = URL.createObjectURL(blob);
    return imgURL;
}