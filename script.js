console.clear();

console.log("======================================");
console.log("SCRIPT NUEVO - PRUEBA DEFINITIVA");
console.log("======================================");


// ============================================================
// ELEMENTOS
// ============================================================

const video =
    document.getElementById("video");

const overlay =
    document.getElementById("overlay-elements");


// ============================================================
// IMÁGENES
// ============================================================

let grullasImage;
let libelulaImage;
let mariposasImage;
let pezImage;


// ============================================================
// CANVAS
// ============================================================

let canvas = null;


// ============================================================
// CREAR IMAGEN
// ============================================================

function crearImagen(
    ruta,
    nombre
) {

    console.log(
        "CREANDO:",
        nombre,
        ruta
    );


    const img =
        document.createElement("img");


    img.src =
        ruta;


    img.alt =
        nombre;


    img.style.position =
        "absolute";


    img.style.zIndex =
        "200";


    img.style.pointerEvents =
        "none";


    img.style.display =
        "none";


    overlay.appendChild(
        img
    );


    img.onload = function () {

        console.log(
            "████████████████████████████"
        );

        console.log(
            "IMAGEN OK:",
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
            "████████████████████████████"
        );

    };


    img.onerror = function () {

        console.error(
            "!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        );

        console.error(
            "ERROR:",
            nombre
        );

        console.error(
            "RUTA:",
            ruta
        );

        console.error(
            "!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        );

    };


    return img;

}


// ============================================================
// CARGAR IMÁGENES
// ============================================================

function cargarImagenes() {

    console.log(
        "CARGANDO LAS IMÁGENES"
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
// MOSTRAR IMAGEN
// ============================================================

function mostrarImagen(
    imagen,
    caja
) {

    if (!imagen) {

        return;

    }


    if (!caja) {

        imagen.style.display =
            "none";

        return;

    }


    imagen.style.left =
        Math.round(caja.x) + "px";


    imagen.style.top =
        Math.round(caja.y) + "px";


    imagen.style.width =
        Math.round(caja.width) + "px";


    imagen.style.height =
        Math.round(caja.height) + "px";


    imagen.style.display =
        "block";


    imagen.style.visibility =
        "visible";


    imagen.style.opacity =
        "1";


    imagen.style.zIndex =
        "200";

}


// ============================================================
// OCULTAR
// ============================================================

function ocultar(imagen) {

    if (imagen) {

        imagen.style.display =
            "none";

    }

}


// ============================================================
// INICIAR
// ============================================================

async function iniciar() {

    console.log(
        "Cargando modelo..."
    );


    try {

        await faceapi.nets.tinyFaceDetector.loadFromUri(
            "./models"
        );


        console.log(
            "MODELO CARGADO"
        );


        video.addEventListener(
            "playing",
            iniciarVideo,
            {
                once: true
            }
        );


        video.load();


        await video.play();


    } catch (error) {

        console.error(
            "ERROR:",
            error
        );

    }

}


// ============================================================
// VÍDEO
// ============================================================

function iniciarVideo() {

    console.log(
        "VÍDEO OK:",
        video.videoWidth,
        video.videoHeight
    );


    detectar();

}


// ============================================================
// DETECTAR
// ============================================================

async function detectar() {

    console.log(
        "INICIANDO DETECCIÓN"
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
        "60";


    canvas.style.pointerEvents =
        "none";


    overlay.appendChild(
        canvas
    );


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

    async function frame() {

        try {

            const detecciones =
                await faceapi.detectAllFaces(

                    video,

                    new faceapi.TinyFaceDetectorOptions({

                        inputSize: 128,

                        scoreThreshold: 0.3

                    })

                );


            const caras =
                faceapi.resizeResults(
                    detecciones,
                    displaySize
                );


            console.log(
                "CARAS:",
                caras.length
            );


            // =================================================
            // CARA 1
            // =================================================

            if (caras[0]) {

                mostrarImagen(
                    grullasImage,
                    caras[0].box
                );

            } else {

                ocultar(
                    grullasImage
                );

            }


            // =================================================
            // CARA 2
            // =================================================

            if (caras[1]) {

                mostrarImagen(
                    libelulaImage,
                    caras[1].box
                );

            } else {

                ocultar(
                    libelulaImage
                );

            }


            // =================================================
            // CARA 3
            // =================================================

            if (caras[2]) {

                mostrarImagen(
                    mariposasImage,
                    caras[2].box
                );

            } else {

                ocultar(
                    mariposasImage
                );

            }


            // =================================================
            // CARA 4
            // =================================================

            if (caras[3]) {

                mostrarImagen(
                    pezImage,
                    caras[3].box
                );

            } else {

                ocultar(
                    pezImage
                );

            }


        } catch (error) {

            console.error(
                "ERROR DETECTANDO:",
                error
            );

        }


        requestAnimationFrame(
            frame
        );

    }


    frame();

}


// ============================================================
// ARRANCAR
// ============================================================

iniciar();
