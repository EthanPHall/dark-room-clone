import { useEffect, useState } from "react";
import seedrandom from "seedrandom";
import { FullMapRenderer } from "../classes/map-renderers/fullMapRenderer";
import { HighlightZonesRenderer } from "../classes/map-renderers/highlightZonesRenderer";
import { MapClass } from "../classes/MapClass";
import mapConfig from "../config/mapConfig.json";
import "./css/Map.css";

export default function Map(){
    const RNG = seedrandom(mapConfig.seed);
    const mapRenderer = new FullMapRenderer();

    const [map, setMap] = useState(undefined);
    const [rendered, setRendered] = useState(<div>Map</div>)
    
    useEffect(() => {
        const newMap = new MapClass();
        newMap
            .generateZones(mapConfig.zoneSize, mapConfig.zonesPerRow)
            .generateBaseMap()
            .generateBGLocations(mapConfig.seedLocationsToSizeRatio, RNG)
            .generateExplorableLocations(mapConfig.explorableLocationsToSizeRatio, RNG)
            .build();
        
        setMap(newMap);
    }, []);

    useEffect(() => {
        if(map){
            console.log(map);

            setRendered(mapRenderer.render(map));
        }
    }, [map]);

    return(
        <>
            <div className="map">
                {rendered}
            </div>
        </>
    )
}