console.log("=================================");
console.log("EL JUEGO DE LOS ROSTROS INVISIBLES");
console.log("=================================");
console.log("URL:", window.location.href);

const video = document.getElementById("video");
const overlay = document.getElementById("overlay-elements");

let imagesAdded = false;

let grullasImage = null;
let libelulaImage = null;
let mariposasImage = null;
let pezImage = null;


// ============================================================
// COMPROBAR FACE-API
// ============================================================

if (typeof faceapi === "undefined") {

    console.error("ERROR: face-api.js NO está cargado.");
    console.error("Comprueba el <script> de face-api.js en index.html.");

} else {

    console.log("face-api.js detectado correctamente.");

    cargarModelo();
}


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

        console.error("ERROR CARGANDO EL MODELO:");
        console.error(error);

    }
}


// ============================================================
// WEBCAM
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

        console.error("ERROR ACCEDIENDO A LA WEBCAM:");
        console.error(error);

    }
}


// ============================================================
// CUANDO EL VÍDEO EMPIEZA
// ============================================================

video.addEventListener("play", () => {

    console.log("Vídeo iniciado.");

    const displaySize = {
        width: video.videoWidth || video.width,
        height: video.videoHeight || video.height
    };

    console.log("Tamaño del vídeo:", displaySize);


    // Crear canvas
    const canvas = faceapi.createCanvasFromMedia(video);

    overlay.appendChild(canvas);

    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.pointerEvents = "none";

    faceapi.matchDimensions(canvas, displaySize);


    // ========================================================
    // DETECCIÓN CONTINUA
    // ========================================================

    setInterval(async () => {

        try {

            const detections = await faceapi.detectAllFaces(
                video,
                new faceapi.TinyFaceDetectorOptions({
                    inputSize: 320,
                    scoreThreshold: 0.5
                })
            );


            const currentSize = {
                width: video.videoWidth || video.width,
                height: video.videoHeight || video.height
            };


            const resizedDetections =
                faceapi.resizeResults(
                    detections,
                    currentSize
                );


            // =================================================
            // CUATRO O MÁS ROSTROS
            // =================================================

            if (resizedDetections.length >= 4) {

                if (!imagesAdded) {

                    console.log(
                        "¡Cuatro o más personas detectadas!"
                    );

                    crearImagenes();

                    imagesAdded = true;
                }


                // ---------------------------------------------
                // GRULLAS
                // ---------------------------------------------

                colocarImagen(
                    grullasImage,
                    resizedDetections[0].box
                );


                // ---------------------------------------------
                // LIBÉLULA
                // ---------------------------------------------

                colocarImagen(
                    libelulaImage,
                    resizedDetections[1].box
                );


                // ---------------------------------------------
                // MARIPOSAS
                // ---------------------------------------------

                colocarImagen(
                    mariposasImage,
                    resizedDetections[2].box
                );


                // ---------------------------------------------
                // PEZ
                // ---------------------------------------------

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
                "ERROR DURANTE LA DETECCIÓN:",
                error
            );

        }

    }, 100);

});


// ============================================================
// CREAR IMÁGENES
// ============================================================

function crearImagenes() {

    grullasImage = crearImagen(
        "grullas.png"
    );

    libelulaImage = crearImagen(
        "libelula.png"
    );

    mariposasImage = crearImagen(
        "mariposas.png"
    );

    pezImage = crearImagen(
        "pez.png"
    );
}


// ============================================================
// CREAR UNA IMAGEN
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
// COLOCAR IMAGEN SOBRE EL ROSTRO
// ============================================================

function colocarImagen(img, box) {

    if (!img || !box) {
        return;
    }

    img.style.display = "block";

    img.style.left =
        `${box.x}px`;

    img.style.top =
        `${box.y}px`;

    img.style.width =
        `${box.width}px`;

    img.style.height =
        `${box.height}px`;
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
