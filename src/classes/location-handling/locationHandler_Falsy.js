export class HandleFalsy{
    constructor(){
        this.nextLink = undefined;
    }

    addNext(nextLink){
        this.nextLink = nextLink;
    }

    runLink(location){
        if(location && this.nextLink){
            this.nextLink.runLink(location);
        }
    }
}