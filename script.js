
console.log("PRUEBA DE DETECCIÓN FACIAL");

const video = document.getElementById("video");


// ============================================================
// COMPROBAR FACE-API
// ============================================================

if (typeof faceapi === "undefined") {

    console.error("face-api.js NO está cargado.");

} else {

    console.log("face-api.js cargado correctamente.");

}


// ============================================================
// CARGAR MODELO
// ============================================================

async function iniciar() {

    try {

        console.log("Cargando modelo...");

        await faceapi.nets.tinyFaceDetector.loadFromUri(
            "./models"
        );

        console.log("MODELO CARGADO.");


        video.addEventListener(
            "playing",
            iniciarVideo
        );


        video.load();


        await video.play();


    } catch (error) {

        console.error(
            "ERROR INICIAL:"
        );

        console.error(error);

    }

}


// ============================================================
// VÍDEO
// ============================================================

function iniciarVideo() {

    console.log(
        "VÍDEO REPRODUCIÉNDOSE."
    );


    if (video.videoWidth === 0) {

        console.error(
            "El vídeo todavía no tiene imagen."
        );

        return;

    }


    console.log(
        "Tamaño:",
        video.videoWidth,
        "x",
        video.videoHeight
    );


    // Esperar 2 segundos antes de detectar

    setTimeout(
        detectar,
        2000
    );

}


// ============================================================
// DETECTAR
// ============================================================

async function detectar() {

    console.log(
        "COMIENZA detectAllFaces..."
    );


    try {

        const resultado =
            await faceapi.detectAllFaces(
                video,
                new faceapi.TinyFaceDetectorOptions({

                    inputSize: 128,

                    scoreThreshold: 0.3

                })
            );


        console.log(
            "DETECCIÓN TERMINADA."
        );


        console.log(
            "CARAS:",
            resultado.length
        );


    } catch (error) {

        console.error(
            "ERROR EN detectAllFaces:"
        );

        console.error(error);

    }

}


// ============================================================
// INICIAR
// ============================================================

iniciar();

