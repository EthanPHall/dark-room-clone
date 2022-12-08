import bgLocations from "../../config/bgLocations.json";
import { Location } from "../location";

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
        const backgrounds = [];

        bgLocations.forEach((bg, index) => {
            if(index === 0){
                return;
            }          
            
            const quota = Math.floor(bg.percentage * number);
            for(let i = 0; i < quota; i++){
                if(!backgrounds[index - 1]){
                    backgrounds[index - 1] = [];
                }

                backgrounds[index - 1][i] = new Location({...bg}, undefined, undefined, undefined);
            }
        });

        return backgrounds;
    }
}