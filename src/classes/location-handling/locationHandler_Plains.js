export class HandlePlains{
    constructor(nextLink){
        this.nextLink = nextLink;
    }

    addNext(nextLink){
        this.nextLink = nextLink;
    }

    runLink(location){
        if(location.baseLocation.flavorName === "plains"){
            console.log("Plains!");
        }

        if(this.nextLink){
            this.nextLink.runLink(location);
        }
    }
}