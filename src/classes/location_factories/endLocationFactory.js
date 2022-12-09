import endLocation from "../../config/endLocation.json";
import { Location } from "../location";

export class EndLocationFactory{
    getEnd(){
        const newEnd = new Location(endLocation, 0, 0, 0);
        return newEnd;
    }
}
