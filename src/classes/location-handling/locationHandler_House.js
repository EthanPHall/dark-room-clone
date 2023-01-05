export class HandleHouse{
    constructor(nextLink){
        this.nextLink = nextLink;
    }

    addNext(nextLink){
        this.nextLink = nextLink;
    }

    runLink(location){
        if(location.baseLocation.flavorName === "house"){
            console.log("House!");
        }

        if(this.nextLink){
            this.nextLink.runLink(location);
        }
    }
}