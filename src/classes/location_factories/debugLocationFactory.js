import dbgLocations from "../../config/debugLocations.json";
import { Location } from "../location";

export class DebugLocationFactory{
    constructor(){

    }

    getLocation(x, y, index){
        const newLocation = new Location(
            {...dbgLocations[index]},
            x,
            y
        );

        return newLocation; 
    }
}