import React from "react";
import MomentUtils from "@date-io/moment";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import "moment/locale/es";

import "./DatePicker.scss"

export default function DatePicker(props) {
    const {selectedDate, setSelectedDate} = props;

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return(
        <MuiPickersUtilsProvider locale="es" utils={MomentUtils}>
            <KeyboardDatePicker
                id="date-picker-dialog"
                label="Filtrar por fecha"
                format="DD/MM/YYYY"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
        </MuiPickersUtilsProvider>
    );
}
