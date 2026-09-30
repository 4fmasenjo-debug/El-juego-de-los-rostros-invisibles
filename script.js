console.log(
    "INICIANDO EL JUEGO DE LOS ROSTROS INVISIBLES"
);

// ============================================================
// ELEMENTOS HTML
// ============================================================

const video =
    document.getElementById("video");

const overlay =
    document.getElementById("overlay-elements");

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
// COMPROBAR FACE-API
// ============================================================

if (typeof faceapi === "undefined") {

    console.error(
        "ERROR: face-api.js NO está cargado."
    );

} else {

    console.log(
        "face-api.js cargado correctamente."
    );

}

// ============================================================
// COMPROBAR ELEMENTOS
// ============================================================

if (!video) {

    console.error(
        "ERROR: no se encuentra #video."
    );

}

if (!overlay) {

    console.error(
        "ERROR: no se encuentra #overlay-elements."
    );

}

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
                "El navegador bloqueó la reproducción automática."
            );

            console.warn(error);

        }

    } catch (error) {

        console.error(
            "ERROR AL INICIAR:"
        );

        console.error(error);

    }

}

// ============================================================
// VÍDEO REPRODUCIÉNDOSE
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

    if (
        video.videoWidth === 0 ||
        video.videoHeight === 0
    ) {

        console.error(
            "El vídeo no tiene dimensiones válidas."
        );

        return;

    }

    if (deteccionIniciada) {

        return;

    }

    deteccionIniciada = true;

    detectar();

}

// ============================================================
// CREAR IMAGEN
// ============================================================

function crearImagen(src) {

    const img =
        document.createElement("img");

    img.src = src;

    img.style.position =
        "absolute";

    img.style.display =
        "none";

    img.style.pointerEvents =
        "none";

    img.style.zIndex =
        "20";

    overlay.appendChild(img);

    img.addEventListener(
        "load",
        () => {

            console.log(
                "Imagen cargada:",
                src
            );

        }
    );

    img.addEventListener(
        "error",
        () => {

            console.error(
                "ERROR CARGANDO IMAGEN:",
                src
            );

        }
    );

    return img;

}

// ============================================================
// CARGAR LAS IMÁGENES
// ============================================================

function cargarImagenes() {

    console.log(
        "Cargando imágenes..."
    );

    grullasImage =
        crearImagen(
            "./grullas.png"
        );

    libelulaImage =
        crearImagen(
            "./libelula.png"
        );

    mariposasImage =
        crearImagen(
            "./mariposas.png"
        );

    pezImage =
        crearImagen(
            "./pez.png"
        );

}

// ============================================================
// COLOCAR IMAGEN SOBRE UNA CARA
// ============================================================

function colocarImagen(
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

    imagen.style.display =
        "block";

    imagen.style.left =
        caja.x + "px";

    imagen.style.top =
        caja.y + "px";

    imagen.style.width =
        caja.width + "px";

    imagen.style.height =
        caja.height + "px";

}

// ============================================================
// OCULTAR UNA IMAGEN
// ============================================================

function ocultarImagen(imagen) {

    if (!imagen) {

        return;

    }

    imagen.style.display =
        "none";

}

// ============================================================
// OCULTAR TODAS LAS IMÁGENES
// ============================================================

function ocultarImagenes() {

    ocultarImagen(
        grullasImage
    );

    ocultarImagen(
        libelulaImage
    );

    ocultarImagen(
        mariposasImage
    );

    ocultarImagen(
        pezImage
    );

}

// ============================================================
// DETECCIÓN FACIAL
// ============================================================

async function detectar() {

    console.log(
        "INICIANDO DETECCIÓN FACIAL."
    );

    // --------------------------------------------------------
    // CREAR CANVAS
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
    // TAMAÑO DEL VÍDEO
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
    // CARGAR IMÁGENES
    // --------------------------------------------------------

    cargarImagenes();

    // ========================================================
    // DETECTAR CADA FRAME
    // ========================================================

    async function detectarFrame() {

        // ----------------------------------------------------
        // COMPROBAR VÍDEO
        // ----------------------------------------------------

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
            // DETECTAR CARAS
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
            // AJUSTAR COORDENADAS
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
            // ASIGNAR CADA IMAGEN A CADA CARA
            // =================================================

            // -------------------------------------------------
            // CARA 1 → GRULLAS
            // -------------------------------------------------

            if (
                caras.length >= 1
            ) {

                colocarImagen(
                    grullasImage,
                    caras[0].box
                );

            } else {

                ocultarImagen(
                    grullasImage
                );

            }

            // -------------------------------------------------
            // CARA 2 → LIBÉLULA
            // -------------------------------------------------

            if (
                caras.length >= 2
            ) {

                colocarImagen(
                    libelulaImage,
                    caras[1].box
                );

            } else {

                ocultarImagen(
                    libelulaImage
                );

            }

            // -------------------------------------------------
            // CARA 3 → MARIPOSAS
            // -------------------------------------------------

            if (
                caras.length >= 3
            ) {

                colocarImagen(
                    mariposasImage,
                    caras[2].box
                );

            } else {

                ocultarImagen(
                    mariposasImage
                );

            }

            // -------------------------------------------------
            // CARA 4 → PEZ
            // -------------------------------------------------

            if (
                caras.length >= 4
            ) {

                colocarImagen(
                    pezImage,
                    caras[3].box
                );

            } else {

                ocultarImagen(
                    pezImage
                );

            }

        } catch (error) {

            console.error(
                "ERROR DURANTE LA DETECCIÓN:"
            );

            console.error(error);

        }

        // ----------------------------------------------------
        // SIGUIENTE FRAME
        // ----------------------------------------------------

        requestAnimationFrame(
            detectarFrame
        );

    }

    // ========================================================
    // COMENZAR DETECCIÓN
    // ========================================================

    detectarFrame();

}

// ============================================================
// INICIAR TODO
// ============================================================

iniciar();
