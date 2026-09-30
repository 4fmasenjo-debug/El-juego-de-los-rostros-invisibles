console.log("=================================");
console.log("INICIANDO EL JUEGO DE LOS ROSTROS INVISIBLES");
console.log("=================================");


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
// COMPROBACIONES
// ============================================================

if (typeof faceapi === "undefined") {

    console.error(
        "❌ face-api.js NO está cargado."
    );

} else {

    console.log(
        "✅ face-api.js cargado correctamente."
    );

}


if (!video) {

    console.error(
        "❌ No existe el elemento #video."
    );

}


if (!overlay) {

    console.error(
        "❌ No existe #overlay-elements."
    );

}


// ============================================================
// CREAR IMAGEN
// ============================================================

function crearImagen(src, nombre) {

    console.log(
        "Creando:",
        nombre,
        src
    );


    const img = document.createElement("img");


    img.src = src;


    img.alt = nombre;


    img.style.position = "absolute";

    img.style.display = "none";

    img.style.pointerEvents = "none";

    img.style.userSelect = "none";

    img.style.zIndex = "100";


    overlay.appendChild(img);


    img.addEventListener("load", function () {

        console.log(
            "✅ IMAGEN CARGADA:",
            nombre
        );

        console.log(
            "   naturalWidth:",
            img.naturalWidth
        );

        console.log(
            "   naturalHeight:",
            img.naturalHeight
        );

    });


    img.addEventListener("error", function () {

        console.error(
            "❌ ERROR CARGANDO:",
            nombre
        );

        console.error(
            "Ruta:",
            img.src
        );

    });


    return img;

}


// ============================================================
// CARGAR IMÁGENES
// ============================================================

function cargarImagenes() {

    console.log("=================================");
    console.log("CARGANDO IMÁGENES");
    console.log("=================================");


    grullasImage =
        crearImagen(
            "./grullas.png",
            "GRULLAS"
        );


    libelulaImage =
        crearImagen(
            "./libelula.png",
            "LIBÉLULA"
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
// OCULTAR IMAGEN
// ============================================================

function ocultarImagen(img) {

    if (!img) {
        return;
    }

    img.style.display = "none";

}


// ============================================================
// COLOCAR IMAGEN
// ============================================================

function colocarImagen(img, box, nombre) {

    if (!img) {

        console.error(
            "Imagen inexistente:",
            nombre
        );

        return;

    }


    if (!box) {

        ocultarImagen(img);

        return;

    }


    // --------------------------------------------------------
    // COORDENADAS
    // --------------------------------------------------------

    const x = box.x;
    const y = box.y;

    const width = box.width;
    const height = box.height;


    console.log(
        nombre,
        "→",
        Math.round(x),
        Math.round(y),
        Math.round(width),
        Math.round(height)
    );


    // --------------------------------------------------------
    // POSICIÓN
    // --------------------------------------------------------

    img.style.left =
        Math.round(x) + "px";


    img.style.top =
        Math.round(y) + "px";


    // --------------------------------------------------------
    // TAMAÑO
    // --------------------------------------------------------

    img.style.width =
        Math.round(width) + "px";


    img.style.height =
        Math.round(height) + "px";


    // --------------------------------------------------------
    // CAPA
    // --------------------------------------------------------

    img.style.zIndex = "100";


    // --------------------------------------------------------
    // MOSTRAR
    // --------------------------------------------------------

    img.style.display = "block";

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
                "Autoplay bloqueado."
            );

            console.warn(error);

        }


    } catch (error) {

        console.error(
            "❌ ERROR AL INICIAR:"
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


    if (
        video.videoWidth === 0 ||
        video.videoHeight === 0
    ) {

        console.error(
            "❌ Tamaño de vídeo inválido."
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


    canvas.style.zIndex =
        "10";


    canvas.style.pointerEvents =
        "none";


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
    // DETECTAR FRAME
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
            // DETECCIÓN
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
            // CARA 1
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
            // CARA 2
            // =================================================

            if (
                caras.length >= 2
            ) {

                colocarImagen(
                    libelulaImage,
                    caras[1].box,
                    "LIBÉLULA"
                );

            } else {

                ocultarImagen(
                    libelulaImage
                );

            }


            // =================================================
            // CARA 3
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
            // CARA 4
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
                "❌ ERROR DURANTE LA DETECCIÓN:"
            );

            console.error(error);

        }


        requestAnimationFrame(
            detectarFrame
        );

    }


    // ========================================================
    // ARRANCAR
    // ========================================================

    detectarFrame();

}


// ============================================================
// INICIAR
// ============================================================

iniciar();
