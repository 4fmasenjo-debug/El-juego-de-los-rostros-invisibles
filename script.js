console.log("=================================");
console.log("INICIANDO EL JUEGO DE LOS ROSTROS INVISIBLES");
console.log("=================================");


// ============================================================
// ELEMENTOS
// ============================================================

const video = document.getElementById("video");
const overlay = document.getElementById("overlay-elements");

let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;


// ============================================================
// COMPROBAR FACE-API
// ============================================================

console.log("Comprobando face-api.js...");

if (typeof faceapi === "undefined") {

    console.error("face-api.js no se ha cargado.");

    throw new Error("faceapi no está disponible.");

}

console.log("face-api.js cargado correctamente.");


// ============================================================
// CREAR IMAGEN
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

        console.log("Imagen cargada correctamente:", ruta);

    };

    img.onerror = function () {

        console.error("ERROR cargando imagen:", ruta);

    };

    return img;
}


// ============================================================
// CARGAR IMÁGENES
// ============================================================

function cargarImagenes() {

    console.log("Cargando imágenes...");

    grullasImage = crearImagen("./grullas.png");

    libelulaImage = crearImagen("./libelula.png");

    mariposasImage = crearImagen("./mariposas.png");

    pezImage = crearImagen("./pez.png");

}


// ============================================================
// CARGAR MODELO
// ============================================================

async function cargarModelo() {

    try {

        console.log("Cargando Tiny Face Detector...");

        await faceapi.nets.tinyFaceDetector.loadFromUri("./models");

        console.log("Tiny Face Detector cargado correctamente.");

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


    if (!video) {

        console.error("No existe el elemento #video.");

        return;

    }


    // --------------------------------------------------------
    // COMPROBAR QUE EL VÍDEO CARGA
    // --------------------------------------------------------

    video.addEventListener("loadedmetadata", function () {

        console.log(
            "Vídeo cargado:",
            video.videoWidth,
            "x",
            video.videoHeight
        );

    });


    video.addEventListener("error", function (error) {

        console.error("ERROR CARGANDO EL VÍDEO.");

        console.error(error);

    });


    // --------------------------------------------------------
    // CUANDO HAY DATOS SUFICIENTES
    // --------------------------------------------------------

    video.addEventListener("loadeddata", function () {

        console.log("Datos del vídeo cargados.");

        iniciarVideo();

    }, { once: true });


    // --------------------------------------------------------
    // POR SI EL VÍDEO YA ESTÁ CARGADO
    // --------------------------------------------------------

    if (video.readyState >= 2) {

        iniciarVideo();

    }

}


// ============================================================
// INICIAR VÍDEO
// ============================================================

async function iniciarVideo() {

    console.log("Iniciando vídeo...");

    try {

        await video.play();

        console.log("Vídeo reproduciéndose.");

        iniciarDeteccion();

    } catch (error) {

        console.error("No se pudo reproducir el vídeo:");

        console.error(error);

    }

}


// ============================================================
// INICIAR DETECCIÓN
// ============================================================

function iniciarDeteccion() {

    console.log("Iniciando detección facial...");

    detectarRostros();

}


// ============================================================
// DETECTAR ROSTROS
// ============================================================

async function detectarRostros() {

    while (!video.paused && !video.ended) {

        try {

            // ------------------------------------------------
            // TAMAÑO DEL VÍDEO EN PANTALLA
            // ------------------------------------------------

            const displaySize = {

                width: video.clientWidth,

                height: video.clientHeight

            };


            // ------------------------------------------------
            // DETECTAR CARAS
            // ------------------------------------------------

            const detections = await faceapi.detectAllFaces(

                video,

                new faceapi.TinyFaceDetectorOptions({

                    inputSize: 320,

                    scoreThreshold: 0.5

                })

            );


            // ------------------------------------------------
            // ADAPTAR COORDENADAS
            // ------------------------------------------------

            const resizedDetections = faceapi.resizeResults(

                detections,

                displaySize

            );


            console.log(
                "Rostros detectados:",
                resizedDetections.length
            );


            // ------------------------------------------------
            // 4 O MÁS ROSTROS
            // ------------------------------------------------

            if (resizedDetections.length >= 4) {

                console.log(
                    "Cuatro o más rostros detectados."
                );


                colocarImagen(

                    grullasImage,

                    resizedDetections[0].box

                );


                colocarImagen(

                    libelulaImage,

                    resizedDetections[1].box

                );


                colocarImagen(

                    mariposasImage,

                    resizedDetections[2].box

                );


                colocarImagen(

                    pezImage,

                    resizedDetections[3].box

                );

            }

            // ------------------------------------------------
            // MENOS DE 4 ROSTROS
            // ------------------------------------------------

            else {

                ocultarImagenes();

            }

        }

        catch (error) {

            console.error(
                "ERROR DURANTE LA DETECCIÓN:"
            );

            console.error(error);

        }


        await esperar(100);

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

    img.style.left = `${box.x}px`;

    img.style.top = `${box.y}px`;

    img.style.width = `${box.width}px`;

    img.style.height = `${box.height}px`;

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
// ESPERAR
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


