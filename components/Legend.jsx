import Button from '@mui/material/Button';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from 'tss-react/mui';
import Image from 'next/image';

const useStyles = makeStyles()(() => ({
  root: {},
}));

export default function Legend() {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <Tooltip
        title={<Image src="/images/doc/legend.png" width="576" height="348" alt="Légende des graphes" />}
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
