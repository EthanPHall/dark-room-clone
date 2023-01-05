export class HandleForest{
    constructor(nextLink){
        this.nextLink = nextLink;
    }

    addNext(nextLink){
        this.nextLink = nextLink;
    }

    runLink(location){
        if(location.baseLocation.flavorName === "forest"){
            console.log("Forest!");
        }

        if(this.nextLink){
            this.nextLink.runLink(location);
        }
    }
}