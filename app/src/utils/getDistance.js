function getDistance(pointer1, pointer2) {
    // console.log(pointer1);
    // console.log(pointer2);
    // Convert latitude and longitude from degrees to radians
    const lat1 = toRadians(pointer1.latitude);
    const lon1 = toRadians(pointer1.longitude);
    const lat2 = toRadians(pointer2.latitude);
    const lon2 = toRadians(pointer2.longitude);

    // Haversine formula
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;
    const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const radiusOfEarth = 6371;  // Earth radius in kilometers, change to 3959 for miles

    // Calculate the distance
    const distance = radiusOfEarth * c;
    return distance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

export default getDistance;
// const lat1 = 22.166656, lon1 = 76.862517;  // San Francisco coordinates
// const lat2 = 22.157000, lon2 = 76.876171;  // Los Angeles coordinates

// const distance = getDistance({ latitute: lat1, longitute: lon1 }, { latitute: lat2, longitute: lon2 });
// console.log(`The distance between the two points is ${distance.toFixed(2)*1000} m.`);
