import { HouseLootFactory } from "./houseLootFactory";

export class LootFactory{
    constructor(rng){
        this.rng = rng;

        this.houseFactory = new HouseLootFactory();
    }

    getLoot(location, enemy){
        switch(location.baseLocation.flavorName){
            case "house":
                return this.houseFactory.getLoot(this.rng, enemy);
            default:
                return undefined;
        }
    }
}