console.clear();

console.log("======================================");
console.log("EL JUEGO DE LOS ROSTROS INVISIBLES");
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

let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;


// ============================================================
// CANVAS
// ============================================================

let canvas = null;


// ============================================================
// CONTROL DE DETECCIÓN
// ============================================================

let detectando = false;

let ultimoResultado = [];

let vecesSinCara = 0;

const MAX_SIN_CARA = 3;


// ============================================================
// CREAR IMAGEN
// ============================================================

function crearImagen(ruta, nombre) {

    console.log(
        "Cargando imagen:",
        nombre
    );


    const img =
        document.createElement("img");


    img.src = ruta;

    img.alt = nombre;


    img.style.position = "absolute";

    img.style.display = "none";

    img.style.pointerEvents = "none";

    img.style.userSelect = "none";

    img.style.zIndex = "200";


    overlay.appendChild(img);


    img.onload = function () {

        console.log(
            "Imagen cargada:",
            nombre,
            img.naturalWidth,
            "x",
            img.naturalHeight
        );

    };


    img.onerror = function () {

        console.error(
            "ERROR CARGANDO:",
            nombre,
            ruta
        );

    };


    return img;
}


// ============================================================
// CARGAR IMÁGENES
// ============================================================

function cargarImagenes() {

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

    if (!imagen || !caja) {
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
// ACTUALIZAR IMÁGENES
// ============================================================

function actualizarImagenes(caras) {

    // --------------------------------------------------------
    // CARA 1
    // --------------------------------------------------------

    if (caras[0]) {

        mostrarImagen(
            grullasImage,
            caras[0].box
        );

    }


    // --------------------------------------------------------
    // CARA 2
    // --------------------------------------------------------

    if (caras[1]) {

        mostrarImagen(
            libelulaImage,
            caras[1].box
        );

    }


    // --------------------------------------------------------
    // CARA 3
    // --------------------------------------------------------

    if (caras[2]) {

        mostrarImagen(
            mariposasImage,
            caras[2].box
        );

    }


    // --------------------------------------------------------
    // CARA 4
    // --------------------------------------------------------

    if (caras[3]) {

        mostrarImagen(
            pezImage,
            caras[3].box
        );

    }


    // --------------------------------------------------------
    // OCULTAR SOLO DESPUÉS DE VARIOS FRAMES SIN CARAS
    // --------------------------------------------------------

    if (caras.length === 0) {

        vecesSinCara++;

    } else {

        vecesSinCara = 0;

    }


    if (
        vecesSinCara >= MAX_SIN_CARA
    ) {

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


        try {

            await video.play();

        } catch (error) {

            console.warn(
                "Autoplay bloqueado."
            );

        }


    } catch (error) {

        console.error(
            "ERROR CARGANDO MODELO:",
            error
        );

    }

}


// ============================================================
// INICIAR VÍDEO
// ============================================================

function iniciarVideo() {

    console.log(
        "VÍDEO REPRODUCIÉNDOSE"
    );


    console.log(
        "Tamaño:",
        video.videoWidth,
        "x",
        video.videoHeight
    );


    iniciarDeteccion();

}


// ============================================================
// INICIAR DETECCIÓN
// ============================================================

function iniciarDeteccion() {

    if (detectando) {
        return;
    }


    detectando = true;


    console.log(
        "INICIANDO DETECCIÓN ESTABLE"
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


    // --------------------------------------------------------
    // PRIMERA DETECCIÓN
    // --------------------------------------------------------

    detectarUnaVez();


    // --------------------------------------------------------
    // DETECTAR CADA 100 ms
    // --------------------------------------------------------

    setInterval(
        detectarUnaVez,
        100
    );

}


// ============================================================
// UNA DETECCIÓN
// ============================================================

async function detectarUnaVez() {

    if (
        video.paused ||
        video.ended ||
        video.readyState < 2
    ) {

        return;

    }


    try {

        const detecciones =
            await faceapi.detectAllFaces(

                video,

                new faceapi.TinyFaceDetectorOptions({

                    inputSize: 160,

                    scoreThreshold: 0.4

                })

            );


        const caras =
            faceapi.resizeResults(
                detecciones,
                {
                    width: video.videoWidth,
                    height: video.videoHeight
                }
            );


        // ----------------------------------------------------
        // ACTUALIZAR
        // ----------------------------------------------------

        actualizarImagenes(
            caras
        );


        // ----------------------------------------------------
        // GUARDAR ÚLTIMO RESULTADO
        // ----------------------------------------------------

        if (caras.length > 0) {

            ultimoResultado =
                caras;

        }


    } catch (error) {

        console.error(
            "Error en detección:",
            error
        );

    }

}


// ============================================================
// ARRANCAR
// ============================================================

iniciar();
