import React, { createContext, useState } from "react";
import Map from "./components/Map";
import "./components/css/Globals.css";
import Options from "./components/Options";
import RngContext from "./components/RngContext";
import seedrandom from "seedrandom";

function App() {

  const [rngContext, setRngContext] = useState({ rng: seedrandom(Date.now()) });

  return(
    <RngContext.Provider value={rngContext}>
      <div className="screen">
        <Map></Map>
      </div>
    </RngContext.Provider>
  )
}

export default App;
