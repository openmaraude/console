import Button from '@mui/material/Button';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => ({
  root: {},
}));

export default function Legend() {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <Tooltip
        title={<img src="/images/doc/legend.png" alt="Légende des graphes" />}
        placement="left"
      >
        <Button>Ouvrir la légende</Button>
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
