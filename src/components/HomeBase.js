import { useEffect, useState } from "react";
import "./css/HomeBase.css";
import CaravanProfession from "./HomeBase/CaravanProfession";

function HomeBase({setRenderMode, defaultScreen}){
    const [screenToRender, setScreenToRender] = useState(undefined);

    useEffect(() => {
        setScreenToRender(defaultScreen);
    }, [defaultScreen]);

    function setScreen(evt){
        const newScreen = evt.target.getAttribute("screenName");

        setScreenToRender(newScreen);
    }

    function sledScreen(){
        return (
            <div className="sled-screen">
                <div className="home-base-initial-action">
                    <button className="home-base-button">Check Upload</button>
                </div>
                <div className="home-base-actions">
                    <div className="home-base-action">
                        <div>Build:</div>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                    </div>
                    <div className="home-base-action">
                        <div>Craft:</div>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>

                    </div>
                    <div className="home-base-action">
                        <div>Buy:</div>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                        <button className="home-base-action-button">Check Upload</button>
                    </div>
                </div>
            </div>
        )
    }

    function caravanScreen(){
        return(
            <div className="caravan-screen">
                <div className="home-base-manual-gathering">
                    <button className="home-base-action-button">Gather 1</button>
                    <button className="home-base-action-button">Gather 2</button>
                </div>
                <div className="home-base-automatic-gathering">
                    <CaravanProfession name="Caravaneers" value={80} onlyLabel={true}></CaravanProfession>
                    <CaravanProfession name="Gatherer" value={0}></CaravanProfession>
                    <CaravanProfession name="Smith" value={0}></CaravanProfession>
                </div>
            </div>
        )
    }

    function showMap(){
        setRenderMode("map");
    }
    
    function wastelandScreen(){
        return(
            <div className="wasteland-screen">
                <button onClick={showMap}>Wasteland</button>
            </div>
        )
    }

    return(
        <div className="home-base">
            <div className="home-base-nav">
                <button className={`home-base-button ${screenToRender === "sled" && "underline"}`} screenName="sled" onClick={setScreen}>Sled</button>
                <div>|</div>
                <button className={`home-base-button ${screenToRender === "caravan" && "underline"}`} screenName="caravan" onClick={setScreen}>Caravan</button>
                <div>|</div>
                <button className={`home-base-button ${screenToRender === "wasteland" && "underline"}`} screenName="wasteland" onClick={setScreen}>Wasteland</button>
            </div>
            {screenToRender === "sled" && sledScreen()}
            {screenToRender === "caravan" && caravanScreen()}
            {screenToRender === "wasteland" && wastelandScreen()}
        </div>
    )
}

export default HomeBase;