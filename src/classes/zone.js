import { Vector2 } from "./vector2";

export class Zone{
    constructor(){
    }

    setTopLeft(topLeft){
        this.topLeft = topLeft;

        return this;
    }

    generatePoints(size){
        this.points = [];
        this.size = size;

        for(let x = 0; x < size; x++){
            for(let y = 0; y < size; y++){
                this.points.push(new Vector2(x + this.topLeft.x, y + this.topLeft.y));
            }
        }

        return this;
    }

    calculateCenter(){
        this.center = new Vector2(this.size/2 + this.topLeft.x, this.size/2 + this.topLeft.y);

        return this;
    }

    calculateDistanceFromMapCenter(mapCenter){
        this.distance = this.center.distance(mapCenter);

        return this;
    }

    build(){
        return this;
    }
}