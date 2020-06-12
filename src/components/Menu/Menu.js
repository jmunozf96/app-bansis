import React from "react";
import {Row} from "react-bootstrap"
//import DesktopMacOutlinedIcon from '@material-ui/icons/DesktopMacOutlined';
import "./Menu.scss";

export default function Menu() {
    return (
        <Row className="menu">
            <div className="menu__imagen">
                <div className="menu__imagen-opacidad"/>
                {/*<h1 className="icon"><DesktopMacOutlinedIcon/></h1>
                <h1 className="title">BANSIS</h1>
                <small>SISTEMA DE BANANO</small>*/}
            </div>
        </Row>
    );
}
