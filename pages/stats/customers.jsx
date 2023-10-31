import React from 'react';
import PropTypes from 'prop-types';

import useSWR from 'swr';
import { makeStyles } from 'tss-react/mui';

import APIListTable from '@/components/APIListTable';
import ReverseAddress from '@/components/ReverseAddress';
import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';
import { formatDate, formatPhoneNumber } from '@/src/utils';
import { Layout } from './index';

const useStyles = makeStyles()((theme) => ({
  status: {
    padding: theme.spacing(1),
    borderRadius: '1vh',
  },
  success: {
    color: '#17774f',
    backgroundColor: '#d4edbc',
  },
  failure: {
    color: '#b10202',
    backgroundColor: '#ffcfc9',
  },
  neutral: {
    color: 'black',
    backgroundColor: '#e8eaed',
  },
}));

function HailStatus({ status }) {
  const { classes, cx } = useStyles();
  let outcome;
  switch (status) {
    case 'finished':
      outcome = 'success';
      break;
    case 'failure':
    case 'timeout_taxi':
    case 'incident_taxi':
    case 'declined_by_taxi':
      outcome = 'failure';
      break;
    default:
      outcome = 'neutral';
  }

  return <span className={cx(classes.status, classes[outcome])}>{status}</span>;
}

HailStatus.propTypes = {
  status: PropTypes.string.isRequired,
};

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
      flex: 2,
      sortable: false,
      renderCell: ({ value }) => <HailStatus status={value} />,
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
