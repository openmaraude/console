import React from 'react';

import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Card, CardContent, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import useSWR from 'swr';

import APIErrorAlert from '@/components/APIErrorAlert';
import { requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';
import { Layout } from './index';
import { formatDate } from '@/src/utils';

const fleetDataColumns = [
  {
    field: 'email', headerName: "Identifant", width: 200,
  }, {
    field: 'manager', headerName: "Manager", width: 150,
  }, {
    field: 'fleet_size', headerName: "Taille déclarée", type: 'number', width: 150,
  }, {
    field: 'count', headerName: "Taxis enregistrés", type: 'number', width: 150,
  }, {
    field: 'ratio',
    headerName: "Ratio",
    type: 'number',
    width: 150,
    valueFormatter: ({ value }) => (value ? `${value.toFixed(0)} %` : ''),
  }, {
    field: 'last_taxi',
    headerName: "Dernier taxi",
    type: 'date',
    width: 200,
    valueFormatter: ({ value }) => formatDate(value),
  },
];

export default function StatsGroupements() {
  const userContext = React.useContext(UserContext);
  const [area, setArea] = React.useState('');
  const { data, error } = useSWR(
    [area, '/stats/groupements', userContext.user.apikey],
    (area_, url, token) => requestOne(url, { args: { area: area_ }, token }),
  );

  return (
    <Layout area={area} setArea={setArea}>
      <Typography variant="h4">Groupements</Typography>

      {error && <APIErrorAlert error={error} />}

      {data && (
      <>
        <Card>
          <CardContent>
            <Table>
              <TableRow>
                <TableCell>Nombre de groupements de taxis enregistrés</TableCell>
                <TableCell>{data.registered_groupements}</TableCell>
              </TableRow>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div style={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={data.fleet_data}
                columns={fleetDataColumns}
                pageSize={25}
              />
            </div>
          </CardContent>
        </Card>
      </>
      )}

    </Layout>
  );
}
