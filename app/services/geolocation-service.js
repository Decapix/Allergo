const geolocation = require("@nativescript/geolocation");
const sqliteService = require("./sqlite-service");
const { calculateDistance, arePointsAligned } = require('./calcule');
  
class GeolocationService {
  constructor() {
    this.isTracking = false;
    this.currentTrajet = null;
    this.TIMEOUT_DURATION = 60000;
  }

  startTracking() {
    console.log('testTracking')
    geolocation.enableLocationRequest().then(() => {
      console.log('startTracking')

      this.isTracking = true;
      this.watchId = geolocation.watchLocation(
        (location) => {
          this.onLocationUpdate(location);
        },
        (error) => {
          console.log("Error: " + error.message);
        },
        {
          desiredAccuracy: 3,
          updateDistance: 10,
          minimumUpdateTime: 1000 * 5, 
        }
      );
    }, (error) => {
      // L'utilisateur a refusé les autorisations
      console.log('Location permissions denied: ', error);  // Affiche le message d'erreur dans la console

    });
  }





  stopTracking() {
    if (this.watchId) {
      geolocation.clearWatch(this.watchId);
      this.isTracking = false;
    }
  }

  onLocationUpdate(location) {
    this.resetTrajetTimeout();
    // Si c'est la première localisation ou il n'y a pas de trajet en cours, enregistrez-la simplement.
    if (!this.currentTrajet && !this.lastLocation) {
      this.lastLocation = location;
    } else if (!this.currentTrajet && this.lastLocation) {
      // S'il n'y a pas de trajet en cours mais qu'il y a une dernière localisation, vérifiez si l'utilisateur s'est déplacé.
      if (!this.isStationary(this.lastLocation, location)) {
        this.startTrajet(location);
        console.log("Début du trajet");
      }
    } else {
      // Si un trajet est en cours, mettez à jour le trajet avec la nouvelle localisation.
      this.updateTrajet(location);
    }
  }

  startTrajet(location) {
    // Assurez-vous d'ajouter le point précédent aussi pour marquer le début du mouvement.
    this.currentTrajet = {
      points: [this.lastLocation, location],
      startTime: new Date(this.lastLocation.timestamp || new Date()),
    };
    this.lastLocation = null; // Réinitialisez la dernière localisation pour le prochain trajet potentiel.
  }

  updateTrajet(location) {
    this.currentTrajet.points.push(location);
    console.log("déplacement");

    const lastLocation = this.currentTrajet.points[
      this.currentTrajet.points.length - 2
    ];
    if (this.isStationary(lastLocation, location)) {
      this.endTrajet();
    }
  }
  
  endTrajet() {
    if (this.currentTrajet) {
        console.log("endTrajet");
        this.currentTrajet.endTime = new Date();

        try {
            console.log("this.currentTrajet", this.currentTrajet);
            
            // Vérifier et optimiser le trajet
            let points = this.currentTrajet.points;
            let firstPoint = points[0];
            let lastPoint = points[points.length - 1];
            let distance = calculateDistance(firstPoint.latitude, firstPoint.longitude, lastPoint.latitude, lastPoint.longitude);

            if (distance >= 100) {
                // Optimisation des points si la distance est suffisante
                for (let i = 0; i < points.length - 2; ) {
                    if (arePointsAligned(points[i], points[i + 1], points[i + 2])) {
                        points.splice(i + 1, 1);
                    } else {
                        i++;
                    }
                }
                this.currentTrajet.points = points;
                sqliteService.insertTrajet(this.currentTrajet);
            } else {
                // Gérer les trajets trop courts ici
                console.log(`Trajet with id ${this.currentTrajet.id} is too short and will not be saved`);
                // Vous pouvez ici choisir d'enregistrer quand même, de notifier l'utilisateur, etc.
            }

        } catch (error) {
            console.log("Error when optimizing or inserting Trajet", error);
        }

        this.currentTrajet = null;
    }
    clearTimeout(this.trajetTimeout);
    this.trajetTimeout = null;
}



  isStationary(lastLocation, location) {
      let  distance = calculateDistance(
        lastLocation.latitude,
        lastLocation.longitude,
        location.latitude,
        location.longitude
      );
    return distance < 10;
  }

  resetTrajetTimeout() {
    console.log("resetTrajetTimeout")
    if (this.trajetTimeout) {
      clearTimeout(this.trajetTimeout);
    }
    this.trajetTimeout = setTimeout(() => {
      console.log("fin du décompte")
      this.endTrajet(); // mettre fin au trajet après le délai d'expiration
    }, this.TIMEOUT_DURATION);
  }

  
}

module.exports = new GeolocationService();