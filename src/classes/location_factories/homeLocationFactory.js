import homeLocation from "../../config/homeLocation.json";
import { Location } from "../location";

export class HomeLocationFactory{
    getHome(){
        const newPlayer = new Location(homeLocation, 0, 0, 0);
        return newPlayer;
    }
}
