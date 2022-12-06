export class MapClass{
    constructor(){
    }
    
    generateBaseMap(zoneSize, zonesPerRow){
        this.unfinishedMap = [];


        return this;
    }

    generateZones(){
        this.zones = [];
        
        for(let x = 0; x < zonesPerRow; x++){
            for(let y = 0; y < zonesPerRow; y++){
                
            }
        }

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