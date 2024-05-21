/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from "prop-types";

import useSWR from 'swr';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { makeStyles } from 'tss-react/mui';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import APIErrorAlert from '@/components/APIErrorAlert';
import { formatDate } from '@/src/utils';
import { requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';
import HailDetailActions from './HailDetailActions';

const useStyles = makeStyles()((theme) => ({
  tableTitle: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
  },
}));

export default function HailDetail({ hailId, onBackClicked }) {
  const { classes } = useStyles();
  const userContext = React.useContext(UserContext);

  const { data, error } = useSWR(
    [`/hails/${hailId}`, userContext.user.apikey],
    (url, token) => requestOne(url, {
      token,
      headers: {
        'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
      },
    }),
    {
      refreshInterval: 1000,
    },
  );

  const HailDetailLayout = React.useCallback(({ children }) => (
    <>
      {error && <APIErrorAlert error={error} />}

      {children}
    </>
  ), [hailId]);

  HailDetailLayout.propTypes = {
    children: PropTypes.node.isRequired,
  };

  if (!data) {
    return (
      <HailDetailLayout>
        <LinearProgress />
      </HailDetailLayout>
    );
  }

  return (
    <HailDetailLayout>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell variant="head" className={classes.tableTitle} colSpan={2}>Informations du hail {data.id}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Date</TableCell>
            <TableCell>{formatDate(`${data.creation_datetime}Z`)}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Statut</TableCell>
            <TableCell>{data.status}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Opérateur</TableCell>
            <TableCell>{data.operateur}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Taxi</TableCell>
            <TableCell>{data.taxi.id}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Tél. taxi</TableCell>
            <TableCell>{data.taxi_phone_number} {data.status !== 'accepted_by_customer' ? '(masqué)' : ''}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Adresse du client</TableCell>
            <TableCell>{data.customer_address}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Longitude/Latitude du client</TableCell>
            <TableCell>{data.customer_lon}/{data.customer_lat}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Identifiant client</TableCell>
            <TableCell>{data.customer_id}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell variant="head">Tél. client</TableCell>
            <TableCell>{data.customer_phone_number} {data.status !== 'accepted_by_customer' ? '(masqué)' : ''}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <HailDetailActions hail={data} />

      <Box marginTop={2}>
        <Button onClick={onBackClicked}>
          &lt;&lt;&lt; Retour vers le formulaire de demande de course
        </Button>
      </Box>
    </HailDetailLayout>
  );
}

HailDetail.propTypes = {
  hailId: PropTypes.string.isRequired,
  onBackClicked: PropTypes.func.isRequired,
};
