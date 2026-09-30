console.log(
    "================================="
);

console.log(
    "INICIANDO EL JUEGO DE LOS ROSTROS INVISIBLES"
);

console.log(
    "================================="
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
// COMPROBAR ELEMENTOS
// ============================================================

if (!video) {

    console.error(
        "❌ ERROR: no se encuentra #video"
    );

}

if (!overlay) {

    console.error(
        "❌ ERROR: no se encuentra #overlay-elements"
    );

}


// ============================================================
// COMPROBAR FACE API
// ============================================================

if (
    typeof faceapi === "undefined"
) {

    console.error(
        "❌ ERROR: face-api.js NO está cargado"
    );

} else {

    console.log(
        "✅ face-api.js cargado correctamente"
    );

}


// ============================================================
// CREAR IMAGEN
// ============================================================

function crearImagen(src) {

    console.log(
        "Creando imagen:",
        src
    );


    const img =
        document.createElement("img");


    img.src =
        src;


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


    // --------------------------------------------------------
    // IMAGEN CARGADA
    // --------------------------------------------------------

    img.onload = function () {

        console.log(
            "✅ IMAGEN CARGADA:",
            src
        );

        console.log(
            "Tamaño:",
            img.naturalWidth,
            "x",
            img.naturalHeight
        );

    };


    // --------------------------------------------------------
    // ERROR
    // --------------------------------------------------------

    img.onerror = function () {

        console.error(
            "❌ ERROR CARGANDO IMAGEN:",
            src
        );

    };


    return img;

}


// ============================================================
// CARGAR TODAS LAS IMÁGENES
// ============================================================

function cargarImagenes() {

    console.log(
        "================================="
    );

    console.log(
        "CARGANDO IMÁGENES"
    );

    console.log(
        "================================="
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
// OCULTAR IMAGEN
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

function ocultarTodasLasImagenes() {

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


    // --------------------------------------------------------
    // POSICIÓN
    // --------------------------------------------------------

    imagen.style.left =
        caja.x + "px";


    imagen.style.top =
        caja.y + "px";


    // --------------------------------------------------------
    // TAMAÑO
    // --------------------------------------------------------

    imagen.style.width =
        caja.width + "px";


    imagen.style.height =
        caja.height + "px";


    // --------------------------------------------------------
    // MOSTRAR
    // --------------------------------------------------------

    imagen.style.display =
        "block";


    imagen.style.zIndex =
        "100";


}


// ============================================================
// CARGAR MODELO
// ============================================================

async function iniciar() {

    console.log(
        "================================="
    );

    console.log(
        "INICIANDO CARGA"
    );

    console.log(
        "================================="
    );


    try {

        // ----------------------------------------------------
        // MODELO
        // ----------------------------------------------------

        console.log(
            "1. Cargando Tiny Face Detector..."
        );


        await faceapi.nets.tinyFaceDetector.loadFromUri(
            "./models"
        );


        console.log(
            "2. Tiny Face Detector OK"
        );


        // ----------------------------------------------------
        // VÍDEO
        // ----------------------------------------------------

        video.addEventListener(
            "playing",
            iniciarVideo,
            {
                once: true
            }
        );


        console.log(
            "3. Preparando vídeo..."
        );


        video.load();


        try {

            await video.play();

        } catch (error) {

            console.warn(
                "⚠️ El navegador bloqueó autoplay."
            );

            console.warn(
                error
            );

        }


    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "❌ ERROR AL INICIAR"
        );

        console.error(
            error
        );

        console.error(
            "================================="
        );

    }

}


// ============================================================
// VÍDEO LISTO
// ============================================================

function iniciarVideo() {

    console.log(
        "================================="
    );

    console.log(
        "VÍDEO REPRODUCIÉNDOSE"
    );

    console.log(
        "================================="
    );


    console.log(
        "Tamaño:",
        video.videoWidth,
        "x",
        video.videoHeight
    );


    // --------------------------------------------------------
    // COMPROBAR DIMENSIONES
    // --------------------------------------------------------

    if (
        video.videoWidth === 0 ||
        video.videoHeight === 0
    ) {

        console.error(
            "❌ El vídeo no tiene dimensiones válidas."
        );

        return;

    }


    // --------------------------------------------------------
    // EVITAR INICIAR DOS VECES
    // --------------------------------------------------------

    if (
        deteccionIniciada
    ) {

        return;

    }


    deteccionIniciada =
        true;


    // --------------------------------------------------------
    // COMENZAR DETECCIÓN
    // --------------------------------------------------------

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
    // CREAR CANVAS
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
    // CARGAR IMÁGENES
    // ========================================================

    cargarImagenes();


    // ========================================================
    // FUNCIÓN PARA DETECTAR CADA FRAME
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


            // =================================================
            // DETECTAR CARAS
            // =================================================

            const detecciones =
                await faceapi.detectAllFaces(

                    video,

                    new faceapi.TinyFaceDetectorOptions({

                        inputSize: 128,

                        scoreThreshold: 0.3

                    })

                );


            // =================================================
            // REDIMENSIONAR RESULTADOS
            // =================================================

            const caras =
                faceapi.resizeResults(

                    detecciones,

                    displaySize

                );


            console.log(
                "CARAS DETECTADAS:",
                caras.length
            );


            // =================================================
            // LIMPIAR CANVAS
            // =================================================

            const ctx =
                canvas.getContext(
                    "2d"
                );


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

                console.log(
                    "Cara 1 → GRULLAS"
                );


                colocarImagen(
                    grullasImage,
                    caras[0].box
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

                console.log(
                    "Cara 2 → LIBÉLULA"
                );


                colocarImagen(
                    libelulaImage,
                    caras[1].box
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

                console.log(
                    "Cara 3 → MARIPOSAS"
                );


                colocarImagen(
                    mariposasImage,
                    caras[2].box
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

                console.log(
                    "Cara 4 → PEZ"
                );


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
                "❌ ERROR DURANTE LA DETECCIÓN:"
            );

            console.error(
                error
            );

        }


        // ====================================================
        // SIGUIENTE FRAME
        // ====================================================

        requestAnimationFrame(
            detectarFrame
        );

    }


    // ========================================================
    // COMENZAR
    // ========================================================

    detectarFrame();

}


// ============================================================
// INICIAR PROGRAMA
// ============================================================

iniciar();
