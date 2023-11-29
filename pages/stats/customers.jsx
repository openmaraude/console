import React from 'react';

import useSWR from 'swr';
import MenuItem from '@mui/material/MenuItem';

import APIListTable from '@/components/APIListTable';
import HailStatus from '@/components/HailStatus';
import ReverseAddress from '@/components/ReverseAddress';
import { TimeoutTextField, TimeoutSelectField } from '@/components/TimeoutForm';
import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';
import { formatDate, formatPhoneNumber, hailTerminalStatus } from '@/src/utils';
import { Layout } from './index';

export default function StatsCustomers() {
  const userContext = React.useContext(UserContext);
  const listHails = (page, filters) => useSWR(
    ['/internal/customers', userContext.user.apikey, page, JSON.stringify(filters)],
    (url, token) => requestList(url, page, { token, args: filters }),
  );

  const filters = (
    <>
      <TimeoutTextField
        label="Hail"
        variant="outlined"
        margin="dense"
        name="id"
        InputLabelProps={{ shrink: true }}
      />
      <TimeoutTextField
        label="Client"
        variant="outlined"
        margin="dense"
        name="moteur"
        InputLabelProps={{ shrink: true }}
      />
      <TimeoutTextField
        label="Chauffeur"
        variant="outlined"
        margin="dense"
        name="operateur"
        InputLabelProps={{ shrink: true }}
      />
      <TimeoutSelectField
        label="Course"
        variant="outlined"
        margin="dense"
        name="status"
        InputLabelProps={{ shrink: true }}
      >
        <MenuItem value=""><em>Tous</em></MenuItem>
        {hailTerminalStatus.map((st) => <MenuItem value={st}>{st}</MenuItem>)}
      </TimeoutSelectField>
    </>
  );

  const columns = [
    {
      field: 'added_at',
      headerName: 'Date et heure locale',
      flex: 1,
      sortable: false,
      valueGetter: ({ value }) => `${value}Z`,
      valueFormatter: ({ value }) => formatDate(value),
    },
    {
      field: 'id',
      headerName: 'Hail',
      flex: 1,
      sortable: false,
    },
    {
      field: 'moteur',
      headerName: 'Client',
      flex: 1,
      sortable: false,
    },
    {
      field: 'Adresse de prise en charge',
      flex: 2,
      sortable: false,
      renderCell: ({ row }) => <ReverseAddress lon={row.customer_lon} lat={row.customer_lat} />,
    },
    {
      field: 'customer_phone_number',
      headerName: 'Numéro client',
      flex: 1,
      sortable: false,
      valueFormatter: ({ value }) => formatPhoneNumber(value),
    },
    {
      field: 'operateur',
      headerName: 'Chauffeur',
      flex: 1,
      sortable: false,
    },
    {
      field: 'taxi_phone_number',
      headerName: 'Numéro chauffeur',
      flex: 1,
      sortable: false,
      valueFormatter: ({ value }) => formatPhoneNumber(value),
    },
    {
      field: 'status',
      headerName: 'Course',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <HailStatus status={value} />,
    },
    {
      field: 'duration',
      headerName: 'Durée',
      flex: 1,
      sortable: false,
    },
  ];

  return (
    <Layout maxWidth="xxl">
      <APIListTable
        apiFunc={listHails}
        columns={columns}
        filters={filters}
      />
    </Layout>
  );
}
