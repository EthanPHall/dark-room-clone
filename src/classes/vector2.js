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

    compare(other){
        if(!(other instanceof Vector2)){
            return 0;
        }

        if(this.y < other.y){
            return -1;
        }else if (this.y > other.y){
            return 1;
        }else{
            if(this.x < other.x){
                return -1;
            }else if (this.x > other.x){
                return 1;
            }else{
                return 0;
            }
        }
    }
}