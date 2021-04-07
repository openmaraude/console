import React from 'react';

import useSWR from 'swr';

import APIListTable from '../../components/APIListTable';
import { Layout } from './index';
import { requestList } from '../../src/api';
import { TimeoutTextField } from '../../components/TimeoutForm';
import { UserContext } from '../../src/auth';

export default function DashboardHails() {
  const userContext = React.useContext(UserContext);
  const listTaxis = (page, filters) => useSWR(
    ['/taxis/all', userContext.user.apikey, page, JSON.stringify(filters)],
    (url, token) => requestList(url, page, { token, args: filters }),
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
      valueFormatter: (cell) => new Date(cell.value).toLocaleString('fr-FR'),
    },
    {
      field: 'licence_plate',
      valueGetter: (params) => params.row.vehicle.licence_plate,
      headerName: 'Immatriculation',
      flex: 1,
      sortable: false,
    },
    {
      field: 'ads',
      valueGetter: (params) => params.row.ads.town.name || params.row.ads.insee,
      headerName: 'ADS',
      flex: 1,
      sortable: false,
    },
    {
      field: 'driver',
      headerName: 'Chauffeur',
      flex: 1,
      sortable: false,
      valueFormatter: (cell) => `${cell.row.driver.first_name} ${cell.row.driver.last_name}`,
    },
  ];

  return (
    <Layout>
      <APIListTable
        apiFunc={listTaxis}
        columns={columns}
        filters={filters}
      />
    </Layout>
  );
}
