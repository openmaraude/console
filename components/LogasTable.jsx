import React from 'react';
import PropTypes from 'prop-types';

import useSWR from 'swr';

import { useRouter } from 'next/router';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import { toast } from 'react-toastify';

import APIListTable from '@/components/APIListTable';
import { TimeoutTextField, TimeoutSelectField } from '@/components/TimeoutForm';
import { UserContext } from '@/src/auth';
import { requestList } from '@/src/api';

export default function LogasTable({ minimal }) {
  const userContext = React.useContext(UserContext);
  const useListUsers = (page, filters) => useSWR(
    ['/users', userContext.user.apikey, page, JSON.stringify(filters)],
    (url, token) => requestList(url, page, { token, args: filters }),
  );

  const router = useRouter();

  const filters = (
    <>
      <TimeoutTextField
        label="Email"
        variant="outlined"
        margin="dense"
        name="email"
        InputLabelProps={{ shrink: true }}
      />

      <TimeoutTextField
        label="Nom commercial"
        variant="outlined"
        margin="dense"
        name="name"
        InputLabelProps={{ shrink: true }}
      />

      {!minimal && (
        <>
          <TimeoutTextField
            label="Manager"
            variant="outlined"
            margin="dense"
            name="manager"
            InputLabelProps={{ shrink: true }}
          />
          <TimeoutSelectField
            label="Rôle"
            variant="outlined"
            margin="dense"
            name="role"
            value={[]}
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value=""><em>Tous</em></MenuItem>
            <MenuItem value="groupement">Groupement</MenuItem>
            <MenuItem value="operateur">Opérateur</MenuItem>
            <MenuItem value="moteur">Moteur</MenuItem>
            <MenuItem value="editeur">Éditeur</MenuItem>
          </TimeoutSelectField>
        </>
      )}
    </>
  );

  // Logas a new user
  const logas = async (newUser) => {
    try {
      await userContext.authenticate(newUser);
      router.push('/dashboards');
    } catch (err) {
      toast.error(`Erreur de connexion : ${err.toString()}`);
    }
  };

  const columns = [];

  if (!minimal) {
    columns.push({
      field: 'id',
      headerName: 'Id',
      flex: 1,
      sortable: false,
    });
  }

  columns.push({
    field: 'email',
    headerName: 'Identifiant',
    flex: 2,
    sortable: false,
  });
  columns.push({
    field: 'name',
    headerName: 'Nom commercial',
    flex: 2,
    sortable: false,
  });

  if (!minimal) {
    columns.push({
      field: 'roles',
      headerName: 'Roles',
      flex: 2,
      valueFormatter: ({ value }) => value.map((role) => role.name).join(', '),
      sortable: false,
    });
    columns.push({
      field: 'manager',
      headerName: 'Manager',
      flex: 2,
      valueFormatter: ({ value }) => value?.name || value?.email,
      sortable: false,
    });
  }

  columns.push({
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    renderCell: (cell) => (
      <Button
        disabled={cell.row.id === userContext.user.id}
        variant="contained"
        onClick={() => logas(cell.row)}
      >
        {">>"}
      </Button>
    ),
  });

  return (
    <APIListTable
      apiFunc={useListUsers}
      filters={filters}
      columns={columns}
    />
  );
}

LogasTable.defaultProps = {
  minimal: false,
};

LogasTable.propTypes = {
  minimal: PropTypes.bool,
};
