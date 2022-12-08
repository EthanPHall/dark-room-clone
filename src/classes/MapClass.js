import { BGLocationFactory } from "./location_factories/bgLocationFactory";
import { ExplorableLocationFactory } from "./location_factories/explorableLocationFactory";
import { expandArea } from "./location_growth/expandAreaManager";
import { SeedLocationDistributors } from "./seedLocationDistributors";
import { Vector2 } from "./vector2";
import { Zone } from "./zone";

export class MapClass{
    constructor(){
    }
    
    generateZones(zoneSize, zonesPerRow){
        this.zones = [];
        this.size = zoneSize * zonesPerRow;
        this.center = new Vector2(zoneSize*zonesPerRow/2, zoneSize*zonesPerRow/2);

        for(let y = 0; y < zonesPerRow; y++){
            for(let x = 0; x < zonesPerRow; x++){
                const newZone = new Zone();
                newZone.setTopLeft(new Vector2(x*zoneSize, y*zoneSize))
                    .generatePoints(zoneSize)
                    .calculateCenter()
                    .calculateDistanceFromMapCenter(this.center)
                    .build();
                this.zones.push(newZone);
            }
        }

        return this;
    }

    generateBaseMap(){
        if(!this.zones){
            return this;
        }
        
        this.unfinishedMap = this.zones.map((zone) => {
            return zone.points;
        });
        this.unfinishedMap = this.unfinishedMap.reduce((prev, current) => {
            return prev.concat(current);
        }, []);
        this.unfinishedMap.sort((a,b) => {
            return a.compare(b);
        });

        const factory = new BGLocationFactory();

        this.unfinishedMap = this.unfinishedMap.map(value => {
            return factory.getBasicBg(value.x, value.y, value.distance);
        });

        const tempMap = [];
        while(this.unfinishedMap.length > 0){
            const currentLocation = this.unfinishedMap.pop();

            if(!tempMap[currentLocation.y]){
                tempMap[currentLocation.y] = [];
            }

            tempMap[currentLocation.y][currentLocation.x] = currentLocation;
        } 

        this.unfinishedMap = tempMap;

        return this;
    }

    generateBGLocations(bgLocationsRatio, rng){
        //Get the seed locations
        const factory = new BGLocationFactory();
        const seedLocations = factory.getBackgrounds(this.size * bgLocationsRatio);

        //Distribute seed locations across zones
        const locationDistributor = new SeedLocationDistributors();
        locationDistributor.evenDistribution(seedLocations, this.zones, this.unfinishedMap, rng);

        //Grow the seed locations
        let expandedAreas = [];

        seedLocations.forEach((value) => {
            value.forEach((location) => {
                const area = expandArea(location, expandedAreas, rng);
                expandedAreas = expandedAreas.concat(area);
            });
        });

        expandedAreas.forEach(location => {
            if(!this.unfinishedMap[location.y] || !this.unfinishedMap[location.x]){
                return;
            }

            this.unfinishedMap[location.y][location.x] = location;
        });

        return this;
    }

    generateExplorableLocations(expLocationsRatio, rng){
        //Get the explorable locations
        const factory = new ExplorableLocationFactory();
        const explorableLocations = factory.getLocations(this.size * expLocationsRatio);

        //Create distance brackets
        const allDistances = [];
        this.zones.forEach(zone => {
            if(allDistances.indexOf(zone.distance) === -1){
                allDistances.push(zone.distance);
            }
        });
        allDistances.sort((a,b) => a-b);

        const numberOfBrackets = factory.getDistanceBrackets();
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
        
        //Map brackets, an array that hold arrays of distances, to an array that holds arrays of zones.
        //TODO: Look into a more efficient way to do this. 
        const bracketedZones = brackets.map(bracket => {
            const newBracket = [];
            bracket.forEach(distance => {
                this.zones
                .filter(zone => zone.distance === distance)
                .forEach(zone2 => {
                    if(zone2){
                        newBracket.push(zone2);
                    }
                });
            });

            return newBracket;
        });


        return this;
    }

    generateBigObstacle(){
        return this;
    }

    generateHome(){
        return this;
    }

    generateEnd(){
        return this;
    }

    build(){
        this.finishedMap = this.unfinishedMap;
        this.unfinishedMap = undefined;
    }
}