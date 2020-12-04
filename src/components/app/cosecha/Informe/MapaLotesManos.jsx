import React, {useState} from "react";
import {Map, TileLayer, Tooltip} from "react-leaflet";
import {CircleMarker} from "react-leaflet/es";
import {calcularIntensidadMapa} from "./HelpersInforme";

export default function MapaLotesManos({lotes}) {
    const [zoom, setZoom] = useState(16.3);
    const [latitud, setLatitud] = useState(-2.2590146590619145);
    const [longitud, setLongitud] = useState(-79.49522495269775);

    const onChangeZoom = (e) => {
        setZoom(e.target._zoom);
    };

    const onClickCoordenadas = (e) => {
        setLatitud(e.latlng.lat);
        setLongitud(e.latlng.lng);
    };

    const intensidad = (cantidad) => {
        return calcularIntensidadMapa(cantidad);
    };

    return (
        <Map
            center={[latitud, longitud]}
            zoom={zoom}
            className="id-mapa-hacienda"
            style={{height: 365}}
            onClick={(e) => onClickCoordenadas(e)}
            onZoom={(e) => onChangeZoom(e)}
        >
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="/MapaHacienda/{z}/{x}/{y}.png"
                //url="http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                //url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            <React.Fragment>
                {lotes.length > 0 && lotes.filter(item => item.cantidad > 0).map((item, i) =>
                    <CircleMarker
                        key={i}
                        center={{lat: `${item.lat}`, lng: `${item.lng}`}}
                        fillColor="red"
                        color="red"
                        fillOpacity={0.5}
                        radius={intensidad(+item.cantidad)}>
                        <Tooltip direction='right' offset={[8, -15]} opacity={1} permanent>
                            <span><b>{item.alias}</b></span>
                        </Tooltip>
                    </CircleMarker>
                )}
            </React.Fragment>
        </Map>
    )
}
