import { BigObstacleLocationFactory } from "../location_factories/bigObstacleLocationFactory";
import { ExpandAreaConnect } from "../location_growth/expandAreaConnect";
import { Vector2 } from "../vector2";

export class BigObstacleGenerator_Corner{
    generateBigObstacle(mapObject, rng){
        //Get the corner zones
        const furthestBracket = mapObject.bracketedZones[mapObject.bracketedZones.length - 1];
        const longestDistance = furthestBracket[furthestBracket.length - 1].distance;
        const cornerZones = mapObject.zones.filter(zone => zone.distance === longestDistance);
        
        //Choose which one to use
        const cornerToUse = cornerZones[Math.floor(rng() * cornerZones.length)];
        
        //Figure out which positions to use
        const topLeft = cornerToUse.topLeft;
        let point1;
        let point2;
        let point3;
        let finalSpawn;
        if(topLeft.x === 0 && topLeft.y === 0){
            //Top left
            point1 = new Vector2(topLeft.x + cornerToUse.size - 1, topLeft.y);
            point2 = new Vector2(topLeft.x, topLeft.y + cornerToUse.size - 1);
            point3 = new Vector2(topLeft.x + cornerToUse.size - 1, topLeft.y + cornerToUse.size - 1);
            finalSpawn = new Vector2(topLeft.x, topLeft.y);
        }else if(topLeft.x > topLeft.y){
            //Top right
            point1 = new Vector2(topLeft.x, topLeft.y);
            point2 = new Vector2(topLeft.x + cornerToUse.size - 1, topLeft.y + cornerToUse.size - 1);
            point3 = new Vector2(topLeft.x, topLeft.y + cornerToUse.size - 1);
            finalSpawn = new Vector2(topLeft.x + cornerToUse.size - 1, topLeft.y);
        }else if (topLeft.x < topLeft.y){
            //Bottom right
            point1 = new Vector2(topLeft.x + cornerToUse.size - 1, topLeft.y);
            point2 = new Vector2(topLeft.x, topLeft.y + cornerToUse.size - 1);
            point3 = new Vector2(topLeft.x, topLeft.y);
            finalSpawn = new Vector2(topLeft.x + cornerToUse.size - 1, topLeft.y + cornerToUse.size - 1);
        }else{
            //Bottom left
            point1 = new Vector2(topLeft.x, topLeft.y);
            point2 = new Vector2(topLeft.x + cornerToUse.size - 1, topLeft.y + cornerToUse.size - 1);
            point3 = new Vector2(topLeft.x + cornerToUse.size - 1, topLeft.y);
            finalSpawn = new Vector2(topLeft.x, topLeft.y + cornerToUse.size - 1);
        }

        //Draw line between positions
        const factory = new BigObstacleLocationFactory();
        const location1 = factory.getObstacle();
        const location2 = factory.getObstacle();
        const location3 = factory.getObstacle();
        location1.x = point1.x;
        location1.y = point1.y;
        location2.x = point2.x;
        location2.y = point2.y;
        location3.x = point3.x;
        location3.y = point3.y;

        const lineGen = new ExpandAreaConnect();
        let line = lineGen.runAlgorithm(location1, [location2], rng, 1,1,1);
        line.forEach(location => {
            location.obstacle = true;
            mapObject.unfinishedMap[location.y][location.x] = location;
        });
        // line = lineGen.runAlgorithm(location2, [location3], rng, 1,2,1);
        // line.forEach(location => {
        //     location.obstacle = true;
        //     mapObject.unfinishedMap[location.y][location.x] = location;
        // });

        return finalSpawn;
    }
}