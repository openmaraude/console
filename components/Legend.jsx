import Button from '@material-ui/core/Button';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
    },
}));

export default function Legend({ title, children }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Tooltip title={
                <React.Fragment>
                    <img src="/images/doc/legend.png" />
                </React.Fragment>
            } placement="left">
                <Button>Légende</Button>
            </Tooltip>
        </div>
    );
}

/*
Legend.defaultProps = {
};

Legend.propTypes = {
};
*/