import React, {useState} from "react";
import {Map, TileLayer, Tooltip} from "react-leaflet";
import {CircleMarker} from "react-leaflet/es";

export default function MapaLotesManos({lotes}) {
    const [zoom, setZoom] = useState(16);
    const [latitud, setLatitud] = useState(-2.2590146590619145);
    const [longitud, setLongitud] = useState(-79.49522495269775);

    const onChangeZoom = (e) => {
        setZoom(e.target._zoom);
    };

    const onClickCoordenadas = (e) => {
        setLatitud(e.latlng.lat);
        setLongitud(e.latlng.lng);
    };

    return (
        <Map
            center={[latitud, longitud]}
            zoom={zoom}
            className="id-mapa-hacienda"
            style={{height: 800}}
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
                {lotes.length > 0 && lotes.map((item, i) =>
                    <CircleMarker
                        key={i}
                        center={{lat: `${item.lat}`, lng: `${item.lng}`}}
                        fillColor="red"
                        color="red"
                        fillOpacity={0.5}
                        radius={+item.cantidad * 0.20}>
                        <Tooltip direction='right' offset={[8, -15]} opacity={1} permanent>
                            <span><b>{item.alias}</b></span>
                        </Tooltip>
                    </CircleMarker>
                )}
            </React.Fragment>
        </Map>
    )
}
