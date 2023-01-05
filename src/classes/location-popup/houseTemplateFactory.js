import houseTemplates from "../../config/locationTemplates/houseTemplates.json";

export class HouseTemplateFactory{
    getTemplate(rng){
        console.log(houseTemplates.length);
        return houseTemplates[Math.floor(rng() * houseTemplates.length)];
    }
}