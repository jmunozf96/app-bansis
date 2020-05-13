import React from "react";
import ScriptLoaded from "@react-google-maps/api/dist/docs/ScriptLoaded";
import GoogleMap from "@react-google-maps/api";

export default function Mapa() {
    return (
        <ScriptLoaded>
            <GoogleMap
                id="circle-example"
                mapContainerStyle={{
                    height: "400px",
                    width: "800px"
                }}
                zoom={7}
                center={{
                    lat: -3.745,
                    lng: -38.523
                }}
            />
        </ScriptLoaded>
    )
}
