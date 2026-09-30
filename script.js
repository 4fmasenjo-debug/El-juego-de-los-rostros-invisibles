console.log("PRUEBA DE DETECCIÓN FACIAL");

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");


// ============================================================
// COMPROBAR FACE-API
// ============================================================

if (typeof faceapi === "undefined") {

    console.error("face-api.js NO está cargado.");

} else {

    console.log("face-api.js cargado correctamente.");

}



// ============================================================
// INICIO
// ============================================================

async function iniciar() {

    try {

        console.log("Cargando modelo...");


        await faceapi.nets.tinyFaceDetector.loadFromUri("./models");


        console.log("MODELO CARGADO.");


        video.addEventListener(
            "playing",
            iniciarVideo
        );


        video.src =
        "./video.mp4";


        video.load();


        await video.play();


    } catch(error){

        console.error("ERROR INICIAL:");
        console.error(error);

    }

}



// ============================================================
// VÍDEO LISTO
// ============================================================

function iniciarVideo(){

    console.log(
        "VÍDEO REPRODUCIÉNDOSE."
    );


    console.log(
        "Tamaño:",
        video.videoWidth,
        "x",
        video.videoHeight
    );


    canvas.width =
    video.videoWidth;


    canvas.height =
    video.videoHeight;


    detectar();

}



// ============================================================
// DETECCIÓN CONTINUA
// ============================================================

async function detectar(){


    console.log(
        "INICIANDO DETECCIÓN FACIAL."
    );


    const ctx =
    canvas.getContext("2d");



    setInterval(async()=>{


        const caras =
        await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({

                inputSize:128,

                scoreThreshold:0.3

            })
        );



        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );



        caras.forEach(cara=>{


            const box =
            cara.box;


            ctx.strokeStyle="red";

            ctx.lineWidth=3;


            ctx.strokeRect(

                box.x,
                box.y,
                box.width,
                box.height

            );


        });



        console.log(
            "CARAS DETECTADAS:",
            caras.length
        );


    },200);


}



// ============================================================
// ARRANCAR
// ============================================================

iniciar();
