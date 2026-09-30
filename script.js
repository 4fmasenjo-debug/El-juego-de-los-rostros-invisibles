
console.log("SCRIPT.JS CARGADO");
console.log("window.faceapi =", window.faceapi);
console.log("typeof faceapi =", typeof faceapi);

if (typeof faceapi === "undefined") {
    console.error("FACE-API NO ESTA DISPONIBLE");
} else {
    console.log("FACE-API CARGADO CORRECTAMENTE");
}

