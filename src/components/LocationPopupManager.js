import { useEffect, useState } from "react";
import seedrandom from "seedrandom";
import { LocationPopupTemplateFatory } from "../classes/location-popup/locationPopupTemplateFactory";
import "./css/LocationPopup.css";
import mapConfig from "../config/mapConfig.json";
import formattingConfig from "../config/formattingConfig.json";
import { ScreenFactory } from "../classes/location-popup/screenGeneration/screenFactory";
import { CombatantFactory } from "../classes/combat/combatantFactory";
import { LootFactory } from "../classes/loot/lootfactory";
import { ItemList } from "../classes/items/itemList";
// import { LootContentGenerator } from "../classes/loot/lootContentGenerator";

const rng = seedrandom(mapConfig.seed);

const templateFactory = new LocationPopupTemplateFatory(rng);
const screenFactory = new ScreenFactory(rng);
const combatantFactory = new CombatantFactory(rng);

export default function LocationPopupManager({popupTrigger, untriggerPopup, player}){    
    const [screenIndex, setScreenIndex] = useState(-1);
    const [screen, setScreen] = useState(undefined);
    const [update, setUpdate] = useState({name: "update"});
    
    useEffect(() => {
        if(popupTrigger){
            if(popupTrigger.cleared){
                close();
                return;
            }else if(popupTrigger.screens){
                setScreenIndex(0);
                return;
            }else{
                popupTrigger.template = templateFactory.getTemplate(popupTrigger);
            
                if(!popupTrigger.template){
                    close();
                }else{
                    popupTrigger.screens = [];
                    popupTrigger.template.screenSpecs.forEach(specification => {
                        popupTrigger.screens.push(
                            screenFactory.generateScreen(specification, popupTrigger)
                        );
                    });
    
                    setScreenIndex(0);
                }    
            }
        }
    }, [popupTrigger]);

    useEffect(() => {
        if(popupTrigger){
            if(screenIndex >= popupTrigger.screens.length){
                popupTrigger.cleared = true;
                close();
            }else{
                console.log(popupTrigger.screens);
                setScreen(popupTrigger.screens[screenIndex]);
            }
        }
    }, [screenIndex]);

    function generateScreen(){
        let content;

        //TODO: Replace this with a simple factory class
        switch(screen.type){
            case "combat":
                if(!popupTrigger.enemyCombatant){
                    popupTrigger.enemyCombatant = combatantFactory.getCombatant(popupTrigger);
                }
                
                const enemy = popupTrigger.enemyCombatant;
                const pCombat = player.combatantStats;

                content = (
                    <div className="content">
                        <div className="text-panel">
                            {enemy.flavorText}
                        </div>
                        <div className="action-panel">
                            <div className="combatant">
                                <div className="combatant-icon">{pCombat.icon}</div>
                                <div className="combatant-health">{`${pCombat.hp}/${pCombat.hpMax}`}</div>
                            </div>
                            <div className="combatant">
                                <div className="combatant-icon">{enemy.icon}</div>
                                <div className="combatant-health">{`${enemy.hp}/${enemy.hpMax}`}</div>
                            </div>
                        </div>
                        <div className="controls-panel">
                            <button className="attack-button">Attack</button>
                        </div>
                    </div>
                );
                break;
            case "loot":
                if(!popupTrigger.loot){
                    const lootFactory = new LootFactory(rng);
                    const lootObject = lootFactory.getLoot(popupTrigger, popupTrigger.enemyCombatant);
        
                    const itemList = new ItemList();
            
                    const actualLoot = [];
            
                    lootObject.potentialLoot.forEach(potential => {
                        const item = itemList.getItem(potential.name);
            
                        if(item.name === "default"){
                            item.quantity = 1;
                            actualLoot.push(item);
                        }
            
                        if(rng() < potential.chance){
                            item.quantity = Math.floor(rng() * (potential.quantityMax - potential.quantityMin)) + potential.quantityMin;
            
                            actualLoot.push(item);
                        }
                    });

                    popupTrigger.loot = actualLoot;
                    popupTrigger.lootObject = lootObject;
                }
                
                function removeItem(evt){
                    const name = evt.target.getAttribute("name");

                    let toRemoveIndex = -1;
                    popupTrigger.loot.forEach((item, index) => {
                        if(item.name === name){
                            toRemoveIndex = index;
                        }
                    });
    
                    if(toRemoveIndex !== -1){
                        popupTrigger.loot.splice(toRemoveIndex, 1);
                    }

                    setUpdate(prev => {return {...prev}});
                }
        
                content = (
                    <div className="content">
                        <div className="text-panel">
                            {popupTrigger.lootObject.message}
                        </div>
                        <div className="loot-panel">
                            {popupTrigger.loot.map(item => {
                                return(
                                    <button name={item.name} 
                                        onClick={removeItem} 
                                        className="item-button">
                                            {`${item.flavorName} x${item.quantity}`}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                );
                break;
            case "end":
                content = (
                    <p className="content">
                        End Screen
                    </p>
                );
                break;
            default:
                content = (
                    <p className="content">
                        {screen.content.message}
                    </p>
                );
                break;
        }

        return(
            <div className="modal">
                <div className="modal-content-area">
                    <h3 className="title">
                        {popupTrigger.template.title}
                    </h3>
                    {content}
                    <div className="buttons">
                        <button className="popup-btn back-btn" onClick={close}>Back</button>
                        <button className="popup-btn continue-btn" onClick={next}>Continue</button>
                    </div>
                </div>
            </div>
        )
    }

    function close(){
        untriggerPopup();
        setScreen(undefined);
        setScreenIndex(-1);
    }

    function next(){
        setScreenIndex(screenIndex + 1);
    }

    return(
        <>
            {screen && popupTrigger && popupTrigger.template ? generateScreen() : <></>}
        </>
    )
}