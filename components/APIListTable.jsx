/*
 * Generic component, table to display the results of an API list query.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { DataGrid, GridOverlay, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import { makeStyles } from 'tss-react/mui';

import APIErrorAlert from '@/components/APIErrorAlert';
import { TimeoutGroup } from '@/components/TimeoutForm';

const useStyles = makeStyles()((theme) => ({
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

function CustomToolbar () {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

/*
 * Call /users and display a table to log as users.
 */
export default function APIListTable({
  apiFunc,
  filters,
  columns,
  hideUntilFiltersFilled,
  enableExport,
}) {
  const { classes } = useStyles();
  const [request, setRequest] = React.useState({});
  const { data, error } = apiFunc(request.page, request.filters);

  // If hideUntilFiltersFilled is true at least one of the filters is not
  // defined, table should be hidden.
  const hideTable = hideUntilFiltersFilled && !filters.props.children.filter(
    (filter) => filter.props.name !== undefined,
  ).map(
    (filter) => request.filters?.[filter.props.name],
  ).every((v) => v);

  const handlePageChange = (page) => {
    setRequest({ ...request, page });
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
        <Box marginTop={2} marginBottom={2} className={classes.filters}>
          <TimeoutGroup onSubmit={updateFilters}>
            {filters}
          </TimeoutGroup>
        </Box>
      )}

      {!hideTable && (
        <DataGrid
          autoHeight
          disableColumnMenu
          disableSelectionOnClick
          hideFooterSelectedRowCount
          columns={columns}
          rows={data?.data || []}
          // Most of list endpoints are paginated, and return an attribute "meta"
          // with the pagination information.
          // If there is no "meta" attribute, then assume the list endpoint is
          // not paginated and returns all the items (like GET /taxis).
          pageSize={data ? (data.meta?.per_page || data.length) : 0}
          rowCount={data ? (data.meta?.total || data.length) : 0}
          page={request.page}
          onPageChange={handlePageChange}
          paginationMode="server"
          components={{
            LoadingOverlay,
            Toolbar: enableExport ? CustomToolbar : null,
          }}
          loading={error || !data}
          checkboxSelection={enableExport}
        />
      )}
    </>
  );
}

APIListTable.defaultProps = {
  filters: null,
  hideUntilFiltersFilled: false,
  enableExport: false,
};

APIListTable.propTypes = {
  apiFunc: PropTypes.func.isRequired,
  filters: PropTypes.node,
  columns: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string,
    headerName: PropTypes.string,
  })).isRequired,
  hideUntilFiltersFilled: PropTypes.bool,
  enableExport: PropTypes.bool,
};
