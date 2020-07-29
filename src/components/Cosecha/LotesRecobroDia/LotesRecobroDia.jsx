import React from 'react';
import {useSelector} from "react-redux";

export default function LotesRecobroDia(props) {
    const {data = []} = props;
    let activos = [];
    let inactivos = [];
    const getLoadLotesCortados = useSelector(state => state.cosecha.loadLotesCortados);

    if (data.length > 0) {
        activos = data.filter((item) => +item.activo === 1);
        inactivos = data.filter((item) => +item.activo !== 1);
    }

    const totalizar = (data, entidad) => {
        return data.reduce((total, item) => total + +item[entidad], 0);
    };


    return (
        <table className="table table-bordered">
            <thead className="text-center">
            <tr>
                <th width="5%" style={styles.table.textCenter}>Estado</th>
                <th width="15%" style={styles.table.textCenter}>Cinta <i className="fas fa-angle-down"/></th>
                <th width="10%" style={styles.table.textCenter}>Lote <i className="fas fa-angle-down"/></th>
                <th width="10%">Enfunde <i className="fas fa-angle-down"/></th>
                <th width="10%">Cort. Inicial <i className="fas fa-angle-down"/></th>
                <th width="10%">Cort. Hoy <i className="fas fa-angle-down"/></th>
                <th width="10%">Saldo <i className="fas fa-angle-down"/></th>
                <th width="10%" style={styles.table.textCenter}>Lbs. dia Σ <i className="fas fa-angle-down"/></th>
                <th width="10%" style={styles.table.textCenter}>Lbs. dia X̅̄ <i className="fas fa-angle-down"/></th>
                <th width="10%" style={styles.table.textCenter}>% x Recob. <i className="fas fa-angle-down"/></th>
            </tr>
            </thead>
            {getLoadLotesCortados ? <tbody>
                <tr>
                    <td colSpan={10} className="text-center p-5">
                        <i className="fa fa-spinner fa-spin fa-3x fa-fw"/>
                    </td>
                </tr>
                </tbody>
                :
                <>
                    {
                        data.length > 0 ?
                            <>
                                <tbody className="text-center">
                                <Detalle
                                    item={activos}
                                    activo={true}
                                />
                                <Detalle
                                    item={inactivos}
                                />
                                <tr>
                                    <td colSpan={3}><b>{data.length} LOTES CORTADOS</b></td>
                                    <td><b>{totalizar(data, 'enfunde')}</b></td>
                                    <td><b>{totalizar(data, 'cortadosTotal') + totalizar(data, 'caidas')}</b></td>
                                    <td><b>{totalizar(data, 'cortados')}</b></td>
                                    <td width="10%">
                                        <b>{totalizar(data, 'enfunde') - (totalizar(data, 'cortadosTotal') + totalizar(data, 'caidas') + totalizar(data, 'cortados'))}</b>
                                    </td>
                                    <td><b>{(totalizar(data, 'peso')).toFixed(2)}</b></td>
                                    <td><b>{(totalizar(data, 'peso') / totalizar(data, 'cortados')).toFixed(2)}</b></td>
                                    <td>
                                        <b>{((1 - ((totalizar(data, 'cortadosTotal') + totalizar(data, 'caidas') + totalizar(data, 'cortados')) / totalizar(data, 'enfunde'))) * 100).toFixed(2)}%</b>
                                    </td>
                                </tr>
                                </tbody>
                                <tfoot>
                                <tr className="text-center">
                                    <th colSpan={3}/>
                                    <th width="10%">Enfunde <i className="fas fa-angle-up"/></th>
                                    <th width="10%">Cort.Inicial <i className="fas fa-angle-up"/></th>
                                    <th width="10%">Cort. Hoy<i className="fas fa-angle-up"/></th>
                                    <th width="10%">Saldo <i className="fas fa-angle-up"/></th>
                                    <th width="10%" style={styles.table.textCenter}>Lbs. dia Σ <i
                                        className="fas fa-angle-up"/></th>
                                    <th width="10%" style={styles.table.textCenter}>Lbs. dia X̅̄ <i
                                        className="fas fa-angle-up"/></th>
                                    <th width="10%" style={styles.table.textCenter}>% x Recob. <i
                                        className="fas fa-angle-up"/></th>
                                </tr>
                                </tfoot>
                            </> : <tbody>
                            <tr>
                                <td colSpan={10} className="p-4">
                                    <div className="alert alert-primary m-0">
                                        <i className="fas fa-exclamation-circle"/> No se han encontrado datos de corte el día de hoy.
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                    }
                </>
            }
        </table>
    )
}

function Detalle({item, activo = false}) {
    return (
        <>
            {item.length > 0 && item.map((item, index) => (
                <tr key={index}
                    style={(+item['enfunde'] - (+item['cortadosTotal'] + +item['caidas'] + +item['cortados'])) < 0 ? styles.bgDanger : activo ? styles.bgSuccess : null}>
                    <td width="5%" style={styles.table.textCenter}>
                        {(+item['enfunde'] - (+item['cortadosTotal'] + +item['caidas'] + +item['cortados'])) >= 0 ?
                            <i className="fas fa-check-circle fa-1x"/> : <i className="fas fa-times-circle fa-1x"/>
                        }
                    </td>
                    <td width="15%" style={styles.table.textCenter}>{item['color']}</td>
                    <td width="10%" style={styles.table.textCenter}>{item['cs_seccion']}</td>
                    <td width="10%">{item['enfunde']}</td>
                    <td width="10%">{+item['cortadosTotal'] + +item['caidas']}</td>
                    <td width="10%">{item['cortados']}</td>
                    <td width="10%">{+item['enfunde'] - (+item['cortadosTotal'] + +item['caidas'] + +item['cortados'])}</td>
                    <td width="10%" style={styles.table.textCenter}>{(+item['peso']).toFixed(2)}</td>
                    <td width="10%"
                        style={styles.table.textCenter}>{(+item['peso'] / +item['cortados']).toFixed(2)}</td>
                    <td width="10%"
                        style={styles.table.textCenter}>{((1 - ((+item['cortadosTotal'] + +item['caidas'] + +item['cortados']) / +item['enfunde'])) * 100).toFixed(2)}%
                    </td>
                </tr>
            ))}
        </>
    );
}

const styles = {
    bgSuccess: {
        backgroundColor: "rgba(200,255,171,0.34)"
    },
    bgDanger: {
        backgroundColor: "rgba(255,68,85,0.42)"
    },
    table: {
        textCenter: {
            textAlign: "center",
            verticalAlign: "middle"
        }
    }
};
