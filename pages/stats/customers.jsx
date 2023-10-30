import React from 'react';

import useSWR from 'swr';

import APIListTable from '@/components/APIListTable';
import ReverseAddress from '@/components/ReverseAddress';
import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';
import { formatDate } from '@/src/utils';
import { Layout } from './index';

export default function DashboardHails() {
  const userContext = React.useContext(UserContext);
  const listHails = (page, filters) => useSWR(
    ['/internal/customers', userContext.user.apikey, page, JSON.stringify(filters)],
    (url, token) => requestList(url, page, { token, args: filters }),
  );

  const filters = (
    <>
    </>
  );

  const columns = [
    {
      field: 'added_at',
      headerName: 'Date et heure locale',
      flex: 2,
      sortable: false,
      valueGetter: ({ value }) => `${value}Z`,
      valueFormatter: ({ value }) => formatDate(value),
    },
    {
      field: 'id',
      headerName: 'Id',
      flex: 1,
      sortable: false,
    },
    {
      field: 'moteur',
      headerName: 'Applicatif client',
      flex: 1,
      sortable: false,
    },
    {
      field: 'Adresse de prise en charge',
      flex: 2,
      sortable: false,
      valueGetter: (params) => ({ lon: params.row.customer_lon, lat: params.row.customer_lat }),
      renderCell: ({ value }) => <ReverseAddress lon={value.lon} lat={value.lat} />,
    },
    {
      field: 'customer_phone_number',
      headerName: 'Numéro client',
      flex: 1,
      sortable: false,
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
    },
    {
      field: 'status',
      headerName: 'Course',
      flex: 2,
      sortable: false,
    },
  ];

  return (
    <Layout maxWidth="x2">
      <APIListTable
        apiFunc={listHails}
        columns={columns}
        filters={filters}
      />
    </Layout>
  );
}
