import React from "react";

export default function InformeComponent({children}) {
    return (
        <div className="container-fluid" style={{marginTop: "4rem"}}>
            {children}
        </div>
    )
}
