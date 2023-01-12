import "../css/CaravanProfession.css";

function CaravanProfession({name, value, onlyLabel}){
    function increment(){
        value++;

        console.log("In Increment");
    }
    
    function decrement(){
        value--;

        console.log("In Decrement");
    }

    return(
        <>
        <div className="caravan-profession">
            <div className="caravan-profession-name">{name}</div>
            <div className="caravan-profession-value">{value}</div>
            {!onlyLabel && <div className="caravan-profession-controls">
                <button><i className="caravan-profession-up" onClick={increment}></i></button>
                <button><i className="caravan-profession-down" onClick={decrement}></i></button>
            </div>}
        </div>
        </>
    )
}

export default CaravanProfession;