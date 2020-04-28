import React from "react";
import {Card as CardB} from "react-bootstrap"
import AppsIcon from '@material-ui/icons/Apps';

export default function Card(props) {
    const {title, children} = props;
    return (
        <CardB>
            <CardB.Header className="mb-0">
                <AppsIcon style={{marginBottom: "3px"}}/>{title}
            </CardB.Header>
            <CardB.Body>
                {children}
            </CardB.Body>
            <CardB.Footer>
            </CardB.Footer>
        </CardB>
    );
}