import React from 'react';

import MenuItem from '@mui/material/MenuItem';
import useSWR from 'swr';
import { makeStyles } from 'tss-react/mui';

import BaseLayout from '@/components/layouts/BaseLayout';
import APIListTable from '@/components/APIListTable';
import { UserContext } from '@/src/auth';
import { requestList } from '@/src/api';
import { formatDate } from '@/src/utils';
import { TimeoutTextField, TimeoutSelectField } from '@/components/TimeoutForm';

const useStyles = makeStyles()((theme) => ({
  root: {
    minWidth: theme.breakpoints.values.md,
  },
}));

function ActivityLogs() {
  const userContext = React.useContext(UserContext);
  const listActivityLogs = (page, filters) => useSWR(
    ['/activity_logs', userContext.user.apikey, page, JSON.stringify(filters)],
    (url, token) => requestList(url, page, { token, args: filters }),
    { refreshInterval: 0 },
  );

  const resources = {
    user: "Utilisateur",
    taxi: "Taxi",
    customer: "Client",
  };

  const actions = [
    { name: "login_password", label: "Connexion avec mot de passe (console)" },
    { name: "login_apikey", label: "Connexion avec clé d'API (console)" },
    { name: "auth_apikey", label: "Authentification avec clé d'API" },
    { name: "auth_logas", label: "Authentification sous un autre utilisateur" },
    { name: "taxi_status", label: "Changement de statut" },
    { name: "customer_hail", label: "Demande de prise en charge" },
  ];

  const filters = (
    <>
      <TimeoutSelectField
        label="Ressource"
        variant="outlined"
        margin="dense"
        name="resource"
        InputLabelProps={{ shrink: true }}
      >
        <MenuItem value=""><em>Toutes</em></MenuItem>
        {Object.entries(resources).map(([v, label]) => <MenuItem value={v}>{label}</MenuItem>)}
      </TimeoutSelectField>
      <TimeoutTextField
        label="ID ressource"
        variant="outlined"
        margin="dense"
        name="resource_id"
        InputLabelProps={{ shrink: true }}
      />
      <TimeoutSelectField
        label="Action"
        variant="outlined"
        margin="dense"
        name="action"
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 400 }}
      >
        <MenuItem value=""><em>Toutes</em></MenuItem>
        {actions.map(({ name, label }) => <MenuItem value={name}>{label}</MenuItem>)}
      </TimeoutSelectField>
    </>
  );
  const columns = [
    {
      field: 'time',
      headerName: 'Heure',
      flex: 1,
      sortable: false,
      valueFormatter: ({ value }) => formatDate(value),
    },
    {
      field: 'resource',
      headerName: 'Ressource',
      flex: 1,
      sortable: false,
      valueFormatter: ({ value }) => resources[value] || value,
    },
    {
      field: 'resource_id',
      headerName: 'ID ressource',
      flex: 1,
      sortable: false,
      valueFormatter: ({ value }) => value,
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 2,
      sortable: false,
      valueFormatter: ({ value }) => {
        switch (value) {
          case 'login_password': return "Connexion avec mot de passe (console)";
          case 'login_apikey': return "Connexion avec clé d'API (console)";
          case 'auth_apikey': return "Authentification avec clé d'API";
          case 'auth_logas': return "Authentification sous un autre utilisateur";
          case 'taxi_status': return "Changement de statut";
          case 'customer_hail': return "Demande de prise en charge";
          default: return value;
        }
      },
    },
    {
      field: 'extra',
      headerName: 'Extra',
      flex: 3,
      sortable: false,
      valueFormatter: ({ value }) => JSON.stringify(value),
    },
  ];

  return (
    <APIListTable
      apiFunc={listActivityLogs}
      filters={filters}
      columns={columns}
    />
  );
}

export default function AdminPage() {
  const { classes } = useStyles();

  return (
    <BaseLayout maxWidth="lg" className={classes.root}>
      <ActivityLogs />
    </BaseLayout>
  );
}
