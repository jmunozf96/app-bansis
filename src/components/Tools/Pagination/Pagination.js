import React from "react";
import Pagination from "rc-pagination";

import "./Pagination.scss";

export default function PaginationForm(props) {
    const {current_page, total, pageSize, onChangePage} = props;
    return (
        <Pagination
            className="pagination"
            current={current_page}
            total={total}
            pageSize={pageSize}
            onChange={onChangePage}
        />
    );
}
