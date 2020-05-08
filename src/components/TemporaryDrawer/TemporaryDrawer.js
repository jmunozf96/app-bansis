import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import BubbleChartSharpIcon from '@material-ui/icons/BubbleChartSharp';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

export default function TemporaryDrawer(props) {
    const {openDrawer, setOpenDrawer} = props;
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const [periodos, setPeriodos] = useState([]);
    const [open, setOpen] = React.useState(null);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        if (openDrawer) {
            setState({
                ...state,
                left: true
            });
            setOpenDrawer(false);
        }
    }, [openDrawer, setOpenDrawer, state, setState]);

    useEffect(() => {
        if (load) {
            let array_per = [];
            let array_sem = [];
            let array_open = {};
            let contador_semana = 1;
            for (let x = 1; x <= 13; x++) {
                for (let y = 1; y <= 4; y++) {
                    array_sem.push({['Semana' + contador_semana]: 'Semana ' + contador_semana, value: contador_semana});
                    contador_semana++;
                }
                array_per.push({['Periodo' + x]: 'Periodo ' + x, open: false, value: x, semanas: array_sem});
                array_open['Periodo' + x] = false;
                array_sem = [];
            }
            setPeriodos(array_per);
            setOpen(array_open);
            setLoad(false);
        }
    }, [load, setLoad]);


    const handleClick = (periodo) => {
        if (open[periodo]) {
            setOpen({
                ...open,
                [periodo]: false
            });
        } else {
            setOpen({
                ...open,
                [periodo]: true
            });
        }

    };

    const toggleDrawer = (anchor, open) => () => {
        setState({...state, [anchor]: open});
    };

    const list = () => (
        <div
            className={classes.list}
            role="presentation"
        >
            <List>
                {periodos.map((periodo, index) => (
                    <React.Fragment key={`Periodo${index}`}>
                        <ListItem button onClick={() => handleClick(['Periodo' + periodo.value])}>
                            <ListItemIcon>
                                <EventAvailableIcon/>
                            </ListItemIcon>
                            <ListItemText primary={periodo['Periodo' + periodo.value]}/>
                            {open['Periodo' + periodo.value] ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        {periodo.semanas.map((semana, i) =>
                            <Collapse
                                in={open['Periodo' + periodo.value]}
                                timeout="auto"
                                unmountOnExit
                                key={`Semana${semana.value}`}
                                /*onClick={toggleDrawer(anchor, false)}
                                onKeyDown={toggleDrawer(anchor, false)}*/
                            >
                                <List component="div" disablePadding>
                                    <ListItem button className={classes.nested}>
                                        <ListItemIcon>
                                            <BubbleChartSharpIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={semana['Semana' + semana.value]}/>
                                    </ListItem>
                                </List>
                            </Collapse>
                        )}
                    </React.Fragment>
                ))}
            </List>
            <Divider/>
        </div>
    );

    return (
        <div>
            <Drawer anchor={'left'} open={state['left']} onClose={toggleDrawer('left', false)}>
                {list()}
            </Drawer>
        </div>
    );
}
