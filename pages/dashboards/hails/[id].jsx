import React from 'react';
import PropTypes from 'prop-types';

import { useRouter } from 'next/router';

import useSWR from 'swr';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import APIErrorAlert from '@/components/APIErrorAlert';
import HailStatus from '@/components/HailStatus';
import { formatDate, formatLoc } from '@/src/utils';
import { requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';
import { Layout } from '../index';

function Hail({ hail }) {
  return (
    <Box marginTop={2}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell variant="head">Date de création</TableCell>
            <TableCell>{formatDate(`${hail.creation_datetime}Z`)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head">Statut final</TableCell>
            <TableCell><HailStatus>{hail.status}</HailStatus></TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head">Adresse du client</TableCell>
            <TableCell>{hail.customer_address}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head">Localisation du client (lon/lat)</TableCell>
            <TableCell>{formatLoc(hail.customer_lon)} / {formatLoc(hail.customer_lat)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head">Identifiant client</TableCell>
            <TableCell>{hail.customer_id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head">Téléphone client</TableCell>
            <TableCell>{hail.customer_phone_number}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head">Taxi</TableCell>
            <TableCell>{hail.taxi?.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head">Téléphone taxi</TableCell>
            <TableCell>{hail.taxi_phone_number}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {hail.transitions && (
        <Box marginTop={5}>
          <p>
            Le tableau ci-dessous présente l'historique des transitions connues
            pour cette course. Il peut vous aider à comprendre pourquoi une
            course a échoué.
          </p>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>État initial</TableCell>
                <TableCell>État final</TableCell>
                <TableCell>Raison</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hail.transitions.map((transition) => (
                <TableRow key={JSON.stringify(transition)}>
                  <TableCell>{formatDate(transition.timestamp)}</TableCell>
                  <TableCell>{transition.from_status}</TableCell>
                  <TableCell>{transition.to_status}</TableCell>
                  <TableCell>{transition.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
}

/* eslint-disable react/forbid-prop-types */
Hail.propTypes = {
  hail: PropTypes.any.isRequired,
};
/* eslint-enable react/forbid-prop-types */

export default function DashboardHailsDetail() {
  const router = useRouter();
  const hailId = router.query.id;
  const userContext = React.useContext(UserContext);
  const { data, error } = useSWR(
    [`/hails/${hailId}`, userContext.user.apikey],
    (url, token) => requestOne(url, { token }),
  );

  return (
    <Layout>
      <Typography variant="h4">Détails du hail {hailId}</Typography>

      {!data && <LinearProgress />}
      {error && <APIErrorAlert error={error} />}
      {data && <Hail hail={data} />}
    </Layout>
  );
}
