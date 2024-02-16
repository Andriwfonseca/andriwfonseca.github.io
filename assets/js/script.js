let started = false;
let interval;

const audio = $("#audio")[0];

function startTimer() {
    const timer = $("#timer");
    let minute = timer.text().split(":")[0];
    let second = timer.text().split(":")[1];

    if (!started) {
        started = true;

        if ("wakeLock" in navigator) {
            navigator.wakeLock
                .request("screen")
                .then((wakeLock) => {
                    console.log("Bloqueio de tela adquirido com sucesso!");

                    wakeLock.addEventListener("release", () => {
                        console.log("Bloqueio de tela foi liberado.");
                    });
                })
                .catch((error) => {
                    console.error("Erro ao solicitar bloqueio de tela:", error);
                });
        } else {
            console.warn("API WakeLock não suportada neste navegador.");
        }

        interval = setInterval(() => {
            if (started) {
                if (second > 0) {
                    second -= 1;
                } else {
                    if (minute > 0) {
                        minute -= 1;
                        second = 59;
                    } else {
                        callAlarm();
                    }
                }
            } else {
                second = 0;
            }

            timer.text(minute + ":" + second);
        }, 1000);
    }
}

function callAlarm() {
    clearInterval(interval);
    started = false;

    openModal();
}

function closeAlarm() {
    toBendBlind();

    $("#timer").text("15:00");

    closeModal();
}

function openModal() {
    $("#alarm").show();
    audio.play();
}

function closeModal() {
    $("#alarm").hide();
    audio.pause();
}

function pauseTimer() {
    clearInterval(interval);
    started = false;
}

function stopTimer() {
    clearInterval(interval);
    started = false;
    $("#timer").text("15:00");
}

function toBendBlind() {
    const blinds = $("#values-blinds");
    let smallBlind = blinds.text().split("/")[0];
    let bigBlind = blinds.text().split("/")[1];

    const newBlinds = smallBlind * 2 + "/" + bigBlind * 2;
    blinds.text(newBlinds);
}

function resetBlind() {
    const blinds = $("#values-blinds");
    blinds.text("25/50");
}

$(document).ready(function () {
    $("#alarm").hide();

    $(document).on("click", "#alarm", function () {
        closeAlarm();
    });
});
