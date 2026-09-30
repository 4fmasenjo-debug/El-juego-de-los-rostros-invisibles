
console.log("INICIANDO EL JUEGO DE LOS ROSTROS INVISIBLES");

const video = document.getElementById("video");
const overlay = document.getElementById("overlay-elements");

let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;

let modeloCargado = false;
let deteccionActiva = false;
let procesando = false;

// Canvas pequeño utilizado SOLO para detectar las caras
const canvasDeteccion = document.createElement("canvas");
const ctxDeteccion = canvasDeteccion.getContext("2d", {
    willReadFrequently: true
});


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
        console.error("ERROR cargando imagen:", ruta);
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

        console.log("Cargando Tiny Face Detector...");

        await faceapi.nets.tinyFaceDetector.loadFromUri("./models");

        modeloCargado = true;

        console.log("Modelo cargado correctamente.");

        cargarImagenes();

        prepararVideo();

    } catch (error) {

        console.error("ERROR CARGANDO MODELO:");
        console.error(error);

    }

}


// ============================================================
// PREPARAR VÍDEO
// ============================================================

function prepararVideo() {

    console.log("Preparando vídeo.");

    console.log(
        "URL del vídeo:",
        video.currentSrc
    );

    console.log(
        "ReadyState:",
        video.readyState
    );


    video.addEventListener("loadedmetadata", function () {

        console.log(
            "METADATA DEL VÍDEO CARGADA:",
            video.videoWidth,
            "x",
            video.videoHeight
        );

        // Canvas de análisis pequeño
        canvasDeteccion.width = 320;
        canvasDeteccion.height = 240;

    });


    video.addEventListener("loadeddata", function () {

        console.log("DATOS DEL VÍDEO CARGADOS.");

    });


    video.addEventListener("canplay", function () {

        console.log("EL VÍDEO PUEDE REPRODUCIRSE.");

    });


    video.addEventListener("playing", function () {

        console.log("VÍDEO REPRODUCIÉNDOSE.");

        if (!deteccionActiva) {

            deteccionActiva = true;

            iniciarDeteccion();

        }

    });


    video.addEventListener("error", function () {

        console.error("ERROR DEL VÍDEO:");
        console.error(video.error);

    });


    video.load();


    video.play()

        .then(function () {

            console.log("PLAY EJECUTADO CORRECTAMENTE.");

        })

        .catch(function (error) {

            console.error("ERROR AL EJECUTAR PLAY:");
            console.error(error);

        });

}


// ============================================================
// DETECCIÓN FACIAL
// ============================================================

async function iniciarDeteccion() {

    console.log("INICIANDO DETECCIÓN FACIAL.");

    while (!video.paused && !video.ended) {

        if (!procesando) {

            procesando = true;

            try {

                // ------------------------------------------------
                // COPIAR EL VÍDEO A UN CANVAS PEQUEÑO
                // ------------------------------------------------

                ctxDeteccion.drawImage(
                    video,
                    0,
                    0,
                    320,
                    240
                );


                // ------------------------------------------------
                // DETECTAR CARAS EN EL CANVAS
                // ------------------------------------------------

                const detecciones = await faceapi.detectAllFaces(
                    canvasDeteccion,
                    new faceapi.TinyFaceDetectorOptions({
                        inputSize: 160,
                        scoreThreshold: 0.35
                    })
                );


                // ------------------------------------------------
                // ESCALAR LAS COORDENADAS
                // ------------------------------------------------

                const deteccionesEscaladas =
                    detecciones.map(function (deteccion) {

                        const box = deteccion.box;

                        return {
                            box: {
                                x: box.x * (video.clientWidth / 320),
                                y: box.y * (video.clientHeight / 240),
                                width: box.width * (video.clientWidth / 320),
                                height: box.height * (video.clientHeight / 240)
                            }
                        };

                    });


                // ------------------------------------------------
                // 4 O MÁS CARAS
                // ------------------------------------------------

                if (deteccionesEscaladas.length >= 4) {

                    colocarImagen(
                        grullasImage,
                        deteccionesEscaladas[0].box
                    );

                    colocarImagen(
                        libelulaImage,
                        deteccionesEscaladas[1].box
                    );

                    colocarImagen(
                        mariposasImage,
                        deteccionesEscaladas[2].box
                    );

                    colocarImagen(
                        pezImage,
                        deteccionesEscaladas[3].box
                    );

                } else {

                    ocultarImagenes();

                }

            } catch (error) {

                console.error(
                    "ERROR EN DETECCIÓN:"
                );

                console.error(error);

            }

            procesando = false;

        }


        // ------------------------------------------------
        // ESPERAR 300 ms
        // ------------------------------------------------

        await esperar(300);

    }

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
// ESPERA
// ============================================================

function esperar(ms) {

    return new Promise(function (resolve) {

        setTimeout(resolve, ms);

    });

}


// ============================================================
// INICIAR
// ============================================================

cargarModelo();

