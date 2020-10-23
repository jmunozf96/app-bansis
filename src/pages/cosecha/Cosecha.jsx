import React from "react";
import {useDispatch} from "react-redux";
import {listenChanel} from "../../reducers/cosecha/cosechaDucks";
import CosechaBalanza from "./CosechaBalanza";

export default function () {
    const dispatch = useDispatch();
    dispatch(listenChanel());

    return <CosechaBalanza/>;
}
