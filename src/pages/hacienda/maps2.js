import React, {useState} from "react";
import {GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow} from "react-google-maps"
import {MarkerWithLabel} from "react-google-maps/lib/components/addons/MarkerWithLabel"
import {Container} from "react-bootstrap";
import * as parksData from "../../data/skateboard-parks";
import mapStyle from "./mapStyle"

function Map() {
    const [selectedPark, setSelectedPark] = useState(null);
    return (
        <GoogleMap
            defaultZoom={16}
            defaultCenter={{lat: -2.2536491, lng: -79.4982278}}
            disableDefaultUI={true}
            mapTypeId='satellite'
            options={{
                streetViewControl: false,
                zoomControl: false,
                scaleControl: false,
                fullscreenControl: false,
                mapTypeControl: false,
                rotateControl: false
            }}
        >
            {parksData.features.map((park) => (
                <Marker
                    key={park.properties.PARK_ID}
                    position={{
                        lat: park.geometry.coordinates[1],
                        lng: park.geometry.coordinates[0]
                    }}
                    onClick={() => {
                        setSelectedPark(park)
                    }}
                    labelStyle={{backgroundColor: "yellow", fontSize: "32px", padding: "16px"}}
                />
            ))}
            {selectedPark && (
                <InfoWindow
                    position={{
                        lat: selectedPark.geometry.coordinates[1],
                        lng: selectedPark.geometry.coordinates[0]
                    }}
                    onCloseClick={() => {
                        setSelectedPark(null);
                    }}
                >
                    <div>
                        <h2>{selectedPark.properties.NAME}</h2>
                        <p>{selectedPark.properties.DESCRIPTIO}</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default function Maps() {
    return (
        <Container fluid className="m-0 p-0 mt-0">
            <div style={{height: "87vh"}}>
                <WrappedMap
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDcighNXC65R-GIqyHhbL3AfDIdgouWSgo`}
                    loadingElement={<div style={{height: `100%`}}/>}
                    containerElement={<div style={{height: `100%`}}/>}
                    mapElement={<div style={{height: `100%`}}/>}
                />
            </div>
        </Container>
    );
}
