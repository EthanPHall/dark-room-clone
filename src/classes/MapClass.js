import { BGLocationFactory } from "./bgLocationFactory";
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

    generateBGLocations(){
        return this;
    }

    generateExplorableLocations(){
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