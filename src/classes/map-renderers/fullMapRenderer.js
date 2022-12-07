export class FullMapRenderer{
    constructor(){

    }

    render(mapArray){
        const rendered = [];

        for(let y = 0; y < mapArray.length; y++){
            const row = [];
            for(let x = 0; x < mapArray.length; x++){
                const location = mapArray[y][x];
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