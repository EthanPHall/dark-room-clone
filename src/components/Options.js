import "./css/Options.css";

function Options({setReset}){

    function newGame(){
        setReset(true);
    }

    return(
        <div className="options-bar">
            <button className="underline-button">save</button>
            <button className="underline-button">load</button>
            <button className="underline-button" onClick={newGame}>new game</button>
        </div>
    )
}

export default Options;