import React from 'react';
import PropTypes from 'prop-types';

import { useRouter } from 'next/router';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import APIErrorAlert from '../components/APIErrorAlert';
import { getCurrentUser, UserContext } from '../src/auth';
import { listUsers } from '../src/users';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  loading: {
    textAlign: 'center',
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

export default function AdminPage({ authenticate }) {
  const user = React.useContext(UserContext);
  const classes = useStyles();
  const [apiResponse, setApiResponse] = React.useState();
  const [apiError, setApiError] = React.useState();
  const [errorRetry, setErrorRetry] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [isLoading, setLoading] = React.useState(true);
  const router = useRouter();

  const refreshUsers = React.useCallback(async () => {
    try {
      const resp = await listUsers(user.apikey, page);
      setApiError(null);
      setApiResponse(resp);
      setLoading(false);
    } catch (err) {
      setApiError(err);
      setApiResponse(null);
      throw err;
    }
  }, [page]);

  React.useEffect(() => {
    let timeoutRetry;

    refreshUsers().catch(() => {
      timeoutRetry = setTimeout(
        () => setErrorRetry(errorRetry + 1),
        Math.min(errorRetry + 1, 60) * 1000,
      );
    });

    return () => clearTimeout(timeoutRetry);
  }, [errorRetry, refreshUsers]);

  const columns = [
    {
      field: 'id',
      headerName: 'Id',
      flex: 1,
      sortable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
      sortable: false,
    },
    {
      field: 'name',
      headerName: 'Nom commercial',
      flex: 2,
      sortable: false,
    },
    {
      field: 'roles',
      headerName: 'Roles',
      flex: 2,
      valueFormatter: (cell) => cell.value.map((role) => role.name).join(', '),
      sortable: false,
    },
    {
      field: 'manager',
      headerName: 'Manager',
      flex: 2,
      valueFormatter: (cell) => (cell.value ? (cell.value.name || cell.value.email) : ''),
      sortable: false,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      renderCell: (cell) => {
        const onClick = async () => {
          try {
            await authenticate(cell.row);
            router.push('/dashboards');
          } catch (exc) {
            setApiError(exc);
          }
        };
        return (
          <Button disabled={cell.row.id === user.id} variant="contained" color="primary" onClick={onClick}>
            Connexion
          </Button>
        );
      },
    },
  ];

  const handlePageChange = (param) => {
    setLoading(true);
    setPage(param.page);
  };

  return (
    <Container maxWidth="md">
      <Paper className={classes.paper} elevation={10}>
        <p>
          Cette fonctionnalité permet aux administrateurs de se connecter en tant
          que n'importe quel utilisateur. Une fois connecté, déconnectez-vous
          pour revenir sur votre compte d'administration.
        </p>

        { apiError && <APIErrorAlert className={classes.error} error={apiError} /> }

        <DataGrid
          autoHeight
          disableColumnMenu
          rowsPerPageOptions={[]}
          hideFooterSelectedRowCount
          hideFooterRowCount
          columns={columns}
          rows={apiResponse?.users || []}
          pageSize={apiResponse?.meta.per_page}
          rowCount={apiResponse?.meta.total}
          onPageChange={handlePageChange}
          paginationMode="server"
          components={{
            LoadingOverlay,
          }}
          loading={isLoading}
        />
      </Paper>
    </Container>
  );
}

AdminPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    apikey: PropTypes.string.isRequired,
  }).isRequired,
  authenticate: PropTypes.func.isRequired,
};

AdminPage.getInitialProps = async (ctx) => ({
  user: getCurrentUser(ctx),
});
