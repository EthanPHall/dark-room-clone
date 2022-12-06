import { useEffect } from "react";
import seedrandom from "seedrandom";
import { FullMapRenderer } from "../classes/map-renderers/fullMapRenderer";
import { MapClass } from "../classes/MapClass";
import mapConfig from "../config/mapConfig.json";
import "./css/Map.css";

export default function Map(){
    const RNG = seedrandom(mapConfig.seed);
    const mapRenderer = new FullMapRenderer();
    
    useEffect(() => {
        const newMap = new MapClass();
        newMap
            .generateZones(mapConfig.zoneSize, mapConfig.zonesPerRow)
            // .generateBaseMap()
            .build();
        
        console.log(newMap);
    }, []);

    return(
        <div>Map</div>
    )
}