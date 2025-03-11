import React from 'react';

import useSWR from 'swr';

import APIListTable from '@/components/APIListTable';
import { requestList } from '@/src/api';
import { TimeoutTextField } from '@/components/TimeoutForm';
import { UserContext } from '@/src/auth';
import { formatDate } from '@/src/utils';
import { Layout } from './index';

export default function DashboardHails() {
  const userContext = React.useContext(UserContext);
  const useListTaxis = (page, filters) => useSWR(
    { url: '/taxis/all', token: userContext.user.apikey, page, filters },
    ({ url, token, page, filters }) => requestList(url, page, { token, args: filters }),
  );
  const filters = (
    <>
      <TimeoutTextField
        label="Id du taxi"
        variant="outlined"
        margin="dense"
        name="id"
        InputLabelProps={{ shrink: true }}
      />
      <TimeoutTextField
        label="Plaque d'immatriculation"
        variant="outlined"
        margin="dense"
        name="licence_plate"
        InputLabelProps={{ shrink: true }}
      />
    </>
  );

  const columns = [
    {
      field: 'id',
      headerName: 'Id',
      flex: 1,
      sortable: false,
    },
    {
      field: 'added_at',
      headerName: 'Date de création',
      flex: 2,
      sortable: false,
      valueFormatter: (value) => formatDate(`${value}Z`),
    },
    {
      field: 'vehicle',
      valueFormatter: (value) => value.licence_plate,
      headerName: 'Immatriculation',
      flex: 1,
      sortable: false,
    },
    {
      field: 'ads',
      headerName: 'ADS',
      flex: 1,
      sortable: false,
      valueFormatter: (value) => value.town.name || value.insee,
    },
    {
      field: 'driver',
      headerName: 'Chauffeur',
      flex: 2,
      sortable: false,
      valueFormatter: (value) => `${value.first_name} ${value.last_name}`,
    },
    {
      field: 'vasp_handicap',
      headerName: "VASP handicap",
      flex: 2,
      sortable: false,
      valueGetter: (value, row) => row.vehicle.characteristics.indexOf('vasp_handicap'),
      valueFormatter: (value) => (value !== -1 ? 'oui' : ''),
    },
  ];

  return (
    <Layout>
      <APIListTable
        apiFunc={useListTaxis}
        columns={columns}
        filters={filters}
      />
    </Layout>
  );
}
