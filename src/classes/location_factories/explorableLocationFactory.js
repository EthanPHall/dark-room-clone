import expLocations from "../../config/explorableLocations.json";
import { Location } from "../location";

export class ExplorableLocationFactory{
    constructor(){

    }

    getDistanceBrackets(){
        return expLocations[0].numberOfBrackets;
    }

    /**
     * Creates and returns an array of explorable location lists.
     * @param {*} number How many locations to return
     * @returns An array of arrays. The inner arrays each represent
     * lists of a specific explorable location.
     */
     getLocations(number){
        const locations = [];

        expLocations.forEach((location, index) => {
            if(index === 0){
                return;
            }          
            
            const quota = Math.floor(location.percentage * number);
            for(let i = 0; i < quota; i++){
                if(!locations[index - 1]){
                    locations[index - 1] = [];
                }

                locations[index - 1][i] = new Location({...location}, undefined, undefined, undefined);
            }
        });

        return locations;
    }
}