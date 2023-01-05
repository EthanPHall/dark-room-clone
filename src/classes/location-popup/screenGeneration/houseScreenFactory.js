import houseIntroContents from "../../../config/introContents/houseIntroContents.json";

export class HouseScreenFactory{
    generateScreen(specification, rng){
        const screen = {};

        screen.type = specification.type;
        
        switch(screen.type){
            case "intro":
                console.log(specification);
                screen.content = houseIntroContents[Math.floor(rng() * houseIntroContents.length)];
                break;
        }

        return screen;
    }
}