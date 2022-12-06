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
import { formatDate } from '@/src/utils';
import { Layout } from './index';

const fleetDataColumns = [
  {
    field: 'email', headerName: "Identifant", width: 250,
  }, {
    field: 'manager', headerName: "Manager", width: 200,
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
  const [filters, setFilters] = React.useState(
    () => JSON.parse(localStorage.getItem('statsFilters')) || { area: '', departements: [], insee: [] },
  );
  React.useEffect(() => {
    localStorage.setItem('statsFilters', JSON.stringify(filters));
  }, [filters]);

  const { data, error } = useSWR(
    [filters, '/stats/groupements', userContext.user.apikey],
    (args, url, token) => requestOne(url, { args, token }),
    { refreshInterval: 0 },
  );

  return (
    <Layout filters={filters} setFilters={setFilters} maxWidth="xl">
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
