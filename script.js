console.clear();

console.log("=================================");
console.log("NUEVO SCRIPT CARGADO");
console.log("=================================");
console.log("VERSIÓN: 2026-09-30-01");


// ============================================================
// ELEMENTOS
// ============================================================

const video = document.getElementById("video");
const overlay = document.getElementById("overlay-elements");


// ============================================================
// VARIABLES
// ============================================================

let canvas = null;

let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;

let deteccionIniciada = false;


// ============================================================
// COMPROBAR FACE API
// ============================================================

if (typeof faceapi === "undefined") {

    console.error(
        "ERROR: face-api.js NO está cargado."
    );

} else {

    console.log(
        "OK: face-api.js cargado."
    );

}


// ============================================================
// COMPROBAR HTML
// ============================================================

console.log(
    "VIDEO:",
    video
);

console.log(
    "OVERLAY:",
    overlay
);


// ============================================================
// CREAR IMAGEN
// ============================================================

function crearImagen(src, nombre) {

    console.log(
        "CREANDO IMAGEN:",
        nombre,
        src
    );


    const img =
        document.createElement("img");


    img.src =
        src;


    img.alt =
        nombre;


    img.style.position =
        "absolute";


    img.style.display =
        "none";


    img.style.pointerEvents =
        "none";


    img.style.userSelect =
        "none";


    img.style.zIndex =
        "1000";


    overlay.appendChild(
        img
    );


    img.onload = function () {

        console.log(
            "================================="
        );

        console.log(
            "IMAGEN CARGADA:",
            nombre
        );

        console.log(
            "ANCHO:",
            img.naturalWidth
        );

        console.log(
            "ALTO:",
            img.naturalHeight
        );

        console.log(
            "================================="
        );

    };


    img.onerror = function () {

        console.error(
            "================================="
        );

        console.error(
            "ERROR CARGANDO IMAGEN:",
            nombre
        );

        console.error(
            "RUTA:",
            img.src
        );

        console.error(
            "================================="
        );

    };


    return img;

}


// ============================================================
// CARGAR IMÁGENES
// ============================================================

function cargarImagenes() {

    console.log(
        "================================="
    );

    console.log(
        "CARGANDO LAS 4 IMÁGENES"
    );

    console.log(
        "================================="
    );


    grullasImage =
        crearImagen(
            "./grullas.png",
            "GRULLAS"
        );


    libelulaImage =
        crearImagen(
            "./libelula.png",
            "LIBELULA"
        );


    mariposasImage =
        crearImagen(
            "./mariposas.png",
            "MARIPOSAS"
        );


    pezImage =
        crearImagen(
            "./pez.png",
            "PEZ"
        );

}


// ============================================================
// OCULTAR
// ============================================================

function ocultarImagen(img) {

    if (!img) {
        return;
    }

    img.style.display =
        "none";

}


// ============================================================
// COLOCAR IMAGEN
// ============================================================

function colocarImagen(
    img,
    box,
    nombre
) {

    if (!img) {

        console.error(
            "NO EXISTE LA IMAGEN:",
            nombre
        );

        return;

    }


    if (!box) {

        ocultarImagen(img);

        return;

    }


    console.log(
        "COLOCANDO:",
        nombre,
        "X:",
        box.x,
        "Y:",
        box.y,
        "W:",
        box.width,
        "H:",
        box.height
    );


    img.style.left =
        box.x + "px";


    img.style.top =
        box.y + "px";


    img.style.width =
        box.width + "px";


    img.style.height =
        box.height + "px";


    img.style.display =
        "block";


    img.style.visibility =
        "visible";


    img.style.opacity =
        "1";


    img.style.zIndex =
        "1000";

}


// ============================================================
// INICIAR
// ============================================================

async function iniciar() {

    console.log(
        "================================="
    );

    console.log(
        "CARGANDO MODELO"
    );

    console.log(
        "================================="
    );


    try {

        await faceapi.nets.tinyFaceDetector.loadFromUri(
            "./models"
        );


        console.log(
            "MODELO CARGADO CORRECTAMENTE."
        );


        video.addEventListener(
            "playing",
            iniciarVideo,
            {
                once: true
            }
        );


        video.load();


        try {

            await video.play();

        } catch (error) {

            console.warn(
                "AUTOPLAY BLOQUEADO"
            );

            console.warn(error);

        }


    } catch (error) {

        console.error(
            "ERROR CARGANDO MODELO:"
        );

        console.error(error);

    }

}


// ============================================================
// VÍDEO
// ============================================================

function iniciarVideo() {

    console.log(
        "================================="
    );

    console.log(
        "VIDEO REPRODUCIÉNDOSE"
    );

    console.log(
        "================================="
    );


    console.log(
        "ANCHO:",
        video.videoWidth
    );

    console.log(
        "ALTO:",
        video.videoHeight
    );


    if (
        video.videoWidth === 0 ||
        video.videoHeight === 0
    ) {

        console.error(
            "EL VÍDEO NO TIENE TAMAÑO."
        );

        return;

    }


    if (deteccionIniciada) {

        return;

    }


    deteccionIniciada =
        true;


    detectar();

}


// ============================================================
// DETECCIÓN
// ============================================================

async function detectar() {

    console.log(
        "================================="
    );

    console.log(
        "INICIANDO DETECCIÓN FACIAL"
    );

    console.log(
        "================================="
    );


    // --------------------------------------------------------
    // CANVAS
    // --------------------------------------------------------

    canvas =
        faceapi.createCanvasFromMedia(
            video
        );


    canvas.style.position =
        "absolute";


    canvas.style.left =
        "0px";


    canvas.style.top =
        "0px";


    canvas.style.width =
        "768px";


    canvas.style.height =
        "576px";


    canvas.style.zIndex =
        "10";


    canvas.style.pointerEvents =
        "none";


    overlay.appendChild(
        canvas
    );


    // --------------------------------------------------------
    // DIMENSIONES
    // --------------------------------------------------------

    const displaySize = {

        width:
            video.videoWidth,

        height:
            video.videoHeight

    };


    faceapi.matchDimensions(
        canvas,
        displaySize
    );


    // --------------------------------------------------------
    // IMÁGENES
    // --------------------------------------------------------

    cargarImagenes();


    // ========================================================
    // FRAME
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

            // ------------------------------------------------
            // DETECTAR
            // ------------------------------------------------

            const detecciones =
                await faceapi.detectAllFaces(

                    video,

                    new faceapi.TinyFaceDetectorOptions({

                        inputSize: 128,

                        scoreThreshold: 0.3

                    })

                );


            // ------------------------------------------------
            // REDIMENSIONAR
            // ------------------------------------------------

            const caras =
                faceapi.resizeResults(
                    detecciones,
                    displaySize
                );


            console.log(
                "CARAS DETECTADAS:",
                caras.length
            );


            // ------------------------------------------------
            // LIMPIAR CANVAS
            // ------------------------------------------------

            const ctx =
                canvas.getContext("2d");


            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );


            // =================================================
            // CARA 1 → GRULLAS
            // =================================================

            if (
                caras.length >= 1
            ) {

                colocarImagen(
                    grullasImage,
                    caras[0].box,
                    "GRULLAS"
                );

            } else {

                ocultarImagen(
                    grullasImage
                );

            }


            // =================================================
            // CARA 2 → LIBÉLULA
            // =================================================

            if (
                caras.length >= 2
            ) {

                colocarImagen(
                    libelulaImage,
                    caras[1].box,
                    "LIBELULA"
                );

            } else {

                ocultarImagen(
                    libelulaImage
                );

            }


            // =================================================
            // CARA 3 → MARIPOSAS
            // =================================================

            if (
                caras.length >= 3
            ) {

                colocarImagen(
                    mariposasImage,
                    caras[2].box,
                    "MARIPOSAS"
                );

            } else {

                ocultarImagen(
                    mariposasImage
                );

            }


            // =================================================
            // CARA 4 → PEZ
            // =================================================

            if (
                caras.length >= 4
            ) {

                colocarImagen(
                    pezImage,
                    caras[3].box,
                    "PEZ"
                );

            } else {

                ocultarImagen(
                    pezImage
                );

            }


        } catch (error) {

            console.error(
                "ERROR DURANTE DETECCIÓN:"
            );

            console.error(error);

        }


        requestAnimationFrame(
            detectarFrame
        );

    }


    // --------------------------------------------------------
    // ARRANCAR
    // --------------------------------------------------------

    detectarFrame();

}


// ============================================================
// ARRANCAR TODO
// ============================================================

iniciar();
