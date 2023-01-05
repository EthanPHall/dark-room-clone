export class HandleTundra{
    constructor(nextLink){
        this.nextLink = nextLink;
    }

    addNext(nextLink){
        this.nextLink = nextLink;
    }

    runLink(location){
        if(location.baseLocation.flavorName === "tundra"){
            console.log("Tundra!");
        }

        if(this.nextLink){
            this.nextLink.runLink(location);
        }
    }
}