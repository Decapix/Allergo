const geolocationService = require("./geolocation-service");
const sqliteService = require("./sqlite-service");



class HttpService {
  constructor() {
    this.serverUrl = "http://127.0.0.1:8000";
  }

  start() {
    // location in continue
    geolocationService.startTracking();


    
    // all hours we check if we are 19h or more
    setInterval(() => {
      const now = new Date();
      const hours = now.getHours();

      if (hours >= 19 && hours <= 23) {
        this.sendDataToServer();
      }
    }, 1000 * 60 * 60); // Check every hour
  }

  async sendDataToServer() {

    if (trajets.length === 0) {
      return;
    }

    try {
      const response = await fetch(this.serverUrl, {
        method: "POST",
        body: JSON.stringify({ trajets }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await sqliteService.clearTrajets();
      } else {
        console.log("Failed to send data to server. Will try again later.");
      }
    } catch (error) {
      console.log("Error sending data to server: ", error);
    }
  }
}

module.exports = new HttpService();
