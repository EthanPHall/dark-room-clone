/** 
    * Holds basic info about a location, in addition to position
    * @class
    * @param {Object} baseLocation Basic info about the location, like symbol and name 
    * @param {number} x Initial x position
    * @param {number} y Initial y position
 */
 export class Location{
    constructor(baseLocation, x, y, distance){
        this.baseLocation = baseLocation;
        this.x = x;
        this.y = y;
        this.distanceFromCenter = distance;
    }

    compareBaseLocations(otherLocation){
        if(!(otherLocation instanceof Location)){
            return false;
        }

        const otherLocationObject = otherLocation.baseLocation;
        return Object.keys(this.baseLocation).reduce(
            (prev, key) => prev && this.baseLocation[key] === otherLocationObject[key], 
            true);
    }

    comparePositions(otherLocation){
        if(!(otherLocation instanceof Location)){
            return false;
        }

        return this.x === otherLocation.x && this.y === otherLocation.y;
    }

    getClone(){
        const result = new Location({...this.baseLocation}, this.x, this.y, this.distanceFromCenter);
        return result;
    }

    getFullClone(){
        //Make a new Location, then For each field in the original, copy that value to the new Location
        const result = new Location();
        Object.keys(this).forEach(key => {
            if(typeof this[key] === "object"){
                result[key] = {...this[key]};
            }else if (Array.isArray(this[key])){
                result[key] = [...this[key]];
            }else{
                result[key] = this[key];
            }
        });
        
        return result;
    }
}