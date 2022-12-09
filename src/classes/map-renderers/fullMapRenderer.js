export class FullMapRenderer{
    constructor(){

    }

    render(mapObject, otherLocations = []){
        const rendered = [];

        const mapArray = mapObject.finishedMap;

        for(let y = 0; y < mapArray.length; y++){
            const row = [];
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
                        className={`${location.baseLocation.name} x${x} y${y}`}
                        >{location.baseLocation.symbol}</span>
                );
            }

            rendered[y] = (
                <div>{row}</div>
            );
        }

        return rendered;
    }
}