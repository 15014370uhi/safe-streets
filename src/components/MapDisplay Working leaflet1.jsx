import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";


import L from "leaflet";

const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

const zoom = 13;
const regionCoord=
  [48.864716, 2.349014 ]
;
const regionName="Paris";

const MapDisplay = () => {
  const [map, setMap] = useState(null);

  function FlyToButton() {
    const onClick = () => {
      map.flyTo(regionCoord, zoom);
    };

    return <button onClick={onClick}>Add marker on click</button>;
  }

  return (
    <>
      <Grid container>
        <Grid item xs={10}>
          {regionCoord && (
            <MapContainer
              center={[50, 50]}
              zoom={zoom}
              style={{ height: "85vh" }}
              whenCreated={setMap}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={regionCoord} icon={icon}>
                <Popup>{regionName}</Popup>
              </Marker>
            </MapContainer>
          )}
        </Grid>
        <Grid item xs={2}>
          <FlyToButton />
        </Grid>
      </Grid>
    </>
  );
}

export default MapDisplay;
