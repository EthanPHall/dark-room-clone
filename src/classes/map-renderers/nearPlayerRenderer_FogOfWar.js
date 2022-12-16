import seedrandom from "seedrandom";
import { ExpandAreaCircular } from "../location_growth/expandAreaCircular";
import { BlankLocationFactory } from "../location_factories/blankLocationFactory";

/**
 * A more efficient renderer than the FullMapRenderer
 */
export class NearPlayerRenderer_FogOfWar{
    constructor(mapSize, revealDistance = 3){
        this.hasRenderedFully = false;
        this.maxDistance = revealDistance;
        this.revealDistance = revealDistance;
        this.revealedArray = new Array(mapSize)
            .fill(false)
            .map(() => new Array(mapSize).fill(false));
    }

    render(mapObject, otherLocations = []){
        if(!this.rendered){
            this.rendered = [];
        }else{
            let temp = [];

            this.rendered.forEach((row, index) => {
                temp[index] = row;
            });

            this.rendered = temp;
        }

        const mapArray = mapObject.finishedMap;

        const player = otherLocations.filter(location => location.isPlayer)[0];

        const revealLocationGenerator = new ExpandAreaCircular();
        const locationsToReveal = revealLocationGenerator.runAlgorithm(player, 
            [], 
            seedrandom(0),
            this.revealDistance,
            this.revealDistance);

        locationsToReveal.push(player);
        locationsToReveal.forEach(location => {
            if(typeof this.revealedArray[location.y] !== "undefined"
                && typeof this.revealedArray[location.y][location.x] !== "undefined"){
                this.revealedArray[location.y][location.x] = true;
            }
        });
        
        for(let y = 0; y < mapArray.length; y++){
            
            let row = [];

            if(this.hasRenderedFully){
                //Skip rows that aren't close to the player
                if(Math.abs(y - player.y) > this.maxDistance){
                    continue;
                }
            }
                        
            for(let x = 0; x < mapArray.length; x++){    
                let location;

                if(this.revealedArray[y][x]){
                    location = mapArray[y][x];
                }else{
                    const factory = new BlankLocationFactory();
                    location = factory.getBlank();
                    location.x = x;
                    location.y = y;
                }
                
                const potentialLocations = otherLocations.filter(other => {
                    return other && other.comparePositions(location);
                });
                
                if(potentialLocations.length > 0){
                    potentialLocations.sort((a,b) => {
                        if(!a || !b){
                            return 0;
                        }
                        
                        return b.baseLocation.priority - a.baseLocation.priority;
                    });
                    
                    location = otherLocations[0];
                }
                
                row[x] = (
                    <span
                        key={`x${x} y${y}`}
                        className={`${location.baseLocation.name} x${x} y${y} ${location.floating ? "floating" : ""}`}
                        >{location.baseLocation.symbol}</span>
                );
            }

            this.rendered[y] = (
                <div>{row}</div>
            );
        }

        this.hasRenderedFully = true;

        return this.rendered;
    }
}