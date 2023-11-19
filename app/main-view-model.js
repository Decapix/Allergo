import { Observable } from '@nativescript/core'
/* import * as geolocation from '@nativescript/geolocation';
import { CoreTypes } from '@nativescript/core' //   to describe at what accuracy the location should get
const appSettings = require("@nativescript/core/application-settings"); */



function getMessage(counter) {
  if (counter <= 0) {
    return 'Hoorraaay! You unlocked the NativeScript clicker achievement!'
  } else {
    return `${counter} taps left`
  }
}
export function createViewModel() {
  const viewModel = new Observable()
  viewModel.counter = 42
  viewModel.message = getMessage(viewModel.counter)

  viewModel.onTap = () => {
    viewModel.counter--
    console.log("appuyer")
    viewModel.set('message', getMessage(viewModel.counter))
  }
  /* geolocation.enableLocationRequest().then(() => {

  const marge = 0.000045// 5 meters in degrees approximately

  function distanceFromPointToLine(point, linePoint1, linePoint2) {
    const A = (linePoint1.longitude - linePoint2.longitude);
    const B = (linePoint2.latitude - linePoint1.latitude);
    const C = (linePoint1.latitude*linePoint2.longitude - linePoint2.latitude*linePoint1.longitude);
    return Math.abs(A*point.latitude + B*point.longitude + C) / Math.sqrt(A*A + B*B);
}

function processJourney(currentJourney) {
    let simplifiedJourney = [...currentJourney];  // Copie de currentJourney
    let i = 0;
    
    while (i + 2 < simplifiedJourney.length) {
        const point1 = simplifiedJourney[i];
        const point2 = simplifiedJourney[i + 1];
        const point3 = simplifiedJourney[i + 2];
        
        const distance = distanceFromPointToLine(point2, point1, point3);
        
        if (distance <= marge) {  // 5 meters in degrees approximately
            simplifiedJourney.splice(i + 1, 1);  // Supprimer le point du milieu
        } else {
            i++;  // Avancer à la prochaine position
        }
    }
    
    return simplifiedJourney;
}

  console.log("check commence ");
  let stationaryStartTime = null;
const STATIONARY_THRESHOLD = 1 * 20 * 1000;  // 5 minutes 5 * 60 * 1000;

let previousLocation = null;
let currentJourney = [];
let allJourneys = [];

const MIN_DISTANCE = 100;  // distance minimale en mètres pour considérer un nouveau trajet
const MAX_TIME = 10 * 60 * 1000; 

// appSettings.setArray("rray", allJourneys);
// const username = appSettings.getString("username"); 
console.log("okok");



const watchId = geolocation.watchLocation(
    location => {
        let now = new Date();
        if (previousLocation) {
            let distance = geolocation.distance(previousLocation, location);
            if (distance < 5) {  // 5 meters, considéré comme immobile
              console.log("immobile")
                if (stationaryStartTime === null) {
                    stationaryStartTime = now;
                }
                if (now - stationaryStartTime >= STATIONARY_THRESHOLD) {
                    // L'utilisateur est immobile depuis au moins 5 minutes
                    console.log("immobile depuis 5 minute ")
                    if (currentJourney.length > 0) {
                        console.log("un trajet", currentJourney)
                        console.log("trajet concis", processJourney(currentJourney) )
                        allJourneys.push(processJourney(currentJourney));
                        // a renvoyer dans alljourney le trajet optimisé
                        currentJourney = [];
                    }
                    stationaryStartTime = null;  // réinitialise le temps immobile
                }
            } else {
                stationaryStartTime = null;  // réinitialise le temps immobile si l'utilisateur se déplace
            }
            currentJourney.push({ latitude: location.latitude, longitude: location.longitude, time: now });
            console.log("un nouveau deplacement", { latitude: location.latitude, longitude: location.longitude, time: now })
        }
        previousLocation = { latitude: location.latitude, longitude: location.longitude, time: now };
    },
    error => {
        console.error(error);
    },
    {
      desiredAccuracy: CoreTypes.Accuracy.high,
      maximumAge: 5,
      updateDistance: 1,
      // iosAllowsBackgroundLocationUpdates: true, 
    }
);
  } 
  
  );

  */
  return viewModel
}

