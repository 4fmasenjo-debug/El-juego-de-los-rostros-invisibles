console.log("INICIANDO DETECCIÓN FACIAL");

const video = document.getElementById("video");
const overlay = document.getElementById("overlay-elements");

let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;

let canvas = null;
let deteccionIniciada = false;


// ============================================================
// COMPROBAR FACE-API
// ============================================================

if (typeof faceapi === "undefined") {

    console.error("face-api.js NO está cargado.");

} else {

    console.log("face-api.js cargado correctamente.");

}


// ============================================================
// INICIAR
// ============================================================

async function iniciar() {

    try {

        console.log("Cargando modelo...");

        await faceapi.nets.tinyFaceDetector.loadFromUri(
            "./models"
        );

        console.log("MODELO CARGADO.");

        video.addEventListener(
            "playing",
            iniciarVideo,
            { once: true }
        );

        video.load();

        await video.play();

    } catch (error) {

        console.error("ERROR INICIAL:");
        console.error(error);

    }

}


// ============================================================
// VÍDEO
// ============================================================

function iniciarVideo() {

    console.log("VÍDEO REPRODUCIÉNDOSE.");

    console.log(
        "Tamaño:",
        video.videoWidth,
        "x",
        video.videoHeight
    );


    if (deteccionIniciada) {

        return;

    }


    deteccionIniciada = true;


    detectar();

}


// ============================================================
// CREAR IMÁGENES
// ============================================================

function crearImagen(src) {

    const img =
        document.createElement("img");

    img.src = src;

    img.style.position = "absolute";

    img.style.display = "none";

    img.style.zIndex = "10";

    img.style.pointerEvents = "none";

    overlay.appendChild(img);

    return img;

}


// ============================================================
// CREAR FILTROS
// ============================================================

function crearImagenes() {

    if (grullasImage) {

        return;

    }

    console.log("CARGANDO IMÁGENES.");

    grullasImage =
        crearImagen("./grullas.png");

    libelulaImage =
        crearImagen("./libelula.png");

    mariposasImage =
        crearImagen("./mariposas.png");

    pezImage =
        crearImagen("./pez.png");

}


// ============================================================
// COLOCAR IMAGEN
// ============================================================

function colocarImagen(img, box) {

    if (!img || !box) {

        return;

    }

    img.style.display = "block";

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

        grullasImage.style.display = "none";

    }

    if (libelulaImage) {

        libelulaImage.style.display = "none";

    }

    if (mariposasImage) {

        mariposasImage.style.display = "none";

    }

    if (pezImage) {

        pezImage.style.display = "none";

    }

}


// ============================================================
// DETECCIÓN
// ============================================================

async function detectar() {

    console.log(
        "INICIANDO DETECCIÓN FACIAL."
    );


    // Crear canvas AQUÍ.
    // No usamos ningún canvas del HTML.

    canvas =
        faceapi.createCanvasFromMedia(video);


    canvas.style.position = "absolute";

    canvas.style.left = "0";

    canvas.style.top = "0";

    canvas.style.zIndex = "2";

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
    // BUCLE
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
            // NECESITAMOS 4 CARAS
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


            } else {


                ocultarImagenes();


            }


        } catch (error) {

            console.error(
                "ERROR EN DETECCIÓN:",
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
// ARRANCAR
// ============================================================

iniciar();
