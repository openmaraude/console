import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import useSWR from 'swr';

import APIErrorAlert from '@/components/APIErrorAlert';
import { requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';
import { formatDecimal } from '@/src/utils';
import { Layout } from './index';

export default function StatsSearches() {
  const userContext = React.useContext(UserContext);
  const [filters, setFilters] = React.useState(
    () => JSON.parse(localStorage.getItem('statsFilters')) || {},
  );

  const { data, error } = useSWR(
    [filters, '/stats/searches', userContext.user.apikey],
    (args, url, token) => requestOne(url, { args, token }),
    { refreshInterval: 0 },
  );

  return (
    <Layout filters={filters} setFilters={setFilters}>
      <Typography gutterBottom variant="h4">Recherches des clients</Typography>
      {error && <APIErrorAlert error={error} />}

      {data && (
      <>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5">Nombre de taxis disponibles trouvés (max 1&nbsp;km)</Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell variant='head'>Quartile 25&nbsp;%</TableCell>
                  <TableCell>{(data.taxis.taxis_found_25)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>Médiane</TableCell>
                  <TableCell>{(data.taxis.taxis_found_50)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>Quartile 75&nbsp;%</TableCell>
                  <TableCell>{(data.taxis.taxis_found_75)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5">Nombre de taxis vus par le client (max 500&nbsp;m ou moins si rayon réduit)</Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell variant='head'>Quartile 25&nbsp;%</TableCell>
                  <TableCell>{(data.taxis.taxis_seen_25)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>Médiane</TableCell>
                  <TableCell>{(data.taxis.taxis_seen_50)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>Quartile 75&nbsp;%</TableCell>
                  <TableCell>{(data.taxis.taxis_seen_75)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5">Taxi le plus proche (max 1&nbsp;km)</Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell variant="head">Quartile 25&nbsp;%</TableCell>
                  <TableCell>{formatDecimal(data.taxis.closest_taxi_25)}&nbsp;m</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Médiane</TableCell>
                  <TableCell>{formatDecimal(data.taxis.closest_taxi_50)}&nbsp;m</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Quartile 75&nbsp;%</TableCell>
                  <TableCell>{formatDecimal(data.taxis.closest_taxi_75)}&nbsp;m</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5">Nombre total de recherches sur 30 jours (top 10)</Typography>
            <Table>
              <TableBody>
                {data.moteurs.map((m => (
                  <TableRow key={m.moteur}>
                      <TableCell variant="head">{m.moteur}</TableCell>
                      <TableCell>{m.count}</TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </>
      )}
    </Layout>
  );
}
