import blankLocation from "../../config/blankLocation.json";
import { Location } from "../location";

export class BlankLocationFactory{
    getBlank(){
        const blank = new Location(blankLocation, 0, 0, 0);
        return blank;
    }
}
