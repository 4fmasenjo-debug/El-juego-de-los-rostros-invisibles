console.log("=================================");
console.log("INICIANDO SCRIPT");
console.log("=================================");
console.log("URL:", window.location.href);
console.log("faceapi:", typeof faceapi);
if (typeof faceapi === "undefined") {
    console.error("face-api.js no se ha cargado.");
    throw new Error("faceapi no está disponible.");
}
console.log("face-api.js cargado correctamente.");
const video = document.getElementById("video");
const overlay = document.getElementById("overlay-elements");

let imagesAdded = false;

let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;


// ============================================================
// CARGAR MODELO
// ============================================================

async function cargarModelo() {

    try {

        console.log("Cargando Tiny Face Detector...");

        await faceapi.nets.tinyFaceDetector.loadFromUri("./models");

        console.log("Tiny Face Detector cargado correctamente.");

        iniciarWebcam();

    } catch (error) {

        console.error("Error cargando el modelo:");
        console.error(error);

    }

}


// ============================================================
// INICIAR WEBCAM
// ============================================================

async function iniciarWebcam() {

    try {

        console.log("Solicitando acceso a la webcam...");

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        video.srcObject = stream;

        console.log("Webcam iniciada.");

    } catch (error) {

        console.error("Error accediendo a la webcam:");
        console.error(error);

    }

}


// ============================================================
// VÍDEO
// ============================================================

video.addEventListener("play", () => {

    console.log("Vídeo iniciado.");

    const displaySize = {
        width: video.videoWidth || video.width,
        height: video.videoHeight || video.height
    };

    const canvas = faceapi.createCanvasFromMedia(video);

    overlay.appendChild(canvas);

    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";

    faceapi.matchDimensions(canvas, displaySize);


    setInterval(async () => {

        try {

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


            if (resizedDetections.length >= 4) {

                if (!imagesAdded) {

                    console.log(
                        "Cuatro o más personas detectadas. Añadiendo imágenes."
                    );

                    crearImagenes();

                    imagesAdded = true;

                }


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


            } else {

                ocultarImagenes();

                imagesAdded = false;

            }

        } catch (error) {

            console.error(
                "Error durante la detección:",
                error
            );

        }

    }, 100);

});


// ============================================================
// CREAR IMÁGENES
// ============================================================

function crearImagenes() {

    grullasImage = crearImagen("grullas.png");

    libelulaImage = crearImagen("libelula.png");

    mariposasImage = crearImagen("mariposas.png");

    pezImage = crearImagen("pez.png");

}


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

    overlay.appendChild(img);

    return img;

}


// ============================================================
// COLOCAR IMAGEN
// ============================================================

function colocarImagen(img, box) {

    if (!img || !box) {
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
// INICIAR
// ============================================================
cargarModelo();
