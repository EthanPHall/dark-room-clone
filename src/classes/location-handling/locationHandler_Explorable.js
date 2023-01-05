export class HandleExplorable{
    constructor(chain){
        this.nextLink = undefined;
        this.chain = chain;
    }

    addNext(nextLink){
        this.nextLink = nextLink;
    }

    runLink(location){
        if(location.explorableData){
            console.log("Explorable!");
            console.log(this.chain);

            if(this.chain.triggerLocationPopup){
                this.chain.triggerLocationPopup(location);
            }
        }

        if(this.nextLink){
            this.nextLink.runLink(location);
        }
    }
}