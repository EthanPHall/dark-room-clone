import "../../components/css/PlayerInventory.css";

const ENTRIES_PER_ROW = 5;
const NUMBER_OF_ROWS = 2;
const HORIZONTAL_INCREMENT = 100 / ENTRIES_PER_ROW;

function PlayerInventory({inventory, maxCapacity, currentWeight}){
    return(
        <>
            <div className="inventory">
                <div className="inventory-title">Inventory</div>
                <div className="inventory-capacity">{currentWeight || 0}/{maxCapacity}</div>
                {inventory && Object.keys(inventory).map((key, index) => {
                    if(index >= NUMBER_OF_ROWS * ENTRIES_PER_ROW){
                        return <></>;
                    }
                    
                    const item = inventory[key];

                    const style = {
                        top: `${15 + 45 * Math.floor(index / ENTRIES_PER_ROW)}%`,
                        left: `${HORIZONTAL_INCREMENT * (index % ENTRIES_PER_ROW)}%`,
                    };

                    return <div className="inventory-item"
                    style={style}>
                        {`${item.flavorName} x${item.quantity}`}
                    </div>;
                })}
            </div>
        </>
    )
}

export default PlayerInventory;