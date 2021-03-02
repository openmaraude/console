import React from 'react';
import PropTypes from 'prop-types';

import { useRouter } from 'next/router';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import APIErrorAlert from './APIErrorAlert';
import { UserContext } from '../src/auth';
import { listUsers } from '../src/users';
import { safeUseEffect } from '../src/hooks';
import { TimeoutGroup, TimeoutTextField } from './TimeoutForm';

const useStyles = makeStyles((theme) => ({
  filters: {
    display: 'flex',
    alignItems: 'center',

    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'start',
    },

    '& > *': {
      marginRight: theme.spacing(2),
    },
  },
}));

function LoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

/*
 * Call /users and display a table to log as users.
 */
export default function LogasTable({ displayColumns }) {
  const userContext = React.useContext(UserContext);
  const classes = useStyles();
  const [request, setRequest] = React.useState({});
  const [response, setResponse] = React.useState({});
  const router = useRouter();

  const refreshUsers = React.useCallback(async (ref) => {
    try {
      setResponse({ loading: true });

      const resp = await listUsers(userContext.user.apikey, request?.page, request?.filters);

      if (ref.mounted) {
        setResponse({ resp });
      }
    } catch (err) {
      if (ref.mounted) {
        setResponse({ loading: true, err });
        throw err;
      }
    }
  }, [userContext.user, request]);

  safeUseEffect((ref) => {
    let timeoutRetry;

    refreshUsers(ref).catch(() => {
      timeoutRetry = setTimeout(
        () => setRequest({ ...request, retry: (request.retry || 0) + 1 }),
        2000,
      );
    });
    return () => clearTimeout(timeoutRetry);
  }, [request.retry, refreshUsers]);

  // Logas a new user
  const logas = async (newUser) => {
    try {
      await userContext.authenticate(newUser);
      router.push('/dashboards');
    } catch (err) {
      setResponse({ err });
    }
  };

  const columns = [];

  if (!displayColumns || displayColumns.indexOf('id') > -1) {
    columns.push({
      field: 'id',
      headerName: 'Id',
      flex: 1,
      sortable: false,
    });
  }
  if (!displayColumns || displayColumns.indexOf('email') > -1) {
    columns.push({
      field: 'email',
      headerName: 'Email',
      flex: 2,
      sortable: false,
    });
  }
  if (!displayColumns || displayColumns.indexOf('commercial_name') > -1) {
    columns.push({
      field: 'name',
      headerName: 'Nom commercial',
      flex: 2,
      sortable: false,
    });
  }
  if (!displayColumns || displayColumns.indexOf('roles') > -1) {
    columns.push({
      field: 'roles',
      headerName: 'Roles',
      flex: 2,
      valueFormatter: (cell) => cell.value.map((role) => role.name).join(', '),
      sortable: false,
    });
  }
  if (!displayColumns || displayColumns.indexOf('manager') > -1) {
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

  // Navigation to a different page.
  const handlePageChange = (param) => {
    setRequest({ ...request, page: param.page });
  };

  const updateFilters = (newFilters) => {
    setRequest({ ...request, page: 0, filters: newFilters });
  };

  return (
    <>
      { response.err && <APIErrorAlert className={classes.error} error={response.err} /> }

      <Typography variant="h6">Filtres</Typography>

      <Box marginTop={2} marginBottom={2} className={classes.filters}>
        <TimeoutGroup onSubmit={updateFilters}>
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
        </TimeoutGroup>
      </Box>

      <DataGrid
        autoHeight
        disableColumnMenu
        rowsPerPageOptions={[]}
        hideFooterSelectedRowCount
        hideFooterRowCount
        columns={columns}
        rows={response.resp?.users || []}
        pageSize={response.resp?.meta.per_page}
        rowCount={response.resp?.meta.total}
        page={request.page}
        onPageChange={handlePageChange}
        paginationMode="server"
        components={{
          LoadingOverlay,
        }}
        loading={response.loading}
      />
    </>
  );
}

LogasTable.defaultProps = {
  displayColumns: null,
};

LogasTable.propTypes = {
  displayColumns: PropTypes.arrayOf(String),
};
