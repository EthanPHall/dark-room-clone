import "../../components/css/PlayerInventory.css";

const ENTRIES_PER_ROW = 5;
const NUMBER_OF_ROWS = 2;
const HORIZONTAL_INCREMENT = 100 / ENTRIES_PER_ROW;

function PlayerInventory({inventory, maxCapacity, currentWeight, setPlayer}){
    
    function removeFromInventory(name, amount){        
        //Inventory weight calculations aren't done in this file, as of 1-4-23 they're done
        //in LocationPopupManager
        
        const numberRemoved = amount ? amount : inventory[name].quantity;
        
        setPlayer(prev => {
            const newPlayer = prev.getFullClone();
            const item = newPlayer.inventory[name];
            
            item.quantity -= numberRemoved;
            if(item.quantity <= 0){
                delete newPlayer.inventory[name];
            }

            newPlayer.lootUpdate = {...item};
            newPlayer.lootUpdate.quantity = numberRemoved;

            return newPlayer;
        });
    }

    function dropAll(evt){
        //if this wasn;t triggered by a left click, return immediately.
        if(evt.button !== 0){
            return;
        }

        removeFromInventory(evt.target.getAttribute("itemname"));
    }
    
    function drop1(evt){
        evt.preventDefault();
        evt.stopPropagation();

        removeFromInventory(evt.target.getAttribute("itemname"), 1);
    }

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
                    style={style}
                    onMouseDown={dropAll}
                    onContextMenu={drop1}
                    itemname={item.name}>
                        {`${item.flavorName} x${item.quantity}`}
                    </div>;
                })}
            </div>
        </>
    )
}

export default PlayerInventory;