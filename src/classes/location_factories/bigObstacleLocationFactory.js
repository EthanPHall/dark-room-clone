import obstacleLocation from "../../config/bigObstacle.json";
import { Location } from "../location";

export class BigObstacleLocationFactory{
    getObstacle(){
        const newPlayer = new Location(obstacleLocation, 0, 0, 0);
        return newPlayer;
    }
}
