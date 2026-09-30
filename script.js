console.log("INICIANDO EL JUEGO DE LOS ROSTROS INVISIBLES");

const video = document.getElementById("video");
const overlay = document.getElementById("overlay-elements");

let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;

let modeloCargado = false;
let deteccionIniciada = false;


// ============================================================
// COMPROBAR FACE-API
// ============================================================

if (typeof faceapi === "undefined") {

    throw new Error("faceapi no está disponible.");

}

console.log("face-api.js cargado.");


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

        console.log("Imagen cargada:", ruta);

    };

    img.onerror = function () {

        console.error("ERROR cargando:", ruta);

    };

    return img;
}


// ============================================================
// CARGAR IMÁGENES
// ============================================================

function cargarImagenes() {

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

    if (!video) {

        console.error("No existe #video.");

        return;

    }


    // --------------------------------------------------------
    // INFORMACIÓN DEL VÍDEO
    // --------------------------------------------------------

    console.log("URL del vídeo:", video.currentSrc);

    console.log("ReadyState:", video.readyState);


    // --------------------------------------------------------
    // EVENTOS
    // --------------------------------------------------------

    video.addEventListener("loadedmetadata", function () {

        console.log(
            "METADATA DEL VÍDEO CARGADA:",
            video.videoWidth,
            "x",
            video.videoHeight
        );

    });


    video.addEventListener("loadeddata", function () {

        console.log("DATOS DEL VÍDEO CARGADOS.");

    });


    video.addEventListener("canplay", function () {

        console.log("EL VÍDEO PUEDE REPRODUCIRSE.");

    });


    video.addEventListener("playing", function () {

        console.log("VÍDEO REPRODUCIÉNDOSE.");

        if (!deteccionIniciada) {

            deteccionIniciada = true;

            iniciarDeteccion();

        }

    });


    video.addEventListener("error", function () {

        console.error("ERROR DEL VÍDEO.");

        console.error(video.error);

    });


    // --------------------------------------------------------
    // FORZAR CARGA
    // --------------------------------------------------------

    video.load();


    // --------------------------------------------------------
    // INTENTAR REPRODUCIR
    // --------------------------------------------------------

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
// DETECCIÓN
// ============================================================

async function iniciarDeteccion() {

    console.log("INICIANDO DETECCIÓN FACIAL.");

    while (!video.paused && !video.ended) {

        try {

            const displaySize = {

                width: video.clientWidth,

                height: video.clientHeight

            };


            const detecciones = await faceapi.detectAllFaces(

                video,

                new faceapi.TinyFaceDetectorOptions({

                    inputSize: 160,

                    scoreThreshold: 0.5

                })

            );


            const resultados = faceapi.resizeResults(

                detecciones,

                displaySize

            );


            if (resultados.length >= 4) {

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
                "ERROR EN DETECCIÓN:",
                error
            );

        }


        await esperar(250);

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
// OCULTAR
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


