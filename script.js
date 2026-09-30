console.log("INICIANDO EL JUEGO DE LOS ROSTROS INVISIBLES");

const video = document.getElementById("video");
const overlay = document.getElementById("overlay-elements");

let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;

let deteccionActiva = false;
let procesando = false;


// ============================================================
// CANVAS PEQUEÑO PARA EL ANÁLISIS
// ============================================================

const canvasDeteccion = document.createElement("canvas");

canvasDeteccion.width = 320;
canvasDeteccion.height = 240;

const ctx = canvasDeteccion.getContext("2d");


// ============================================================
// COMPROBAR FACE-API
// ============================================================

if (typeof faceapi === "undefined") {

    throw new Error("faceapi no está disponible.");

}

console.log("face-api.js cargado.");


// ============================================================
// CREAR IMÁGENES
// ============================================================

function crearImagen(ruta) {

    const img = document.createElement("img");

    img.src = ruta;

    img.style.position = "absolute";
    img.style.zIndex = "10";
    img.style.pointerEvents = "none";
    img.style.display = "none";

    overlay.appendChild(img);

    img.onload = function () {

        console.log("Imagen cargada:", ruta);

    };

    img.onerror = function () {

        console.error(
            "ERROR cargando imagen:",
            ruta
        );

    };

    return img;
}


function cargarImagenes() {

    grullasImage = crearImagen("./grullas.png");

    libelulaImage = crearImagen("./libelula.png");

    mariposasImage = crearImagen("./mariposas.png");

    pezImage = crearImagen("./pez.png");

    console.log("Imágenes cargadas.");

}


// ============================================================
// CARGAR MODELO
// ============================================================

async function cargarModelo() {

    try {

        console.log(
            "Cargando Tiny Face Detector..."
        );

        await faceapi.nets.tinyFaceDetector.loadFromUri(
            "./models"
        );

        console.log(
            "Modelo cargado correctamente."
        );

        cargarImagenes();

        prepararVideo();

    } catch (error) {

        console.error(
            "ERROR CARGANDO MODELO:"
        );

        console.error(error);

    }

}


// ============================================================
// PREPARAR VÍDEO
// ============================================================

function prepararVideo() {

    console.log(
        "Preparando vídeo."
    );

    console.log(
        "URL del vídeo:",
        video.currentSrc
    );

    video.addEventListener(
        "loadedmetadata",
        function () {

            console.log(
                "METADATA DEL VÍDEO CARGADA:",
                video.videoWidth,
                "x",
                video.videoHeight
            );

        }
    );


    video.addEventListener(
        "playing",
        function () {

            console.log(
                "VÍDEO REPRODUCIÉNDOSE."
            );

            if (!deteccionActiva) {

                deteccionActiva = true;

                iniciarDeteccion();

            }

        }
    );


    video.addEventListener(
        "error",
        function () {

            console.error(
                "ERROR DEL VÍDEO:"
            );

            console.error(
                video.error
            );

        }
    );


    video.load();


    video.play()
        .then(function () {

            console.log(
                "PLAY EJECUTADO CORRECTAMENTE."
            );

        })
        .catch(function (error) {

            console.error(
                "ERROR AL EJECUTAR PLAY:"
            );

            console.error(error);

        });

}


// ============================================================
// DETECCIÓN
// ============================================================

async function iniciarDeteccion() {

    console.log(
        "INICIANDO DETECCIÓN FACIAL."
    );


    while (
        !video.paused &&
        !video.ended
    ) {

        if (!procesando) {

            procesando = true;

            analizarFotograma();

        }

        await esperar(500);

    }

}


// ============================================================
// ANALIZAR UN FOTOGRAMA
// ============================================================

async function analizarFotograma() {

    try {

        // Copiar vídeo al canvas pequeño

        ctx.drawImage(
            video,
            0,
            0,
            320,
            240
        );


        console.log(
            "Analizando fotograma..."
        );


        const detecciones =
            await faceapi.detectAllFaces(
                canvasDeteccion,
                new faceapi.TinyFaceDetectorOptions({

                    inputSize: 128,

                    scoreThreshold: 0.3

                })
            );


        console.log(
            "Caras detectadas:",
            detecciones.length
        );


        const escalaX =
            video.clientWidth / 320;

        const escalaY =
            video.clientHeight / 240;


        const resultados =
            detecciones.map(
                function (deteccion) {

                    const box =
                        deteccion.box;

                    return {

                        x: box.x * escalaX,

                        y: box.y * escalaY,

                        width:
                            box.width * escalaX,

                        height:
                            box.height * escalaY

                    };

                }
            );


        // ====================================================
        // CUATRO CARAS
        // ====================================================

        if (resultados.length >= 4) {

            colocarImagen(
                grullasImage,
                resultados[0]
            );

            colocarImagen(
                libelulaImage,
                resultados[1]
            );

            colocarImagen(
                mariposasImage,
                resultados[2]
            );

            colocarImagen(
                pezImage,
                resultados[3]
            );

        } else {

            ocultarImagenes();

        }


    } catch (error) {

        console.error(
            "ERROR DETECTANDO CARAS:"
        );

        console.error(error);

    }


    procesando = false;

}


// ============================================================
// COLOCAR IMAGEN
// ============================================================

function colocarImagen(img, box) {

    if (!img) {
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
// ESPERA
// ============================================================

function esperar(ms) {

    return new Promise(
        function (resolve) {

            setTimeout(
                resolve,
                ms
            );

        }
    );

}


// ============================================================
// INICIAR
// ============================================================

cargarModelo();

