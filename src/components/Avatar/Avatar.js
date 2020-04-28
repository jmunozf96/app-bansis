import React from "react";
import {Avatar} from "@material-ui/core";
import {deepOrange} from "@material-ui/core/colors";

import "./Avatar.scss";

export default function AvatarComponent() {
    return (
        <Avatar className="avatar" style={{backgroundColor: deepOrange}}>N</Avatar>
    );
}