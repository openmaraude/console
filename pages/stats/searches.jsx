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
      <Typography variant="h4">Recherches</Typography>
      {error && <APIErrorAlert error={error} />}

      {data && (
      <>
        <Card>
          <CardContent>
            <Typography variant="h5">Taxis les plus proches (max 1&nbsp;km)</Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell variant='head'>Moyenne</TableCell>
                  <TableCell>{formatDecimal(data.mean)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>Quartile 25&nbsp;%</TableCell>
                  <TableCell>{formatDecimal(data.quartile_25)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>Quartile 50&nbsp;%</TableCell>
                  <TableCell>{formatDecimal(data.quartile_50)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant='head'>Quartile 75&nbsp;%</TableCell>
                  <TableCell>{formatDecimal(data.quartile_75)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </>
      )}
    </Layout>
  );
}
