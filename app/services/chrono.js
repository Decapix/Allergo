let startTime;
let intervalId;

function startChrono() {
    // Enregistrez l'heure de départ
    startTime = Date.now();
    // Lancez l'intervalle (mise à jour toutes les secondes)
    intervalId = setInterval(updateChrono, 1000);
}

function updateChrono() {
    // Calculez la durée écoulée en secondes
    let elapsedTime = (Date.now() - startTime) / 1000;
    // pour affichez le temps écoulé
    // console.log(formatTime(elapsedTime));
}

function formatTime(timeInSeconds) {
    let hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor((timeInSeconds % 3600) / 60);
    let seconds = Math.floor(timeInSeconds % 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function stopChrono() {
    clearInterval(intervalId);
}

function getElapsedSeconds() {

    console.log(((Date.now() - startTime) / 1000).toFixed(0));
    return ((Date.now() - startTime) / 1000).toFixed(0);
}


function resetChrono() {
    // Arrêtez le chrono s'il est en cours d'exécution
    if (intervalId) {
        clearInterval(intervalId);
    }
    // Réinitialisez l'heure de départ
    startTime = Date.now();
    // Redémarrez le chrono
    intervalId = setInterval(updateChrono, 1000);
}

// Pour démarrer le chrono, appelez la fonction startChrono
// startChrono();

// Pour arrêter le chrono, appelez la fonction stopChrono
// stopChrono();

// Pour obtenir le temps écoulé en secondes, appelez la fonction getElapsedSeconds
// let seconds = getElapsedSeconds();
// console.log(seconds + ' seconds');



// Exporter la nouvelle fonction avec les autres
module.exports = {
    startChrono,
    stopChrono,
    getElapsedSeconds,
    resetChrono  
};