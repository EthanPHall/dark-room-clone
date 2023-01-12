export class HandleHome{
    constructor(chain){
        this.nextLink = undefined;

        this.chain = chain;
    }

    addNext(nextLink){
        this.nextLink = nextLink;
    }

    runLink(location){
        let didRun = false;

        if(location.baseLocation.flavorName === "home" && this.chain.setMapRenderMode && this.chain.setBaseDefaultScreen){
            this.chain.setMapRenderMode("home base");
            this.chain.setBaseDefaultScreen("wasteland");
            didRun = true;
        }

        if(this.nextLink && !didRun){
            this.nextLink.runLink(location);
        }
    }
}