import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import "./TableUI.scss";

export default function SimpleTableUI(props) {
    const {children, columns} = props;

    return (
        <TableContainer component={Paper} style={{overflowX: 'auto'}}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {columns.map((column, i) => (
                            <TableCell align="center" key={i}>{column}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {children}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
