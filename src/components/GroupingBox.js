import "./css/GroupingBox.css";

function GroupingBox({boxStats, titleStats, contents, setContents}){

    return (
        <>
            <div className="grouping-box"
                style={{width: boxStats.width, height: boxStats.height}}>
                <div className="gbox-title"
                    style={{top: titleStats.top, left: titleStats.left}}>{titleStats.title}</div>
                {contents && Object.keys(contents).map(key => {
                    return <div key={key + "-" + contents[key].name} className="gbox-item">
                                <div>{`${contents[key].flavorName}:`}</div>
                                <div>{`${contents[key].quantity}`}</div>
                            </div> 
                })}
            </div>
        </>
    )
}

export default GroupingBox;