import { BigObstacleGenerator_Corner } from "./big-obstacle-generators/BOG_OneOfTheCorners";
import { BracketGenerator } from "./bracketGenerator";
import { ExplorableLocationDistributor } from "./explorableLocationDistributor";
import { BGLocationFactory } from "./location_factories/bgLocationFactory";
import { EndLocationFactory } from "./location_factories/endLocationFactory";
import { ExplorableLocationFactory } from "./location_factories/explorableLocationFactory";
import { HomeLocationFactory } from "./location_factories/homeLocationFactory";
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
        const distributor = new ExplorableLocationDistributor();
        distributor.randomDistributor(explorableLocations, this.bracketedZones, this.unfinishedMap, rng);

        return this;
    }

    generateBigObstacle(rng){
        const obstacleGenerator = new BigObstacleGenerator_Corner();
        this.endSpawnPoint = obstacleGenerator.generateBigObstacle(this, rng);        

        return this;
    }

    generateHome(){
        const factory = new HomeLocationFactory();
        const home = factory.getHome();

        const centerIndex = new Vector2(Math.floor(this.center.x), Math.floor(this.center.y));

        home.x = centerIndex.x;
        home.y = centerIndex.y;

        this.unfinishedMap[centerIndex.y][centerIndex.x] = home;
        
        return this;
    }
    
    generateEnd(){
        const factory = new EndLocationFactory();
        const end = factory.getEnd();
        end.x = this.endSpawnPoint.x;
        end.y = this.endSpawnPoint.y;
        
        this.unfinishedMap[this.endSpawnPoint.y][this.endSpawnPoint.x] = end;

        return this;
    }

    build(){
        this.finishedMap = this.unfinishedMap;
        this.unfinishedMap = undefined;
    }

    modify_AddFloatingLocations(percentage, zonesToExclude, rng){
        if(!this.finishedMap){
            return;
        }

        const zonesToConsider = this.bracketedZones.filter((zone, index) => {
            return !zonesToExclude.includes(index);
        });

        const pointsToConsider = zonesToConsider.reduce((prev, current) => {
            const explorableLocations = current.filter(point => this.finishedMap[point.y][point.x].explorableData);
            return prev.concat(explorableLocations);
        }, []);

        //TODO: Keep track of locations that have already been floated.
        const numberOfFloating = Math.ceil(percentage * pointsToConsider.length);
        for(let i = 0; i < numberOfFloating; i++){
            const pointToMakeFloat = pointsToConsider[Math.floor(rng() * pointsToConsider.length)];
            this.finishedMap[pointToMakeFloat.y][pointToMakeFloat.x].floating = true;
        }

        return this;
    }

    modify_Finish(){
        //Just meant to signify that modifying is done. Does no actual work currently.
    }
}