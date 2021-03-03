import React from 'react';
import PropTypes from 'prop-types';

import { useRouter } from 'next/router';

import Button from '@material-ui/core/Button';

import { toast } from 'react-toastify';

import APIListTable from './APIListTable';
import { listUsers } from '../src/users';
import { TimeoutTextField } from './TimeoutForm';
import { UserContext } from '../src/auth';

export default function LogasTable({ minimal }) {
  const userContext = React.useContext(UserContext);
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
      valueFormatter: (cell) => cell.value.map((role) => role.name).join(', '),
      sortable: false,
    });
    columns.push({
      field: 'manager',
      headerName: 'Manager',
      flex: 2,
      valueFormatter: (cell) => (cell.value ? (cell.value.name || cell.value.email) : ''),
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
        color="primary"
        onClick={() => logas(cell.row)}
      >
        {">>"}
      </Button>
    ),
  });

  return (
    <APIListTable
      apiFunc={listUsers}
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
