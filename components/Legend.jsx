import Button from '@material-ui/core/Button';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {},
}));

export default function Legend() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Tooltip
        title={<img src="/images/doc/legend.png" alt="Légende des graphes" />}
        placement="left"
      >
        <Button color="primary">Ouvrir la légende</Button>
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
