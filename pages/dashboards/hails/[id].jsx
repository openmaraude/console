import React from 'react';
import PropTypes from 'prop-types';

import { useRouter } from 'next/router';

import useSWR from 'swr';

import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import APIErrorAlert from '@/components/APIErrorAlert';
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
            <TableCell>{formatDate(new Date(hail.creation_datetime))}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head">Statut final</TableCell>
            <TableCell>{hail.status}</TableCell>
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
                  <TableCell>{formatDate(new Date(transition.timestamp))}</TableCell>
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
