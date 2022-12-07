import bgLocations from "../config/bgLocations.json";
import { Location } from "./location";

export class BGLocationFactory{
    constructor(){

    }

    /**
     * Gets an instance of the first background location
     * defined in the bgLocation json file.
     */
    getBasicBg(x, y, distance){
        const newLocation = new Location(
            {...bgLocations[0]},
            x,
            y,
            distance
        );

        return newLocation; 
    }

    /**
     * Creates and returns an array of background location lists.
     * @param {*} number How many locations to return
     * @returns An array of arrays. The inner arrays each represent
     * lists of a specific background location.
     */
    getBackgrounds(number){
        const quotas = [];
        let actualNumber = 0;
        for(let i = 0; i < bgLocations.length; i++){
            const currentQuota = Math.floor(parseFloat(bgLocations[i].percentage) * number);
            quotas.push(currentQuota);
            actualNumber += currentQuota;
        }

        const allLocations = [];
        let currentBackground = bgLocations[1];
        let currentLocations = [];
        for(let i = 0; i < actualNumber; i++){
            const newLocation = new Location()
        }
    }
}