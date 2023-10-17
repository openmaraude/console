import React from 'react';

import Link from 'next/link';
import useSWR from 'swr';

import Button from '@mui/material/Button';

import APIListTable from '@/components/APIListTable';
import { requestList } from '@/src/api';
import { TimeoutTextField } from '@/components/TimeoutForm';
import { UserContext } from '@/src/auth';
import { formatDate } from '@/src/utils';
import { Layout } from './index';

export default function DashboardHails() {
  const userContext = React.useContext(UserContext);
  const listHails = (page, filters) => useSWR(
    ['/hails', userContext.user.apikey, page, JSON.stringify(filters)],
    (url, token) => requestList(url, page, { token, args: filters }),
  );

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
      valueFormatter: ({ value }) => formatDate(`${value}Z`),
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
      field: 'details',
      headerName: 'Détails',
      flex: 1,
      sortable: false,
      renderCell: (cell) => (
        <Link href={`/dashboards/hails/${cell.row.id}`}>
          <Button variant="contained" color="primary">
            {">>"}
          </Button>
        </Link>
      ),
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
