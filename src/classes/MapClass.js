import { BracketGenerator } from "./bracketGenerator";
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
        const bracketGenerator = new BracketGenerator();
        this.bracketedZones = bracketGenerator.generateBrackets(this.zones, factory.getDistanceBrackets());
        
        //Place the locations
        
        explorableLocations.forEach(locationArray => {
            if(!locationArray){
                return;
            }
            
            let validPositions = [];
            
            locationArray[0].baseLocation.distanceBrackets.forEach(value => {
                validPositions = validPositions.concat(this.bracketedZones[value]);
            });

            locationArray.forEach(location => {
                const position = validPositions[Math.floor(rng() * validPositions.length)];
                location.x = position.x;
                location.y = position.y;
                location.distance = position.distance;

                this.unfinishedMap[location.y][location.x] = location;
            });
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