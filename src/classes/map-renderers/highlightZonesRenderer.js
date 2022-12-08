export class HighlightZonesRenderer{
    constructor(){

    }

    render(mapObject){
        const rendered = [];

        const mapArray = mapObject.finishedMap;

        mapObject.zones.forEach((zone, zoneIndex) => {
            zone.points.forEach(point => {
                mapArray[point.y][point.x].highlightZonesRenderer_zone = zoneIndex;
            });
        });

        for(let y = 0; y < mapArray.length; y++){
            const row = [];
            for(let x = 0; x < mapArray.length; x++){
                const location = mapArray[y][x];
                row[x] = (
                    <span
                        key={`x${x} y${y}`}
                        className={`${location.baseLocation.name} 
                            x${x} 
                            y${y} 
                            debug${location.highlightZonesRenderer_zone % 2}`}
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