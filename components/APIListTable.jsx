/*
 * Generic component, table to display the results of an API list query.
 */

import React from 'react';
import PropTypes from 'prop-types';

import useSWR from 'swr';

import Box from '@material-ui/core/Box';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import APIErrorAlert from './APIErrorAlert';
import { UserContext } from '../src/auth';
import { TimeoutGroup } from './TimeoutForm';

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
export default function APIListTable({
  apiFunc,
  filters,
  columns,
}) {
  const userContext = React.useContext(UserContext);
  const classes = useStyles();
  const [request, setRequest] = React.useState({});
  const { data, error } = useSWR(
    [userContext.user.apikey, request?.page, request?.filters],
    apiFunc,
  );

  const handlePageChange = (param) => {
    setRequest({ ...request, page: param.page });
  };

  const updateFilters = (newFilters) => {
    setRequest({ ...request, page: 0, filters: newFilters });
  };

  return (
    <>
      {error && (
        <APIErrorAlert className={classes.error} error={error} />
      )}

      {filters && (
        <>
          <Typography variant="h6">Filtres</Typography>

          <Box marginTop={2} marginBottom={2} className={classes.filters}>
            <TimeoutGroup onSubmit={updateFilters}>
              {filters}
            </TimeoutGroup>
          </Box>
        </>
      )}

      <DataGrid
        autoHeight
        disableColumnMenu
        rowsPerPageOptions={[]}
        hideFooterSelectedRowCount
        hideFooterRowCount
        columns={columns}
        rows={data?.data || []}
        pageSize={data?.meta.per_page}
        rowCount={data?.meta.total}
        page={request.page}
        onPageChange={handlePageChange}
        paginationMode="server"
        components={{
          LoadingOverlay,
        }}
        loading={error || !data}
      />
    </>
  );
}

APIListTable.defaultProps = {
  filters: null,
};

APIListTable.propTypes = {
  apiFunc: PropTypes.func.isRequired,
  filters: PropTypes.node,
  columns: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string,
    headerName: PropTypes.string,
  })).isRequired,
};
