import { Vector2 } from "./vector2";
import { Zone } from "./zone";

export class MapClass{
    constructor(){
    }
    
    generateZones(zoneSize, zonesPerRow){
        this.zones = [];
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
        this.unfinishedMap = [];
        


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
        return this;
    }
}