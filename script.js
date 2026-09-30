console.log("INICIANDO EL JUEGO DE LOS ROSTROS INVISIBLES");

const video = document.getElementById("video");
const overlay = document.getElementById("overlay-elements");

let grullasImage;
let libelulaImage;
let mariposasImage;
let pezImage;

let modeloCargado = false;
let deteccionIniciada = false;


// ============================================================
// COMPROBAR FACE-API
// ============================================================

if (typeof faceapi === "undefined") {

    throw new Error("face-api.js no está disponible.");

}

console.log("face-api.js cargado.");


// ============================================================
// CREAR IMÁGENES
// ============================================================

function crearImagen(ruta) {

    const imagen = document.createElement("img");

    imagen.src = ruta;

    imagen.style.position = "absolute";
    imagen.style.display = "none";
    imagen.style.pointerEvents = "none";
    imagen.style.zIndex = "10";

    overlay.appendChild(imagen);

    imagen.onload = () => {
        console.log("Imagen cargada:", ruta);
    };

    imagen.onerror = () => {
        console.error("No se pudo cargar:", ruta);
    };

    return imagen;
}


// ============================================================
// CARGAR MODELO
// ============================================================

async function iniciar() {

    try {

        console.log("Cargando Tiny Face Detector...");

        await faceapi.nets.tinyFaceDetector.loadFromUri("./models");

        modeloCargado = true;

        console.log("Modelo cargado correctamente.");

        grullasImage = crearImagen("./grullas.png");
        libelulaImage = crearImagen("./libelula.png");
        mariposasImage = crearImagen("./mariposas.png");
        pezImage = crearImagen("./pez.png");

        prepararVideo();

    } catch (error) {

        console.error("Error:", error);

    }

}


// ============================================================
// PREPARAR VÍDEO
// ============================================================

function prepararVideo() {

    console.log("Preparando vídeo.");

    video.addEventListener("loadedmetadata", () => {

        console.log(
            "Vídeo:",
            video.videoWidth,
            "x",
            video.videoHeight
        );

        video.play();

    }, { once: true });

    video.addEventListener("play", () => {

        if (deteccionIniciada) {
            return;
        }

        deteccionIniciada = true;

        console.log("Vídeo iniciado.");

        detectar();

    });

}


// ============================================================
// DETECCIÓN
// ============================================================

async function detectar() {

    while (!video.paused && !video.ended) {

        try {

            const ancho = video.clientWidth;
            const alto = video.clientHeight;

            const detecciones = await faceapi.detectAllFaces(
                video,
                new faceapi.TinyFaceDetectorOptions({
                    inputSize: 320,
                    scoreThreshold: 0.5
                })
            );

            const resultados = faceapi.resizeResults(
                detecciones,
                {
                    width: ancho,
                    height: alto
                }
            );

            console.log(
                "Rostros detectados:",
                resultados.length
            );

            if (resultados.length >= 4) {

                colocar(grullasImage, resultados[0].box);
                colocar(libelulaImage, resultados[1].box);
                colocar(mariposasImage, resultados[2].box);
                colocar(pezImage, resultados[3].box);

            } else {

                ocultarTodo();

            }

        } catch (error) {

            console.error("Error detectando rostros:", error);

        }

        await esperar(100);

    }

}


// ============================================================
// COLOCAR IMAGEN
// ============================================================

function colocar(imagen, box) {

    if (!imagen) {
        return;
    }

    imagen.style.display = "block";

    imagen.style.left = box.x + "px";
    imagen.style.top = box.y + "px";

    imagen.style.width = box.width + "px";
    imagen.style.height = box.height + "px";

}


// ============================================================
// OCULTAR
// ============================================================

function ocultarTodo() {

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

iniciar();


