import React, {useEffect, useState} from "react";
import useFetch from "../../hooks/useFetch";

export default function CustomSelect(props) {
    const {name, defaultValue, placeholder, api_url} = props;
    const [dataSelect, setDataSelect] = useState([]);
    const [update, setUpdate] = useState(true);

    const datos = useFetch(api_url);
    const {loading, result} = datos;

    useEffect(() => {
        if (update && !loading) {
            const {code, dataArray} = result;
            if (code === 200) {
                setDataSelect(dataArray);
            }
            setUpdate(false);
        }
    }, [update, loading, result, setDataSelect]);

    if (loading) {
        return (
            <div>
                Cargando datos...
            </div>
        );
    }

    return (
        <select className="form-control custom-select" name={name}
                defaultValue={defaultValue}>
            <option disabled={true} hidden={true} value="">{placeholder}</option>
            {dataSelect.length > 0 && dataSelect.map((data, index) => (
                <option key={data.id} value={data.id}>
                    {data.hasOwnProperty('detalle') && data.detalle}
                    {data.hasOwnProperty('descripcion') && data.descripcion}
                </option>
            ))}
        </select>
    );
}
