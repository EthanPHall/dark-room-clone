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

export default function LocationPopupManager({popupTrigger, untriggerPopup, player, setPlayer}){    
    const [screenIndex, setScreenIndex] = useState(-1);
    const [screen, setScreen] = useState(undefined);
    const [update, setUpdate] = useState({name: "update"});
    const [weaponsOnCooldown, setWeaponsOnCooldown] = useState({});
    const [attacking, setAttacking] = useState("uninitialized");
    const [enemyAttacking, setEnemyAttacking] = useState("uninitialized");
    
    useEffect(() => {
        if(popupTrigger && popupTrigger.enemyCombatant && popupTrigger.enemyCombatant.attackTimeout){
            clearInterval(popupTrigger.enemyCombatant.attackTimeout);
        }
    }, []);

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

    useEffect(() => {
        if(attacking === "no"){
            setAttacking("attacking");
        }
    }, [attacking]);

    useEffect(() => {
        if(player){
            setPlayer(player.getFullClone());
        }
    }, [update]);

    function generateScreen(){
        let content;
        let disableContinue = false;

        //TODO: Replace this with a simple factory class
        switch(screen.type){
            case "combat":
                if(!popupTrigger.enemyCombatant){
                    popupTrigger.enemyCombatant = combatantFactory.getCombatant(popupTrigger);
                }
                
                const pCombat = player.combatantStats;
                
                const enemy = popupTrigger.enemyCombatant;
                if(enemy.hp <= 0){
                    disableContinue = false;
                    
                }else{
                    disableContinue = true;

                    //The outer timeout creates a delay, so the enemy doesn't just attack immediately.
                    //Then, an interval is started so that the enemy continues to attack from then on,
                    //until it reaches 0 hp.
                    if(!enemy.attackTimeout){
                        enemy.attackTimeout = setTimeout(() => {
                            pCombat.hp -= enemy.damage;
                            setEnemyAttacking(prev => {
                                if(prev === "enemy-attacking"){
                                    return "enemy-attacking-2";
                                }else{
                                    return "enemy-attacking";
                                }
                            });

                            enemy.attackTimeout = setInterval(() => {
                                if(enemy.hp > 0){
                                    pCombat.hp -= enemy.damage;
                                    setEnemyAttacking(prev => {
                                        if(prev === "enemy-attacking"){
                                            return "enemy-attacking-2";
                                        }else{
                                            return "enemy-attacking";
                                        }
                                    })
                                }else{
                                    clearInterval(enemy.attackTimeout);
                                } 
                            }, enemy.attackDelay * 1000)
                        }, enemy.attackDelay * 1000);
                    }
                }

                function attack(evt){
                    const target = evt.target;
                    const index = target.getAttribute("weapon-index");

                    enemy.hp -= target.getAttribute("damage");

                    //It gets reset in a useeffect. This basically removes then quickly adds back the class,
                    //restarting teh attack animation.
                    setAttacking("no");

                    setWeaponsOnCooldown(prev => {
                        const newList = {...prev};
                        newList[index] = true;

                        return newList;
                    });

                    //The player shouldn't be able to just spam the attack button, so each weapon/attack will
                    //have a cooldown associated with it. So, we add the specific attack instance to a 
                    //cooldown list (above), and remove it from that list after the cooldown period is up (below).
                    setTimeout(() => {
                        console.log("timeout done");

                        setWeaponsOnCooldown(prev => {
                            const newList = {...prev};
                            newList[index] = false;
                            
                            console.log(newList);
                            
                            return newList;
                        });
                    }, target.getAttribute("cooldown") * 1000);
                }

                content = (
                    <div className="content">
                        <div className="text-panel">
                            {enemy.flavorText}
                        </div>
                        <div className="action-panel">
                            <div className={`combatant ${attacking}`}>
                                <div className="combatant-icon">{pCombat.icon}</div>
                                <div className="combatant-health">{`${pCombat.hp}/${pCombat.hpMax}`}</div>
                            </div>
                            <div className={`combatant ${enemy.hp <= 0 ? "death" : ""} ${enemyAttacking}`}>
                                <div className="combatant-icon">{enemy.icon}</div>
                                <div className="combatant-health">{`${enemy.hp}/${enemy.hpMax}`}</div>
                            </div>
                        </div>
                        <div className="attacks-panel">
                            {pCombat.weapons.map((weapon, index) => {
                                let style;
                                if(index % 2 === 0){ 
                                    style = {
                                        "top": `${15 + 30 * Math.floor(index / 2)}%`, 
                                        "left": `10%`,
                                    }
                                }else{
                                    style = {
                                        "top": `${15 + 30 * Math.floor(index / 2)}%`, 
                                        "right": `10%`,
                                    }
                                }

                                return (
                                    <div className="attack-button-holder">
                                        <button 
                                            style={style} 
                                            className="attack-button" 
                                            onMouseDown={attack} 
                                            onMouseUp={attack}
                                            weapon-index={index} 
                                            cooldown={weapon.cooldown} 
                                            damage={weapon.damage}
                                            /*disabled={weaponsOnCooldown[index]}*/>{weapon.name}</button>
                                        <div
                                            style={style}
                                            className="attack-button-cooldown-graphic" 
                                            showcooldown={weaponsOnCooldown[index] ? "yes" : "no"}></div>
                                    </div>
                                )
                            })}
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
                if(player.lootUpdate){
                    const lu = player.lootUpdate;
                    let updateProcessed = false;
                    popupTrigger.loot.forEach(item => {
                        if(item.name === lu.name){
                            updateProcessed = true;
                            item.quantity += lu.quantity;
                        }
                    });
                    
                    if(!updateProcessed){
                        popupTrigger.loot.push(lu);
                    }

                    delete player.lootUpdate;
                }
                
                function removeItemBulk(evt){
                    //If this event wasn't triggered by the left mouse button, return without doing anything.
                    if(evt.button !== 0){
                        return;
                    }

                    const name = evt.target.getAttribute("name");
                    
                    let toRemoveIndex = -1;
                    popupTrigger.loot.forEach((item, index) => {
                        if(item.name === name){
                            const remaining = Math.max(player.maxCapacity - player.getCurrentWeight(), 0);
                            const increment = Math.min(item.quantity, remaining);
                            if(increment <= 0){
                                return;
                            }
                            
                            item.quantity -= increment;

                            if(player.inventory[item.name]){
                                player.inventory[item.name].quantity += increment;
                            }else{
                                player.inventory[item.name] = {...item};
                                player.inventory[item.name].quantity = increment;
                            }

                            if(item.quantity <= 0){
                                toRemoveIndex = index;
                            }
                        }
                    });
                    
                    if(toRemoveIndex !== -1){
                        popupTrigger.loot.splice(toRemoveIndex, 1);
                    }
                    
                    setUpdate(prev => {return {...prev}});
                }
                function removeItemSingle(evt){
                    evt.stopPropagation();
                    evt.preventDefault();

                    if(player.getCurrentWeight() >= player.maxCapacity){
                        return;
                    }

                    const name = evt.target.getAttribute("name");

                    let toRemoveIndex = -1;
                    popupTrigger.loot.forEach((item, index) => {
                        if(item.name === name){
                            item.quantity -= 1;

                            if(player.inventory[item.name]){
                                player.inventory[item.name].quantity += 1;
                            }else{
                                player.inventory[item.name] = {...item};
                                player.inventory[item.name].quantity = 1;
                            }

                            if(item.quantity <= 0){
                                toRemoveIndex = index;
                            }
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
                                        onClick={removeItemBulk}
                                        onContextMenu={removeItemSingle}
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
                        <button className="popup-btn back-btn" onClick={close} disabled={screenIndex !== 0}>Back</button>
                        <button className="popup-btn continue-btn" onClick={next} disabled={disableContinue}>Continue</button>
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