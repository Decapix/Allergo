 function  calculateDistance(lat1, lon1, lat2, lon2) {
    function toRadians(degrees) {
      return degrees * Math.PI / 180;
    }
  
    var R = 6371e3; // metres
    var φ1 = toRadians(lat1);
    var φ2 = toRadians(lat2);
    var Δφ = toRadians(lat2 - lat1);
    var Δλ = toRadians(lon2 - lon1);
  
    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    var distance = R * c; // in metres
    return distance;
  }


function calculatePerpendicularDistance(p1, p2, p3) {
// Calculer la distance perpendiculaire du point p2 par rapport à la ligne formée par p1 et p3.
let distanceLine = calculateDistance(p1.latitude, p1.longitude, p3.latitude, p3.longitude);
let area = Math.abs(0.5 * (p1.latitude * (p2.longitude - p3.longitude) + p2.latitude * (p3.longitude - p1.longitude) + p3.latitude * (p1.longitude - p2.longitude)));
return (2 * area) / distanceLine;
}

 function arePointsAligned(p1, p2, p3, margin = 5) {
let distance = calculatePerpendicularDistance(p1, p2, p3);
return distance <= margin;
}
  
module.exports = {
  calculateDistance,
  arePointsAligned,
  // d'autres fonctions
};
