import { HouseCombatantFactory } from "./houseCombatantFactory";

export class CombatantFactory{
    constructor(rng){
        this.rng = rng;

        this.houseFactory = new HouseCombatantFactory();
    }

    getCombatant(location){
        switch(location.baseLocation.flavorName){
            case "house":
                return this.houseFactory.getCombatant(this.rng);
            default:
                return undefined;
        }
    }
}