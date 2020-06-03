import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {Container} from "react-bootstrap";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'fixed',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreen(props) {
    const classes = useStyles();
    const {title, open, setOpen, children} = props;

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                scroll="paper"
            >
                <AppBar className={classes.appBar} variant="elevation" style={{background: '#25324b'}}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {title}
                        </Typography>
                        {/*<Button color="inherit" onClick={handleClose}>
                            Guardar
                        </Button>*/}
                    </Toolbar>
                </AppBar>
                <Container fluid className="p-0" style={{marginTop: "4.1rem"}}>
                    {children}
                </Container>
            </Dialog>
        </div>
    );
}
