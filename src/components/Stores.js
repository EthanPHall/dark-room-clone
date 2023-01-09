import GroupingBox from "./GroupingBox";
import "./css/Stores.css";
function Stores({stores, setStores}){
    return(
        <div className="grouping-box-holder">
            <GroupingBox
                boxStats={{width: "100%", height: "100%"}}
                titleStats={{top: "-1.5%", left: "3%", title: "Stores"}}
                contents={stores}
                setContents={setStores}></GroupingBox>
        </div>
    )
}

export default Stores;