import playerLocation from "../../config/playerLocation.json";
import { Location } from "../location";

export class PlayerLocationFactory{
    getPlayer(mapSize){
        const newPlayer = new Location(playerLocation, Math.floor(mapSize/2), Math.floor(mapSize/2), 0);
        newPlayer.isPlayer = true;
        newPlayer.combatantStats = {
            "hp": 5,
            "hpMax": 5,
            "damage": 1,
            "attackDelay": 1,
            "numberOfAttacks": 1,
            "icon": "@",    
        }

        return newPlayer;
    }
}
