/*
 * Generic component, table to display the results of an API list query.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import APIErrorAlert from './APIErrorAlert';
import { UserContext } from '../src/auth';
import { safeUseEffect } from '../src/hooks';
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
  const [response, setResponse] = React.useState({});

  // Call apiFunc, then setResponse() with the result.
  const APIQuery = React.useCallback(async (ref) => {
    try {
      setResponse({ loading: true });

      // apiFunc is a function which takes three arguments:
      // - apikey
      // - page to browse
      // - filters to apply
      const resp = await apiFunc(
        userContext.user.apikey,
        request?.page,
        request?.filters,
      );

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

  // Call APIQuery. It it throws, try again after a few seconds.
  safeUseEffect((ref) => {
    let timeoutRetry;

    APIQuery(ref).catch(() => {
      timeoutRetry = setTimeout(
        () => setRequest({ ...request, retry: (request.retry || 0) + 1 }),
        2000,
      );
    });
    return () => clearTimeout(timeoutRetry);
  }, [request.retry, APIQuery]);

  const handlePageChange = (param) => {
    setRequest({ ...request, page: param.page });
  };

  const updateFilters = (newFilters) => {
    setRequest({ ...request, page: 0, filters: newFilters });
  };

  return (
    <>
      {response.err && (
        <APIErrorAlert className={classes.error} error={response.err} />
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
        rows={response.resp?.data || []}
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
