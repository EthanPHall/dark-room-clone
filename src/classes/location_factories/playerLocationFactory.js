import playerLocation from "../../config/playerLocation.json";
import { Location } from "../location";

export class PlayerLocationFactory{
    getPlayer(mapSize){
        const newPlayer = new Location(playerLocation, Math.floor(mapSize/2), Math.floor(mapSize/2), 0);
        return newPlayer;
    }
}
