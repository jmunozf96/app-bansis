import React, {useCallback, useEffect, useState} from "react";
import "daterangepicker/daterangepicker.css"
import "daterangepicker/daterangepicker"
import $ from 'jquery';

import moment from "moment";
import 'moment/locale/es';

export default function DateRangePicker({start, end}) {
    const [value, setValue] = useState(`${moment().format("DD/MM/YYYY")} - ${moment().add(1, 'days').format("DD/MM/YYYY")}`);

    const changeData = useCallback((desde, hasta) => {
        start(desde);
        end(hasta);
        setValue(`${desde} - ${hasta}`)
    }, [start, end]);

    useEffect(() => {
        $('input[name="daterange"]').daterangepicker({
            opens: 'left',
            "locale": {
                "format": "DD/MM/YYYY",
                "separator": " - ",
                "applyLabel": "Aplicar",
                "cancelLabel": "Cancelar",
                "fromLabel": "From",
                "toLabel": "To",
                "customRangeLabel": "Custom",
                "daysOfWeek": ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                "monthNames": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ],
                "firstDay": 0
            }
        }, function (start, end) {
            changeData(moment(start).format("DD/MM/YYYY"), moment(end).format("DD/MM/YYYY"));
        });
    }, [changeData]);

    return (
        <input
            className="form-control bg-white"
            type="text"
            name="daterange"
            defaultValue={value}
            readOnly={true}
        />
    )
}
