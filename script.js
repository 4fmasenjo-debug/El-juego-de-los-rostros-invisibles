console.clear();

console.log("==========================================");
console.log("EL JUEGO DE LOS ROSTROS INVISIBLES");
console.log("VERSIÓN GITHUB 2026-10-01");
console.log("==========================================");


// ============================================================
// ELEMENTOS
// ============================================================

const video =
    document.getElementById("video");

const overlay =
    document.getElementById("overlay-elements");


// ============================================================
// VARIABLES DE IMÁGENES
// ============================================================

let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;


// ============================================================
// CANVAS
// ============================================================

let canvas = null;


// ============================================================
// CONTROL
// ============================================================

let deteccionIniciada = false;

let ultimaDeteccion = [];

let framesSinCaras = 0;


// Número de detecciones consecutivas sin caras
// antes de ocultar las imágenes.

const MAX_FRAMES_SIN_CARAS = 3;


// ============================================================
// COMPROBAR FACE API
// ============================================================

if (
    typeof faceapi === "undefined"
) {

    console.error(
        "❌ face-api.js NO está cargado."
    );

} else {

    console.log(
        "✅ face-api.js cargado correctamente."
    );

}


// ============================================================
// COMPROBAR ELEMENTOS
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

function crearImagen(
    ruta,
    nombre
) {

    console.log(
        "Cargando:",
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


    img.style.display =
        "none";


    img.style.pointerEvents =
        "none";


    img.style.userSelect =
        "none";


    img.style.zIndex =
        "100";


    overlay.appendChild(
        img
    );


    img.onload = function () {

        console.log(
            "✅ IMAGEN CARGADA:",
            nombre
        );

        console.log(
            "Tamaño:",
            img.naturalWidth,
            "x",
            img.naturalHeight
        );

    };


    img.onerror = function () {

        console.error(
            "❌ ERROR CARGANDO:",
            nombre
        );

        console.error(
            "Ruta:",
            ruta
        );

    };


    return img;

}


// ============================================================
// CARGAR LAS CUATRO IMÁGENES
// ============================================================

function cargarImagenes() {

    console.log(
        "=========================================="
    );

    console.log(
        "CARGANDO IMÁGENES"
    );

    console.log(
        "=========================================="
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

function ocultarImagen(
    imagen
) {

    if (!imagen) {
        return;
    }


    imagen.style.display =
        "none";

}


// ============================================================
// MOSTRAR Y COLOCAR
// ============================================================

function colocarImagen(
    imagen,
    box,
    nombre
) {

    if (!imagen) {

        console.error(
            "No existe:",
            nombre
        );

        return;

    }


    if (!box) {

        return;

    }


    // --------------------------------------------------------
    // POSICIÓN
    // --------------------------------------------------------

    imagen.style.left =
        Math.round(box.x) + "px";


    imagen.style.top =
        Math.round(box.y) + "px";


    // --------------------------------------------------------
    // TAMAÑO
    // --------------------------------------------------------

    imagen.style.width =
        Math.round(box.width) + "px";


    imagen.style.height =
        Math.round(box.height) + "px";


    // --------------------------------------------------------
    // VISIBILIDAD
    // --------------------------------------------------------

    imagen.style.display =
        "block";


    imagen.style.visibility =
        "visible";


    imagen.style.opacity =
        "1";


    imagen.style.zIndex =
        "100";


    /*
       Solo mostramos este mensaje cuando
       realmente colocamos una imagen.
    */

    console.log(
        "Filtro:",
        nombre
    );

}


// ============================================================
// ACTUALIZAR FILTROS
// ============================================================

function actualizarFiltros(
    caras
) {

    // ========================================================
    // SI HAY CARAS
    // ========================================================

    if (
        caras.length > 0
    ) {

        framesSinCaras = 0;


        ultimaDeteccion =
            caras;


    } else {

        framesSinCaras++;


        /*
           No ocultamos inmediatamente.
           Esperamos varias detecciones.
        */

        if (
            framesSinCaras <
            MAX_FRAMES_SIN_CARAS
        ) {

            return;

        }


        ultimaDeteccion = [];

    }


    // ========================================================
    // CARA 1
    // ========================================================

    if (
        caras[0]
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


    // ========================================================
    // CARA 2
    // ========================================================

    if (
        caras[1]
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


    // ========================================================
    // CARA 3
    // ========================================================

    if (
        caras[2]
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


    // ========================================================
    // CARA 4
    // ========================================================

    if (
        caras[3]
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

}


// ============================================================
// CARGAR MODELO
// ============================================================

async function iniciar() {

    try {

        console.log(
            "=========================================="
        );

        console.log(
            "CARGANDO TINY FACE DETECTOR"
        );

        console.log(
            "=========================================="
        );


        await faceapi.nets.tinyFaceDetector.loadFromUri(
            "./models"
        );


        console.log(
            "✅ MODELO CARGADO CORRECTAMENTE"
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
                "Autoplay bloqueado."
            );

            console.warn(
                error
            );

        }


    } catch (error) {

        console.error(
            "❌ ERROR AL CARGAR MODELO"
        );

        console.error(
            error
        );

    }

}


// ============================================================
// VÍDEO
// ============================================================

function iniciarVideo() {

    console.log(
        "=========================================="
    );

    console.log(
        "VÍDEO REPRODUCIÉNDOSE"
    );

    console.log(
        "=========================================="
    );


    console.log(
        "Tamaño:",
        video.videoWidth,
        "x",
        video.videoHeight
    );


    if (
        video.videoWidth === 0 ||
        video.videoHeight === 0
    ) {

        console.error(
            "El vídeo no tiene dimensiones."
        );

        return;

    }


    if (
        deteccionIniciada
    ) {

        return;

    }


    deteccionIniciada =
        true;


    iniciarDeteccion();

}


// ============================================================
// DETECCIÓN
// ============================================================

function iniciarDeteccion() {

    console.log(
        "=========================================="
    );

    console.log(
        "INICIANDO DETECCIÓN FACIAL"
    );

    console.log(
        "=========================================="
    );


    // ========================================================
    // CANVAS
    // ========================================================

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


    canvas.style.pointerEvents =
        "none";


    canvas.style.zIndex =
        "20";


    overlay.appendChild(
        canvas
    );


    // ========================================================
    // DIMENSIONES
    // ========================================================

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


    // ========================================================
    // IMÁGENES
    // ========================================================

    cargarImagenes();


    // ========================================================
    // DETECCIÓN CADA 100 MS
    // ========================================================

    setInterval(
        detectar,
        100
    );

}


// ============================================================
// DETECTAR
// ============================================================

async function detectar() {

    if (
        video.paused ||
        video.ended
    ) {

        return;

    }


    if (
        video.readyState < 2
    ) {

        return;

    }


    try {

        // ====================================================
        // EXACTAMENTE EL MISMO DETECTOR
        // ====================================================

        const detecciones =
            await faceapi.detectAllFaces(

                video,

                new faceapi.TinyFaceDetectorOptions({

                    inputSize: 128,

                    scoreThreshold: 0.3

                })

            );


        // ====================================================
        // REDIMENSIONAR
        // ====================================================

        const caras =
            faceapi.resizeResults(

                detecciones,

                {
                    width:
                        video.videoWidth,

                    height:
                        video.videoHeight
                }

            );


        // ====================================================
        // ACTUALIZAR
        // ====================================================

        actualizarFiltros(
            caras
        );


    } catch (error) {

        console.error(
            "❌ ERROR EN DETECCIÓN:",
            error
        );

    }

}


// ============================================================
// ARRANCAR
// ============================================================

iniciar();
