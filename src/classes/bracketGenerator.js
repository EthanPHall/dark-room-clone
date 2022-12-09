export class BracketGenerator{
    generateBrackets(zones, numberOfBrackets, distancesList = undefined){
        const allDistances = [];
        zones.forEach(zone => {
            if(allDistances.indexOf(zone.distance) === -1){
                allDistances.push(zone.distance);
            }
        });
        allDistances.sort((a,b) => a-b);

        const brackets = [];
        
        if(allDistances.length > numberOfBrackets){
            const distancesPerBracket = Math.floor(allDistances.length / numberOfBrackets);
            let overflow = allDistances.length % numberOfBrackets;
            for(let i = 0; i < numberOfBrackets; i++){
                brackets[i] = [];
                for(let j = 0; j < distancesPerBracket + (overflow > 0 ? 1 : 0); j++){
                    brackets[i].push(allDistances.shift());
                }
    
                overflow--;
            }
        }else{
            const leftOverBrackets = numberOfBrackets - allDistances.length;
            const originalDistancesLength = allDistances.length;
            for(let i = 0; i < originalDistancesLength; i++){
                brackets[i] = [];
                brackets[i].push(allDistances.shift());
            }
    
            for(let i = originalDistancesLength; i < originalDistancesLength+leftOverBrackets; i++){
                brackets[i] = brackets[i-1];
            }
        }
        
        //Map brackets, an array that hold arrays of distances, to an array that holds arrays of points.
        //TODO: Look into a more efficient way to do this. 
        const bracketedZones = brackets.map(bracket => {
            let newBracket = [];
            bracket.forEach(distance => {
                zones
                .filter(zone => zone.distance === distance)
                .forEach(zone2 => {
                    if(zone2){
                        newBracket = newBracket.concat(zone2.points);
                    }
                });
            });
    
            return newBracket;
        });

        return bracketedZones;
    }
}