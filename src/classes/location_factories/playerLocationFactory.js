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
            "weapons": [
                {name: "Fists", damage:1, cooldown: 1.5},
                {name: "Fists", damage:1, cooldown: 1.5},
                {name: "Fists", damage:1, cooldown: 1.5},
                {name: "Fists", damage:1, cooldown: 1.5},
                {name: "Fists", damage:1, cooldown: 1.5},
                {name: "Fists", damage:1, cooldown: 1.5},
            ],
            "icon": "@",    
        }
        newPlayer.inventory = {
            // "food-1" : {"flavorName": "food-1", "quantity": 9},
            // "food-2" : {"flavorName": "food-2", "quantity": 9},
            // "food-3" : {"flavorName": "food-3", "quantity": 9},
            // "food-4" : {"flavorName": "food-4", "quantity": 9},
            // "food-5" : {"flavorName": "food-5", "quantity": 9},
            // "food-6" : {"flavorName": "food-6", "quantity": 9},
            // "food-7" : {"flavorName": "food-7", "quantity": 9},
            // "food-8" : {"flavorName": "food-8", "quantity": 9},
            // "food-9" : {"flavorName": "food-9", "quantity": 9},
        };
        newPlayer.maxCapacity = 15;
        newPlayer.getCurrentWeight = function (){
            let currentWeight = 0;
            
            Object.keys(this.inventory).forEach((key) => {
                const weightMult = this.inventory[key].weight ? this.inventory[key].weight : 1;
                currentWeight += this.inventory[key].quantity * weightMult;
            }, 0);
    
            return currentWeight;
        }
    

        return newPlayer;
    }
}
