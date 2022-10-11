import React from 'react';

import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Card, CardContent, Typography } from '@material-ui/core';
import { DataGrid } from '@mui/x-data-grid';
import useSWR from 'swr';

import APIErrorAlert from '@/components/APIErrorAlert';
import { requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';
import { Layout } from './index';

const fleetDataColumns = [
  {
    field: 'email', headerName: "Identifant", width: 300,
  }, {
    field: 'fleet_size', headerName: "Taille déclarée", type: 'number', width: 150,
  }, {
    field: 'count', headerName: "Taxis enregistrés", type: 'number', width: 150,
  }, {
    field: 'ratio',
    headerName: "Ratio",
    type: 'number',
    width: 150,
    valueFormatter: (params) => params.value?.toFixed(0),
  }, {
    field: 'last_taxi',
    headerName: "Dernier taxi",
    type: 'date',
    width: 200,
    valueFormatter: (params) => new Date(params.value).toLocaleDateString('fr'),
  },
];

export default function StatsGroupements() {
  const userContext = React.useContext(UserContext);
  const { data, error } = useSWR(
    ['/stats/groupements', userContext.user.apikey],
    (url, token) => requestOne(url, { token }),
  );

  return (
    <Layout>
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
