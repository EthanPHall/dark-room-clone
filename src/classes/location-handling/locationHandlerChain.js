import { HandleExplorable } from "./locationHandler_Explorable";
import { HandleFalsy } from "./locationHandler_Falsy";
import { HandleForest } from "./locationHandler_Forest";
import { HandleHome } from "./locationHandler_Home";
import { HandleHouse } from "./locationHandler_House";
import { HandlePlains } from "./locationHandler_Plains";
import { HandleTundra } from "./locationHandler_Tundra";

export class LocationHandlerChain{
    constructor(){
        this.chainHead = new HandleTundra();
        this.currentLink = this.chainHead;

        this.addLink(new HandleFalsy());

        this.addLink(new HandleForest());
        this.addLink(new HandlePlains());
        this.addLink(new HandleHouse());

        this.addLink(new HandleExplorable(this));
        
        this.addLink(new HandleHome(this));
    }

    addLink(newLink){
        this.currentLink.addNext(newLink);
        this.currentLink = newLink;
    }

    runChain(location){
        if(location instanceof String){
            console.log(location);
            return;
        }

        this.chainHead.runLink(location);
    }
}