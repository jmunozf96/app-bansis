import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '50%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

export default function PanelExpansion(props) {
    const {icon, descripcion, contentTabPanel, data, children} = props;
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState('');

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <ExpansionPanel expanded={expanded === `${data.id}`} onChange={handleChange(`${data.id}`)}
                        style={{display: 'block'}}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon/>}
                id={`${data.id}-header`}
            >
                <Typography className={classes.heading}>
                    {descripcion}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                    <i className={icon}/> {contentTabPanel}
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{display: 'block'}}>
                {children}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}
