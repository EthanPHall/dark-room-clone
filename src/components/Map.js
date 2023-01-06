import { useEffect, useState } from "react";
import seedrandom from "seedrandom";
import { LocationHandlerChain } from "../classes/location-handling/locationHandlerChain";
import { PlayerLocationFactory } from "../classes/location_factories/playerLocationFactory";
import { FullMapRenderer } from "../classes/map-renderers/fullMapRenderer";
import { HighlightDistanceBracketsRenderer } from "../classes/map-renderers/highlightDistanceBrackets";
import { HighlightZonesRenderer } from "../classes/map-renderers/highlightZonesRenderer";
import { NearPlayerRenderer } from "../classes/map-renderers/nearPlayerRenderer";
import { NearPlayerRenderer_FogOfWar } from "../classes/map-renderers/nearPlayerRenderer_FogOfWar";
import { MapClass } from "../classes/MapClass";
import PlayerInventory from "../classes/player-inventory/PlayerInventory";
import { Vector2 } from "../classes/vector2";
import mapConfig from "../config/mapConfig.json";
import "./css/Map.css";
import HomeBase from "./HomeBase";
import LocationPopupManager from "./LocationPopupManager";

//This needs to be out here because we don't want the renderer resetting every time this component
//saves.    
// const mapRenderer = new NearPlayerRenderer_FogOfWar(mapConfig.zonesPerRow * mapConfig.zoneSize);
const mapRenderer = new NearPlayerRenderer(mapConfig.zonesPerRow * mapConfig.zoneSize);
const locationHandler = new LocationHandlerChain();

export default function Map(){
    const RNG = seedrandom(mapConfig.seed);

    const [map, setMap] = useState(undefined);
    const [rendered, setRendered] = useState(<div>Map</div>);
    const [hasRendered, setHasRendered] = useState(false);
    const [player, setPlayer] = useState();
    const [movementHasBeenSetUp, setMovementHasBeenSetUp] = useState(false);
    const [popupTrigger, setPopupTrigger] = useState(undefined);
    const [renderMode, setRenderMode] = useState("map");
        
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
    }, [map]);

    useEffect(() => {
        if(map){
            if(player && player.movedLastTurn){
                locationHandler.runChain(map.finishedMap[player.y][player.x]);
            }

            setRendered(mapRenderer.render(map, [player]));
        }
    }, [player]);

    function movePlayer(positionDelta){
        setPlayer(prev => {
            if(prev.stopMovement){
                return prev;
            }

            const newPlayer = prev.getFullClone();
            newPlayer.prev = new Vector2(newPlayer.x, newPlayer.y);
            newPlayer.x += positionDelta.x;
            newPlayer.y += positionDelta.y;
            newPlayer.movedLastTurn = true;

            return newPlayer;
        });
    }

    function triggerLocationPopup(location){
        if(popupTrigger){
            return;
        }

        setPopupTrigger(location);
        setPlayer(prev => {
            const newPlayer = prev.getFullClone();
            newPlayer.stopMovement = true;
            newPlayer.movedLastTurn = false;

            return newPlayer;
        });
    }
    function untriggerLocationPopup(){
        if(!popupTrigger){
            return;
        }

        setPopupTrigger(undefined);
        setPlayer(prev => {
            const newPlayer = prev.getFullClone();
            newPlayer.stopMovement = false;

            return newPlayer;
        });
    }

    locationHandler.triggerLocationPopup = triggerLocationPopup;

    return(
        <div className="game-screen">
            <div className="left">
                Left
            </div>
            <div className="middle">
                {renderMode === "map" && (
                    <>
                        <PlayerInventory 
                            inventory={player ? player.inventory : undefined} 
                            maxCapacity={player ? player.maxCapacity : undefined}
                            currentWeight={player ? player.getCurrentWeight() : undefined}
                            setPlayer={setPlayer}
                            ></PlayerInventory>
                        <div className="map">
                            {rendered}
                            <LocationPopupManager 
                                popupTrigger={popupTrigger} 
                                untriggerPopup={untriggerLocationPopup} 
                                player={player} setPlayer={setPlayer}></LocationPopupManager>
                        </div>
                    </>
                )}
                {renderMode === "home base" && (
                    <>
                        <HomeBase></HomeBase>
                    </>
                )}
            </div>
            <div className="right">
                Right
            </div>
        </div>
    )
}