import React from "react";
import Pagination from "rc-pagination";

import "./Pagination.scss";

export default function PaginationForm(props) {
    const {current_page, total, onChangePage} = props;
    return (
        <Pagination
            className="pagination"
            current={current_page}
            total={total}
            pageSize={7}
            onChange={onChangePage}
        />
    );
}