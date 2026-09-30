
console.log("INICIANDO EL JUEGO DE LOS ROSTROS INVISIBLES");

const video = document.getElementById("video");
const overlay = document.getElementById("overlay-elements");

let grullasImage;
let libelulaImage;
let mariposasImage;
let pezImage;

let deteccionActiva = false;
let procesando = false;


// ============================================================
// COMPROBAR FACE-API
// ============================================================

if (typeof faceapi === "undefined") {
    console.error("face-api.js NO está disponible.");
    throw new Error("faceapi no está disponible.");
}

console.log("face-api.js cargado correctamente.");


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

        console.log("Modelo cargado correctamente.");

        cargarImagenes();

        prepararVideo();

    } catch (error) {

        console.error("ERROR CARGANDO EL MODELO:");
        console.error(error);

    }
}


// ============================================================
// PREPARAR VÍDEO
// ============================================================

function prepararVideo() {

    console.log("Preparando vídeo...");

    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    video.addEventListener("loadedmetadata", function () {

        console.log(
            "Vídeo:",
            video.videoWidth,
            "x",
            video.videoHeight
        );

    });


    video.addEventListener("playing", function () {

        console.log("Vídeo reproduciéndose.");

        if (!deteccionActiva) {

            deteccionActiva = true;

            iniciarDeteccion();

        }

    });


    video.addEventListener("pause", function () {

        console.log("Vídeo pausado.");

    });


    video.addEventListener("ended", function () {

        console.log("Vídeo terminado.");

    });


    video.addEventListener("error", function () {

        console.error("ERROR DEL VÍDEO:");
        console.error(video.error);

    });


    video.load();


    video.play()
        .then(function () {

            console.log("PLAY CORRECTO.");

        })
        .catch(function (error) {

            console.error("ERROR AL REPRODUCIR:");
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

                const detecciones = await faceapi.detectAllFaces(
                    video,
                    new faceapi.TinyFaceDetectorOptions({
                        inputSize: 160,
                        scoreThreshold: 0.35
                    })
                );


                console.log(
                    "Caras detectadas:",
                    detecciones.length
                );


                // ------------------------------------------------
                // SI HAY 4 O MÁS PERSONAS
                // ------------------------------------------------

                if (detecciones.length >= 4) {

                    const displayWidth = video.clientWidth;
                    const displayHeight = video.clientHeight;

                    const displaySize = {
                        width: displayWidth,
                        height: displayHeight
                    };


                    const resultados = faceapi.resizeResults(
                        detecciones,
                        displaySize
                    );


                    colocarImagen(
                        grullasImage,
                        resultados[0].box
                    );


                    colocarImagen(
                        libelulaImage,
                        resultados[1].box
                    );


                    colocarImagen(
                        mariposasImage,
                        resultados[2].box
                    );


                    colocarImagen(
                        pezImage,
                        resultados[3].box
                    );


                } else {

                    ocultarImagenes();

                }

            } catch (error) {

                console.error(
                    "ERROR DURANTE LA DETECCIÓN:"
                );

                console.error(error);

            }

            procesando = false;

        }


        // Esperar antes de volver a detectar
        await esperar(300);

    }

}


// ============================================================
// COLOCAR IMAGEN SOBRE EL ROSTRO
// ============================================================

function colocarImagen(img, box) {

    if (!img) {
        return;
    }

    img.style.display = "block";

    img.style.left = box.x + "px";
    img.style.top = box.y + "px";

    img.style.width = box.width + "px";
    img.style.height = box.height + "px";

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



