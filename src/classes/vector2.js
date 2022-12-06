export class Vector2{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    distance(other){
        if(!(other instanceof Vector2)){
            return undefined;
        }

        return Math.sqrt((this.x - other.x)**2 + (this.y - other.y)**2);
    }

    clone(){
        return new Vector2(this.x, this.y);
    }
}