import React, {useEffect, useState} from "react";
import CintaCheck from "../../components/Cosecha/CintaCheck";
import {API_LINK} from "../../utils/constants";
import moment from "moment";
import 'moment/locale/es';

export default function CintaSemana({color, setColor, setLotes, setLoadChart, setSearchRecobroCintaSemana}) {
    const day = moment().format("DD/MM/YYYY");
    //const day = "18/07/2020";
    const [loadData, setLoadData] = useState(true);
    const [cintasSemana, setCintasSemana] = useState([]);

    useEffect(() => {
        if (loadData) {
            (async () => {
                const url = `${API_LINK}/bansis-app/index.php/recepcion/1/cintas-semana?fecha=${day}`;
                const request = await fetch(url);
                const response = await request.json();
                const {code, cintas} = response;
                if (code === 200) {
                    setCintasSemana(cintas);
                }
            })();
            setLoadData(false);
        }
    }, [loadData, day]);

    return (
        <div className="row p-1">
            {cintasSemana.length > 0 && cintasSemana.map((item, index) => (
                <div className="col-md-12 col-4" key={index}>
                    <label>{item.semanaCorte} Semanas </label>
                    <CintaCheck
                        data={item}
                        color={color}
                        setColor={setColor}
                        setLotes={setLotes}
                        setLoadChart={setLoadChart}
                        setSearchRecobroCintaSemana={setSearchRecobroCintaSemana}
                    />
                </div>
            ))}
        </div>
    );
}

