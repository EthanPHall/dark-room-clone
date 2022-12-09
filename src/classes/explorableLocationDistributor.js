export class ExplorableLocationDistributor{
    /**
     * Distributes explorable locations completely randomly within their distance brackets
     * @param {*} explorableLocations Array of location arrays 
     * @param {*} bracketedZones Distance brackets to distribute randomly across
     * @param {*} map Map whose locations will be set
     * @param {*} rng Random number generator

     */
    randomDistributor(explorableLocations, bracketedZones, map, rng){
        explorableLocations.forEach(locationArray => {
            if(!locationArray){
                return;
            }
            
            let validPositions = [];
            
            locationArray[0].baseLocation.distanceBrackets.forEach(value => {
                validPositions = validPositions.concat(bracketedZones[value]);
            });

            locationArray.forEach(location => {
                const position = validPositions[Math.floor(rng() * validPositions.length)];
                location.x = position.x;
                location.y = position.y;
                location.distance = position.distance;

                map[location.y][location.x] = location;
            });
        });
    }
}