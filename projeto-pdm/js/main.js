// registrando o service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      let reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
      console.log('Service worker registrado! 😎', reg);
    } catch (err) {
      console.log('😢 Service worker registro falhou: ', err);
    }
  });
}

// CAMERA
var constraints = { video: { facingMode: "user" }, audio: false };

function toggleCamera() {
  constraints.video.facingMode =
    constraints.video.facingMode === "user" ? "environment" : "user";
}

const cameraView = document.querySelector("#camera-view"),
  cameraOutput = document.querySelector("#camera-output"),
  cameraSensor = document.querySelector("#camera-sensor"),
  cameraTrigger = document.querySelector("#camera-trigger"),
  trocarCam = document.querySelector("#camera-change");

function cameraStart() {
  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      cameraView.srcObject = stream;
    })
    .catch(error => console.error("Ocorreu um erro.", error));
}

cameraTrigger.onclick = function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraOutput.classList.add("taken");
};

trocarCam.onclick = function () {
  toggleCamera();

  let stream = cameraView.srcObject;
  if (stream) stream.getTracks().forEach(t => t.stop());

  cameraStart();
}

window.addEventListener("load", cameraStart);
