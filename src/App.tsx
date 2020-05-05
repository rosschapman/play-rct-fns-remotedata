import React from "react";
import "./App.css";
import { MapServiceRegistration } from "./mapServiceRegistration";

function App() {
  return (
    <div className="App">
      <MapServiceRegistration>
        {({ nearbyPlaces }) => (
          <>
            {nearbyPlaces.map((p) => (
              <div>{p.id}</div>
            ))}
          </>
        )}
      </MapServiceRegistration>
    </div>
  );
}

export default App;

/*
<Header>
              <Logo />
              <FilterButton />
              <Search
              <SearchInput onEnter={fetchTextSearch} />
            </Header>
*/

// shari
