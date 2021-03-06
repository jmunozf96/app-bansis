import React, {useEffect, useState} from "react";
import L from "leaflet";
import {Map, TileLayer, Marker, Popup} from "react-leaflet";

const myIcon = L.icon({
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=',
    iconSize: [35, 51],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41]
});

const myIcon_red = L.icon({
    iconUrl: 'http://maps.google.com/mapfiles/ms/icons/red.png',
    iconSize: [35, 41],
    iconAnchor: [10, 30],
    popupAnchor: [0, -41]
});

export default function MapaBase(props) {
    const {size = 550, reload = false, setReload, maxZoom = 16, coordenadas, setCoordenadas, addCoordenadas, datos = []} = props;

    const [zoom, setZoom] = useState(maxZoom);
    const [latitud, setLatitud] = useState(coordenadas.latitud);
    const [longitud, setLongitud] = useState(coordenadas.longitud);
    const [position, setPosition] = useState([latitud, longitud]);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        if (load) {
            setPosition([latitud, longitud]);
            setLoad(false);
        }
    }, [load, latitud, longitud]);

    useEffect(() => {
        if (reload) {
            setPosition([coordenadas.latitud, coordenadas.longitud]);
            setZoom(maxZoom);
            setReload(false);
        }
    }, [coordenadas, maxZoom, reload, setReload]);


    const onChangeZoomMap = (e) => {
        if (addCoordenadas) {
            setZoom(e.target._zoom);
        }
    };

    const onClickCoordenadas = (e) => {
        if (addCoordenadas) {
            setLatitud(e.latlng.lat);
            setLongitud(e.latlng.lng);
            setCoordenadas({
                latitud: e.latlng.lat,
                longitud: e.latlng.lng
            });
            setLoad(true);
        }
    };

    return (
        <Map
            center={position}
            zoom={zoom}
            doubleClickZoom={addCoordenadas}
            scrollWheelZoom={addCoordenadas}
            touchZoom={addCoordenadas}
            zoomControl={true}
            className="id-mapa-hacienda"
            style={{height: size}}
            onClick={(e) => onClickCoordenadas(e)}
            onZoom={(e) => onChangeZoomMap(e)}
        >
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            />
            {addCoordenadas ?
                <Marker position={position} icon={myIcon}>
                    <Popup>
                        Coordenadas. <br/> {latitud}, {longitud}.
                    </Popup>
                </Marker>
                :
                datos.length > 0 && datos.map((item, index) => {
                    if (item.activo) {
                        return (
                            <Marker position={[item.latitud, item.longitud]} key={index} icon={myIcon_red}
                                    attribution="dsssf">
                                <Popup>
                                    Distribucion: {item.lote}{item.descripcion} - <b>has: {parseFloat(item.has).toFixed(2)}</b>. <br/> {item.latitud}, {item.longitud}.
                                </Popup>
                            </Marker>
                        )
                    }
                    return false;
                }
                )
            }
        </Map>
    )
}
