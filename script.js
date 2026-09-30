console.log("INICIANDO EL JUEGO DE LOS ROSTROS INVISIBLES");
console.log("URL:", window.location.href);
// ============================================================
// ELEMENTOS
// ============================================================

const video = document.getElementById("video");
const overlay = document.getElementById("overlay-elements");
let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;
let modelosCargados = false;
let deteccionIniciada = false;
// ============================================================
// COMPROBAR FACE-API
// ============================================================

if (typeof faceapi === "undefined") {

    console.error("face-api.js no está disponible.");

    throw new Error("faceapi no está disponible.");

}

console.log("face-api.js cargado correctamente.");


// ============================================================
// CREAR IMAGEN
// ============================================================

function crearImagen(src) {

    const img = document.createElement("img");

    img.src = src;

    img.style.position = "absolute";
    img.style.zIndex = "10";
    img.style.pointerEvents = "none";
    img.style.display = "none";

    img.addEventListener("load", () => {

        console.log("Imagen cargada correctamente:", src);

    });

    img.addEventListener("error", () => {

        console.error("No se pudo cargar la imagen:", src);

    });

    overlay.appendChild(img);

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

    console.log("Imágenes preparadas.");

}


// ============================================================
// CARGAR MODELO
// ============================================================

async function cargarModelo() {

    try {

        console.log("Cargando Tiny Face Detector...");

        await faceapi.nets.tinyFaceDetector.loadFromUri("./models");

        modelosCargados = true;

        console.log("Tiny Face Detector cargado correctamente.");

        cargarImagenes();

        iniciarVideo();

    } catch (error) {

        console.error("Error cargando el modelo:");

        console.error(error);

    }

}


// ============================================================
// INICIAR VÍDEO
// ============================================================

function iniciarVideo() {

    console.log("Preparando vídeo...");

    if (!video) {

        console.error("No se encontró el elemento video.");

        return;

    }

    video.addEventListener("loadedmetadata", () => {

        console.log(
            "Vídeo cargado:",
            video.videoWidth,
            "x",
            video.videoHeight
        );

        video.play()
            .then(() => {

                console.log("Vídeo reproduciéndose.");

            })
            .catch(error => {

                console.error("No se pudo reproducir el vídeo:");

                console.error(error);

            });

    }, { once: true });

    video.addEventListener("error", () => {

        console.error("No se pudo cargar el vídeo.");

    });

}


// ============================================================
// CUANDO EL VÍDEO EMPIEZA A REPRODUCIRSE
// ============================================================

video.addEventListener("play", () => {

    console.log("El vídeo está reproduciéndose.");

    if (!modelosCargados) {

        console.error("El modelo todavía no está cargado.");

        return;

    }

    if (deteccionIniciada) {

        return;

    }

    deteccionIniciada = true;

    console.log("Iniciando detección facial.");

    detectarRostros();

});


// ============================================================
// DETECCIÓN FACIAL
// ============================================================

async function detectarRostros() {

    while (true) {

        try {

            if (video.readyState < 2) {

                await esperar(100);

                continue;

            }


            // ------------------------------------------------
            // TAMAÑO REAL DEL VÍDEO EN PANTALLA
            // ------------------------------------------------

            const displaySize = {

                width: video.clientWidth,

                height: video.clientHeight

            };


            // ------------------------------------------------
            // DETECTAR ROSTROS
            // ------------------------------------------------

            const detections = await faceapi.detectAllFaces(

                video,

                new faceapi.TinyFaceDetectorOptions({

                    inputSize: 320,

                    scoreThreshold: 0.5

                })

            );


            // ------------------------------------------------
            // ADAPTAR COORDENADAS AL TAMAÑO DEL VÍDEO
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
            // CUATRO O MÁS ROSTROS
            // ------------------------------------------------

            if (resizedDetections.length >= 4) {

                console.log("Hay cuatro o más rostros.");


                mostrarImagen(

                    grullasImage,

                    resizedDetections[0].box

                );


                mostrarImagen(

                    libelulaImage,

                    resizedDetections[1].box

                );


                mostrarImagen(

                    mariposasImage,

                    resizedDetections[2].box

                );


                mostrarImagen(

                    pezImage,

                    resizedDetections[3].box

                );


            } else {

                ocultarImagenes();

            }

        } catch (error) {

            console.error("Error durante la detección:");

            console.error(error);

        }


        // ------------------------------------------------
        // ESPERAR ANTES DE LA SIGUIENTE DETECCIÓN
        // ------------------------------------------------

        await esperar(100);

    }

}


// ============================================================
// MOSTRAR IMAGEN SOBRE EL ROSTRO
// ============================================================

function mostrarImagen(img, box) {

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
// ESPERA
// ============================================================

function esperar(ms) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}


// ============================================================
// INICIAR
// ============================================================

cargarModelo();
