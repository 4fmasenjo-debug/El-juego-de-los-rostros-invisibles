console.log("PRUEBA DE DETECCIÓN FACIAL");


// ============================================================
// ELEMENTOS
// ============================================================

const video = document.getElementById("video");

const overlay = document.getElementById(
    "overlay-elements"
);


// ============================================================
// COMPROBAR FACE-API
// ============================================================

if (typeof faceapi === "undefined") {

    console.error(
        "face-api.js NO está cargado."
    );

} else {

    console.log(
        "face-api.js cargado correctamente."
    );

}


// ============================================================
// VARIABLES
// ============================================================

let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;

let imagesCreated = false;

let detectando = false;


// ============================================================
// CARGAR MODELO
// ============================================================

async function iniciar() {

    try {

        console.log(
            "Cargando modelo..."
        );


        await faceapi.nets.tinyFaceDetector.loadFromUri(
            "./models"
        );


        console.log(
            "MODELO CARGADO."
        );


        video.addEventListener(
            "playing",
            iniciarVideo
        );


        video.load();


        await video.play();


    } catch (error) {

        console.error(
            "ERROR INICIAL:"
        );

        console.error(error);

    }

}


// ============================================================
// VÍDEO
// ============================================================

function iniciarVideo() {

    console.log(
        "VÍDEO REPRODUCIÉNDOSE."
    );


    console.log(
        "Tamaño:",
        video.videoWidth,
        "x",
        video.videoHeight
    );


    // IMPORTANTE:
    // No buscamos ningún canvas existente.
    // face-api creará el canvas automáticamente.


    detectar();

}


// ============================================================
// CREAR IMÁGENES
// ============================================================

function crearImagen(src) {

    const img =
        document.createElement("img");


    img.src = src;


    img.style.position =
        "absolute";


    img.style.display =
        "none";


    img.style.zIndex =
        "10";


    img.style.pointerEvents =
        "none";


    overlay.appendChild(img);


    return img;

}


// ============================================================
// CREAR LAS 4 IMÁGENES
// ============================================================

function crearImagenes() {

    if (imagesCreated) {

        return;

    }


    console.log(
        "CARGANDO IMÁGENES DE LOS FILTROS."
    );


    grullasImage =
        crearImagen("./grullas.png");


    libelulaImage =
        crearImagen("./libelula.png");


    mariposasImage =
        crearImagen("./mariposas.png");


    pezImage =
        crearImagen("./pez.png");


    imagesCreated = true;


}


// ============================================================
// COLOCAR IMAGEN
// ============================================================

function colocarImagen(img, box) {

    if (!img) {

        return;

    }


    img.style.display =
        "block";


    img.style.left =
        box.x + "px";


    img.style.top =
        box.y + "px";


    img.style.width =
        box.width + "px";


    img.style.height =
        box.height + "px";

}


// ============================================================
// OCULTAR IMÁGENES
// ============================================================

function ocultarImagenes() {

    if (grullasImage) {

        grullasImage.style.display =
            "none";

    }


    if (libelulaImage) {

        libelulaImage.style.display =
            "none";

    }


    if (mariposasImage) {

        mariposasImage.style.display =
            "none";

    }


    if (pezImage) {

        pezImage.style.display =
            "none";

    }

}


// ============================================================
// DETECCIÓN FACIAL
// ============================================================

async function detectar() {


    if (detectando) {

        return;

    }


    detectando = true;


    console.log(
        "INICIANDO DETECCIÓN FACIAL."
    );


    // Creamos un canvas automáticamente.
    // NO hace falta poner <canvas> en el HTML.

    const canvas =
        faceapi.createCanvasFromMedia(video);


    overlay.appendChild(canvas);


    const displaySize = {

        width: video.videoWidth,

        height: video.videoHeight

    };


    faceapi.matchDimensions(
        canvas,
        displaySize
    );


    crearImagenes();


    // ========================================================
    // BUCLE DE DETECCIÓN
    // ========================================================

    async function detectarFrame() {


        if (
            video.paused ||
            video.ended
        ) {

            requestAnimationFrame(
                detectarFrame
            );

            return;

        }


        try {


            const detections =
                await faceapi.detectAllFaces(

                    video,

                    new faceapi.TinyFaceDetectorOptions({

                        inputSize: 128,

                        scoreThreshold: 0.3

                    })

                );


            const resizedDetections =
                faceapi.resizeResults(

                    detections,

                    displaySize

                );


            console.log(
                "CARAS DETECTADAS:",
                resizedDetections.length
            );


            // =================================================
            // CUATRO O MÁS CARAS
            // =================================================

            if (
                resizedDetections.length >= 4
            ) {


                colocarImagen(

                    grullasImage,

                    resizedDetections[0].box

                );


                colocarImagen(

                    libelulaImage,

                    resizedDetections[1].box

                );


                colocarImagen(

                    mariposasImage,

                    resizedDetections[2].box

                );


                colocarImagen(

                    pezImage,

                    resizedDetections[3].box

                );


            }

            else {


                ocultarImagenes();


            }


        }

        catch(error) {


            console.error(
                "ERROR DETECTANDO:",
                error
            );


        }


        requestAnimationFrame(
            detectarFrame
        );

    }


    detectarFrame();

}


// ============================================================
// INICIAR
// ============================================================

iniciar();
