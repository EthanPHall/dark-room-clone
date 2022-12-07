export class SeedLocationDistributors{
    
    /**
     * Distributes seed locations across the zones of a map as evenly
     * as possible. Where exactly in the zone the location ends up is
     * random.
     * @param {*} locations Array of location arrays 
     * @param {*} zones Zones to distribute evenly across
     * @param {*} map Map whose locations will be set
     * @param {*} rng Random number generator
     */
    evenDistribution(locations, zones, map, rng){
        let toVisit = [];
        
        function setToVisit(){
            toVisit = [];
            zones.forEach(zone => {
                toVisit.push(zone);
            });
        }

        setToVisit();

        locations.forEach(locationArray => {
            locationArray.forEach(location => {
                if(toVisit.length === 0){
                    setToVisit();
                }

                const zoneIndex = Math.floor(rng() * toVisit.length);
                const specificZone = toVisit[zoneIndex];
                toVisit.splice(zoneIndex, 1);

                const pointIndex = Math.floor(rng() * specificZone.points.length);
                const specificPoint = specificZone.points[pointIndex];

                location.x = specificPoint.x;
                location.y = specificPoint.y;
                location.distanceFromCenter = specificPoint.distance;

                map[location.y][location.x] = location;
            });            
        });

        console.log(locations);
    }
}