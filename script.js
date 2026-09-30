console.log("INICIANDO EL JUEGO DE LOS ROSTROS INVISIBLES");
console.log("URL:", window.location.href);

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
// CREAR IMÁGENES
// ============================================================

function crearImagen(src) {

    const img = document.createElement("img");

    img.src = src;

    img.style.position = "absolute";
    img.style.zIndex = "10";
    img.style.pointerEvents = "none";
    img.style.display = "none";

    img.addEventListener("load", () => {
        console.log("Imagen cargada:", src);
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

        iniciarCamara();

    } catch (error) {

        console.error("Error cargando el modelo:", error);

    }
}


// ============================================================
// INICIAR CÁMARA
// ============================================================

async function iniciarCamara() {

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        video.srcObject = stream;

        video.addEventListener("loadedmetadata", () => {

            video.play();

            console.log(
                "Cámara iniciada:",
                video.videoWidth,
                "x",
                video.videoHeight
            );

        }, { once: true });

    } catch (error) {

        console.error("No se pudo acceder a la cámara:", error);

    }
}


// ============================================================
// DETECCIÓN
// ============================================================

video.addEventListener("play", () => {

    if (deteccionIniciada) {
        return;
    }

    if (!modelosCargados) {
        console.error("El modelo todavía no está cargado.");
        return;
    }

    deteccionIniciada = true;

    console.log("Iniciando detección facial.");

    detectarRostros();

});


// ============================================================
// DETECTAR ROSTROS
// ============================================================

async function detectarRostros() {

    const displaySize = {
        width: video.clientWidth,
        height: video.clientHeight
    };

    while (true) {

        try {

            if (video.readyState < 2) {
                await esperar(100);
                continue;
            }

            const detections = await faceapi.detectAllFaces(
                video,
                new faceapi.TinyFaceDetectorOptions({
                    inputSize: 320,
                    scoreThreshold: 0.5
                })
            );

            const resizedDetections = faceapi.resizeResults(
                detections,
                displaySize
            );

            console.log(
                "Rostros detectados:",
                resizedDetections.length
            );

            if (resizedDetections.length >= 4) {

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

            console.error("Error durante la detección:", error);

        }

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
// INICIO
// ============================================================

cargarModelo();
