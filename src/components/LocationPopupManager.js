import { useEffect, useState } from "react";
import seedrandom from "seedrandom";
import { LocationPopupTemplateFatory } from "../classes/location-popup/locationPopupTemplateFactory";
import "./css/LocationPopup.css";
import mapConfig from "../config/mapConfig.json";
import { ScreenFactory } from "../classes/location-popup/screenGeneration/screenFactory";

const rng = seedrandom(mapConfig.seed);

const templateFactory = new LocationPopupTemplateFatory(rng);
const screenFactory = new ScreenFactory(rng);

export default function LocationPopupManager({popupTrigger, untriggerPopup}){    
    const [screenIndex, setScreenIndex] = useState(-1);
    const [screen, setScreen] = useState(undefined);
    
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
                content = (
                    <p className="content">
                        Combat Screen
                    </p>
                );
                break;
            case "loot":
                content = (
                    <p className="content">
                        Loot Screen
                    </p>
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