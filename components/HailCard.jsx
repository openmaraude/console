import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import Link from 'next/link';

import { alpha, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { formatDate, formatLoc } from '@/src/utils';

const useStyles = makeStyles((theme) => ({
  hail: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '350px',
  },
  hailTitle: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  hailSuccessTitle: {
    backgroundColor: alpha(theme.palette.success.light, 0.35),
  },
  hailFailureTitle: {
    backgroundColor: alpha(theme.palette.error.light, 0.35),
  },
}));

// Hails with these status are considered successful.
export const HAIL_SUCCESS_STATUS = ['finished', 'customer_on_board'];

export default function HailCard({ hail }) {
  const classes = useStyles();
  const success = HAIL_SUCCESS_STATUS.indexOf(hail.status) !== -1;

  return (
    <Card className={classes.hail}>
      <CardContent>
        <Typography
          className={clsx(
            classes.hailTitle,
            success && classes.hailSuccessTitle,
            !success && classes.hailFailureTitle,
          )}
          variant="subtitle1"
        >
          Hail <Link href={`/dashboards/hails/${hail.id}`} passHref><a>{hail.id}</a></Link>
        </Typography>
        <dl>
          <dt>Date</dt>
          <dd>{formatDate(new Date(hail.added_at))}</dd>

          <dt>Statut</dt>
          <dd><strong>{hail.status}</strong></dd>

          <dt>Opérateur</dt>
          <dd>{hail.operateur.commercial_name || hail.operateur.email}</dd>

          <dt>Moteur</dt>
          <dd>{hail.moteur.commercial_name || hail.moteur.email}</dd>

          <dt>Taxi</dt>
          <dd>{hail.taxi.id}</dd>

          <dt>Client adresse</dt>
          <dd>{hail.customer_address}</dd>

          <dt>Client lon/lat</dt>
          <dd>{formatLoc(hail.customer_lon)}/{formatLoc(hail.customer_lat)}</dd>

          <dt>Taxi lon/lat</dt>
          <dd>{formatLoc(hail.initial_taxi_lon)}/{formatLoc(hail.initial_taxi_lat)}</dd>

          <dt>Client tél.</dt>
          <dd>{hail.customer_phone_number}</dd>

          <dt>Taxi tél.</dt>
          <dd>{hail.taxi_phone_number}</dd>
        </dl>
      </CardContent>
    </Card>
  );
}

/* eslint-disable react/forbid-prop-types */
HailCard.propTypes = {
  hail: PropTypes.any.isRequired,
};
/* eslint-enable react/forbid-prop-types */
