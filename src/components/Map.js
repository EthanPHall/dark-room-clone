import { useEffect, useState } from "react";
import seedrandom from "seedrandom";
import { PlayerLocationFactory } from "../classes/location_factories/playerLocationFactory";
import { FullMapRenderer } from "../classes/map-renderers/fullMapRenderer";
import { HighlightDistanceBracketsRenderer } from "../classes/map-renderers/highlightDistanceBrackets";
import { HighlightZonesRenderer } from "../classes/map-renderers/highlightZonesRenderer";
import { NearPlayerRenderer } from "../classes/map-renderers/nearPlayerRenderer";
import { MapClass } from "../classes/MapClass";
import { Vector2 } from "../classes/vector2";
import mapConfig from "../config/mapConfig.json";
import "./css/Map.css";

const mapRenderer = new NearPlayerRenderer();

export default function Map(){
    const RNG = seedrandom(mapConfig.seed);

    const [map, setMap] = useState(undefined);
    const [rendered, setRendered] = useState(<div>Map</div>)
    const [hasRendered, setHasRendered] = useState(false);
    const [player, setPlayer] = useState()
    const [movementHasBeenSetUp, setMovementHasBeenSetUp] = useState(false);
    
    useEffect(() => {
        const newMap = new MapClass();
        newMap
            .generateZones(mapConfig.zoneSize, mapConfig.zonesPerRow)
            .generateBaseMap()
            .generateBGLocations(mapConfig.seedLocationsToSizeRatio, RNG)
            .generateExplorableLocations(mapConfig.explorableLocationsToSizeRatio, RNG)
            .generateBigObstacle(RNG)
            .generateHome()
            .generateEnd()
            .build();
        
        newMap
            .modify_AddFloatingLocations(mapConfig.floatingLocationsPerLocationTypePercentage, 
                mapConfig.floatingLocationsExcludeBrackets, RNG)
            .modify_Finish();
        
        console.log(newMap);
        setMap(newMap);
        
        const playerFactory = new PlayerLocationFactory();
        const newPlayer = playerFactory.getPlayer(newMap.size);
        newPlayer.isPlayer = true;
        setPlayer(newPlayer);

        //Set up player movement
        if(!movementHasBeenSetUp){
            //This flag is necessary because when the page reloads after saving the code,
            //I guess the upcoming event listener is added on top of the previous one, 
            //causing the player to move multiple spaces per input.
            setMovementHasBeenSetUp(true);

            window.addEventListener("keydown", handleMovement, false);
        
            function handleMovement(e){
                const keyCode = e.keyCode;
        
                switch (keyCode) {
                    case 68: //d
                    movePlayer(new Vector2(1,0));
                    break;
                    case 83: //s
                    movePlayer(new Vector2(0,1));
                    break;
                    case 65: //a
                    movePlayer(new Vector2(-1,0));
                    break;
                    case 87: //w
                    movePlayer(new Vector2(0,-1)); 
                    break;
                }
            }
        }
    }, []);

    useEffect(() => {
        if(map){
            setRendered(mapRenderer.render(map, [player]));
        }
    }, [map, player]);

    function movePlayer(positionDelta){
        setPlayer(prev => {
            const newPlayer = prev.getClone();
            newPlayer.x += positionDelta.x;
            newPlayer.y += positionDelta.y;
            newPlayer.isPlayer = true;

            return newPlayer;
        });
    }

    return(
        <>
            <div className="map">
                {rendered}
            </div>
        </>
    )
}