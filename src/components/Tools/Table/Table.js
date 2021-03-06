import React from "react";
import {Col, Row, Table} from "react-bootstrap";
import PaginationForm from "../Pagination/Pagination";

export default function TableForm(props) {
    const {children, columns, dataAPI: {code, dataArray}, onChangePage, pageSize = 7} = props;
    return (
        <>
            <Row>
                <Col className="p-0">
                    <Table striped bordered hover responsive>
                        <thead className="text-center">
                        <tr>
                            {columns.map((column, i) => (
                                <th key={i}>{column}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="table-sm">
                        {children}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    {code !== 400 && dataArray && Object.entries(dataArray).length > 0 &&
                    <PaginationForm
                        current_page={dataArray.current_page}
                        total={dataArray.total}
                        pageSize={pageSize}
                        onChangePage={onChangePage}
                    />}
                </Col>
            </Row>
        </>
    );
}
