import { HouseScreenFactory } from "./houseScreenFactory";

export class ScreenFactory{
    constructor(rng){
        this.rng = rng;

        this.houseFactory = new HouseScreenFactory();
    }

    generateScreen(specification, location){
        switch(location.baseLocation.flavorName){
            case "house":
                return this.houseFactory.generateScreen(specification, this.rng);
            default:
                return undefined;
        }
    }
}