const Sqlite = require("nativescript-sqlite");
const { calculateDistance, arePointsAligned } = require('./calcule');



class SqliteService {
  constructor() {
    this.db = new Sqlite("mydb");
    this.init();
  }

  init() {
    this.db.then((db) => {
      db.execSQL("CREATE TABLE IF NOT EXISTS trajets (id INTEGER PRIMARY KEY AUTOINCREMENT, points TEXT, startTime TEXT, endTime TEXT)");
    });
  }

  okok(){
    console.log('okok')
  }

  insertTrajet(trajet) {
    console.log("insert trajet try start");
    this.db.then((db) => {
      const points = JSON.stringify(trajet.points);
      const startTime = trajet.startTime.toISOString();
      const endTime = trajet.endTime.toISOString();
      db.execSQL("INSERT INTO trajets (points, startTime, endTime) VALUES (?, ?, ?)", [points, startTime, endTime]);
      console.log("insert trajet ok finish")
    });
  }

  async getAllTrajets() {
    try {
      const db = await this.db;
      const trajets = await db.all('SELECT * FROM trajets');
      console.log("Tous les trajets:", trajets);
      return trajets;
    } catch (error) {
      console.error("Failed to retrieve trajets:", error);
      return [];
    }
  }

  async clearTrajets() {
    try {
      await this.db.execSQL('DELETE FROM trajets');
      console.log('All trajets have been deleted');
    } catch (error) {
      console.error("Failed to clear trajets:", error);
    }
  }

  async deleteTrajetById(trajetId) {
    try {
        await this.db.execSQL('DELETE FROM trajets WHERE id = ?', [trajetId]);
        console.log(`Trajet with id ${trajetId} has been deleted`);
    } catch (error) {
        console.error("Failed to delete trajet:", error);
    }
  }



  async optimizeTrajet(trajetId) {
    try {
        const db = await this.db;
        const trajets = await db.all('SELECT points FROM trajets WHERE id = ?', [trajetId]);
        let points = JSON.parse(trajets[0].points);

        // Calculer la distance totale du trajet
        let firstPoint = points[0];
        let lastPoint = points[points.length - 1];
        let distance = calculateDistance(firstPoint.latitude, firstPoint.longitude, lastPoint.latitude, lastPoint.longitude);

         // Vérifier la distance et supprimer le trajet si nécessaire
         if (distance < 100) {
          await this.deleteTrajetById(trajetId);
          console.log(`Trajet with id ${trajetId} has been deleted due to insufficient distance`);
          return;
      }


        // Optimisation des points
        for (let i = 0; i < points.length - 2; ) {
            if (arePointsAligned(points[i], points[i + 1], points[i + 2])) {
                points.splice(i + 1, 1); // Supprime le point intermédiaire
            } else {
                i++;
            }
        }

        // Mettre à jour le trajet dans la base de données
        await db.execSQL('UPDATE trajets SET points = ? WHERE id = ?', [JSON.stringify(points), trajetId]);
        console.log(`Trajet with id ${trajetId} has been optimized`);
    } catch (error) {
        console.error("Failed to optimize trajet:", error);
    }
  }

}

module.exports = new SqliteService();
