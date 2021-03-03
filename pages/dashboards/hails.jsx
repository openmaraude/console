import React from 'react';

import APIListTable from '../../components/APIListTable';
import { Layout } from './index';
import { listHails } from '../../src/hails';
import { TimeoutTextField } from '../../components/TimeoutForm';

export default function DashboardHails() {
  const filters = (
    <>
      <TimeoutTextField
        label="Id de la course"
        variant="outlined"
        margin="dense"
        name="id"
        InputLabelProps={{ shrink: true }}
      />
      <TimeoutTextField
        label="Taxi ID"
        variant="outlined"
        margin="dense"
        name="taxi_id"
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
      field: 'creation_datetime',
      headerName: 'Date',
      flex: 2,
      sortable: false,
      valueFormatter: (cell) => new Date(cell.value).toLocaleString('fr-FR'),
    },
    {
      field: 'operateur',
      headerName: 'Applicatif chauffeur',
      flex: 2,
      sortable: false,
    },
    {
      field: 'added_by',
      headerName: 'Applicatif client',
      flex: 2,
      sortable: false,
    },
    {
      field: 'taxi_id',
      headerName: 'Taxi',
      flex: 1,
      sortable: false,
    },
    {
      field: 'status',
      headerName: 'Statut final',
      flex: 2,
      sortable: false,
    },
  ];

  return (
    <Layout>
      <APIListTable
        apiFunc={listHails}
        columns={columns}
        filters={filters}
      />
    </Layout>
  );
}
