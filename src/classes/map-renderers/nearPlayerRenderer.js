/**
 * A more efficient renderer than the FullMapRenderer
 */
export class NearPlayerRenderer{
    constructor(){
        this.hasRenderedFully = false;
        this.maxDistance = 1;
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
        
        for(let y = 0; y < mapArray.length; y++){
            
            let row = [];

            if(this.hasRenderedFully){
                //Skip rows that aren't close to the player
                if(Math.abs(y - player.y) > this.maxDistance){
                    continue;
                }
            }
                        
            for(let x = 0; x < mapArray.length; x++){    
                let location = mapArray[y][x];
                
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