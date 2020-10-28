import React, {useState} from "react";
import {FeatureGroup, Map, Polygon, TileLayer} from "react-leaflet";
import {EditControl} from "react-leaflet-draw";

export default function Maps() {
    const [latitud, setLatitud] = useState(-2.2590146590619145);
    const [longitud, setLongitud] = useState(-79.49522495269775);
    const [position, setPosition] = useState([latitud, longitud]);

    return (
        <Map
            center={position}
            zoom={16}
            className="id-mapa-hacienda"
            style={{height: 800}}
        >
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            />
            <FeatureGroup>
                <EditControl
                    position='topleft'
                    onCreated={(e)=> console.log(e)}
                    edit={{edit: false}}
                    draw={{
                        marker: false,
                        circle: false,
                        rectangle: false,
                        polygon: true,
                        polyline: false
                    }}
                />
                <Polygon
                    positions={[
                        {lat: -2.2552047079874438, lng: -79.49190020532114},
                        {lat: -2.25502781929425, lng: -79.49054300755962},
                        {lat: -2.256748462942345, lng: -79.4898402687977},
                        {lat: -2.256973593736332, lng: -79.49169635743603},
                        {lat: -2.256083790870971, lng: -79.49186265439495},
                    ]}
                />
            </FeatureGroup>
        </Map>
    );
}
