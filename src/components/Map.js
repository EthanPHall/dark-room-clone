import { useContext, useEffect, useState } from "react";
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
import GroupingBox from "./GroupingBox";
import HomeBase from "./HomeBase";
import LocationPopupManager from "./LocationPopupManager";
import MessagesArea from "./MessagesArea";
import Options from "./Options";
import RngContext from "./RngContext";
import Stores from "./Stores";


export default function Map(){
    const {rng} = useContext(RngContext);
    const [reset, setReset] = useState(false);
    const [map, setMap] = useState(undefined);
    const [rendered, setRendered] = useState(<div>Map</div>);
    const [hasRendered, setHasRendered] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [movementHasBeenSetUp, setMovementHasBeenSetUp] = useState(false);
    const [popupTrigger, setPopupTrigger] = useState(undefined);
    const [renderMode, setRenderMode] = useState("home base");
    const [baseDefaultScreen, setBaseDefaultScreen] = useState("sled");
    const [stores, setStores] = useState({});
    const [mapRenderer, setMapRenderer] = useState(new NearPlayerRenderer(mapConfig.zonesPerRow * mapConfig.zoneSize));
    const [locationHandler, setLocationHandler] = useState(new LocationHandlerChain());

    function init(){

        const newMap = new MapClass();
        newMap
            .generateZones(mapConfig.zoneSize, mapConfig.zonesPerRow)
            .generateBaseMap()
            .generateBGLocations(mapConfig.seedLocationsToSizeRatio, rng)
            .generateExplorableLocations(mapConfig.explorableLocationsToSizeRatio, rng)
            .generateBigObstacle(rng)
            .generateHome()
            .generateEnd()
            .build();
        
        newMap
            .modify_AddFloatingLocations(mapConfig.floatingLocationsPerLocationTypePercentage, 
                mapConfig.floatingLocationsExcludeBrackets, rng)
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

        setRenderMode("home base");
        setBaseDefaultScreen("sled");
        setPopupTrigger(undefined);
        setStores({});
        setMapRenderer(new NearPlayerRenderer(mapConfig.zonesPerRow * mapConfig.zoneSize));
    }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if(reset){
            init();

            setReset(false);
        }
    }, [reset])

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

    useEffect(() => {
        if(player){
            setPlayer(prev => {
                const newPlayer = prev.getFullClone();
                newPlayer.movedLastTurn = false;

                newPlayer.combatantStats.hp = newPlayer.combatantStats.hpMax;

                return newPlayer;
            });
        }
    }, [renderMode]);

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
    locationHandler.setMapRenderMode = setRenderMode;
    locationHandler.setBaseDefaultScreen = setBaseDefaultScreen;

    return(
        <div className="game-screen">
            <div className="left">
                <MessagesArea></MessagesArea>
            </div>
            <div className="middle">
                {renderMode === "map" && (
                    <>
                        <PlayerInventory 
                            inventory={player ? player.inventory : undefined} 
                            maxCapacity={player ? player.maxCapacity : undefined}
                            currentWeight={player ? player.getCurrentWeight() : undefined}
                            setPlayer={setPlayer}
                            health={player ? player.combatantStats.hp : undefined}
                            maxHealth={player ? player.combatantStats.hpMax : undefined}
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
                        <HomeBase 
                            setRenderMode={setRenderMode} 
                            defaultScreen={baseDefaultScreen}
                            player={player}
                            setPlayer={setPlayer}
                            stores={stores}
                            setStores={setStores}></HomeBase>
                    </>
                )}
            </div>
            <div className="right">
                <Stores stores={stores} setStores={setStores}></Stores>
            </div>
            <Options setReset={setReset}></Options>
        </div>
    )
}