import React from 'react';
import PropTypes from 'prop-types';

import { useRouter } from 'next/router'

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import APIErrorAlert from '../components/APIErrorAlert';
import { getCurrentUser } from '../src/auth';
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

function PageLayout({ isLoading, children }) {
  const classes = useStyles();
  return (
    <Container maxWidth="md">
      <Paper className={classes.paper} elevation={10}>
        {isLoading
          ? <div className={classes.loading}><CircularProgress /></div>
          : children}
      </Paper>
    </Container>
  );
}

PageLayout.defaultProps = {
  isLoading: false,
  children: null,
};

PageLayout.propTypes = {
  isLoading: PropTypes.bool,
  children: PropTypes.node,
};

export default function AdminPage({ authenticate, user }) {
  const classes = useStyles();
  const [apiResponse, setApiResponse] = React.useState();
  const [apiError, setApiError] = React.useState();
  const [page, setPage] = React.useState(0);
  const isLoading = !apiResponse;
  const router = useRouter();

  /*
   * XXX: fix isLoading afin d'utiliser la feature de loading de datagrid et
   * virer le code custom
   *
   * rajouter les filtres
   */

  React.useEffect(async () => {
    try {
      const resp = await listUsers(user.apikey, page);
      setApiError(null);
      setApiResponse(resp);
    } catch (err) {
      setApiError(err);
      setApiResponse(null);
    }
  }, [page]);

  if (apiError) {
    return (
      <PageLayout>
        <APIErrorAlert className={classes.error} error={apiError} />
      </PageLayout>
    );
  }

  if (isLoading) {
    return <PageLayout isLoading />;
  }

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
    setPage(param.page);
  };

  return (
    <PageLayout>
      <p>
        Cette fonctionnalité permet aux administrateurs de se connecter en tant
        que n'importe quel utilisateur. Une fois connecté, déconnectez-vous
        pour revenir sur votre compte d'administration.
      </p>

      <DataGrid
        autoHeight
        disableColumnMenu
        rowsPerPageOptions={[]}
        hideFooterSelectedRowCount
        hideFooterRowCount
        columns={columns}
        rows={apiResponse.users}
        pageSize={apiResponse.meta.per_page}
        rowCount={apiResponse.meta.total}
        onPageChange={handlePageChange}
        paginationMode="server"
      />

    </PageLayout>
  );
}

AdminPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    apikey: PropTypes.string.isRequired,
  }).isRequired,
};

AdminPage.getInitialProps = async (ctx) => ({
  user: getCurrentUser(ctx),
});
