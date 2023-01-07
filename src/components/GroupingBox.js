import "./css/GroupingBox.css";

function GroupingBox({boxStats, titleStats}){
    return (
        <>
            <div className="grouping-box"
                style={{width: boxStats.width, height: boxStats.height}}>
                <div className="gbox-title"
                    style={{top: titleStats.top, left: titleStats.left}}>{titleStats.title}</div>
            </div>
        </>
    )
}

export default GroupingBox;