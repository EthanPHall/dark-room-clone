import { HouseTemplateFactory } from "./houseTemplateFactory";

export class LocationPopupTemplateFatory{
    constructor(rng){
        this.rng = rng;

        this.houseFactory = new HouseTemplateFactory();
    }

    getTemplate(location){
        console.log(location);
        
        switch(location.baseLocation.flavorName){
            case "house":
                return this.houseFactory.getTemplate(this.rng);
            default:
                return undefined;
        }
    }
}