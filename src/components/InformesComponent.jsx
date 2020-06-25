import React from "react";

export default function InformeComponent({children}) {
    return (
        <div className="container-fluid mb-3" style={{marginTop: "4rem"}}>
            {children}
        </div>
    )
}
