import React from 'react';

import useSWR from 'swr';
import MenuItem from '@mui/material/MenuItem';

import APIListTable from '@/components/APIListTable';
import HailStatus from '@/components/HailStatus';
import { TimeoutTextField, TimeoutSelectField } from '@/components/TimeoutForm';
import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';
import {
  formatDate,
  formatPhoneNumber,
  hailTerminalStatus,
  reverseGeocode,
  CallQueue,
} from '@/src/utils';
import { Layout } from './index';

function FillCustomerAddress({
  row,
  value,
  queue,
  customerAddresses,
  setCustomerAddresses,
}) {
  const lon = row.customer_lon;
  const lat = row.customer_lat;

  React.useEffect(() => {
    queue.add(reverseGeocode, { lon, lat }, (address) => {
      // Ugly but I had to in order to get the whole table filled
      // Might be a race condition or something, but just editing one by one
      // only ended with a couple of addresses at best
      customerAddresses[`${lon}, ${lat}`] = address;
      // But still send the event to refresh the data grid
      setCustomerAddresses({ ...customerAddresses });
    });
  }, [lon, lat]);

  return value;
}

export default function StatsCustomers() {
  const userContext = React.useContext(UserContext);
  const listHails = (page, filters) => useSWR(
    ['/internal/customers', userContext.user.apikey, page, JSON.stringify(filters)],
    (url, token) => requestList(url, page, { token, args: filters }),
  );

  const filters = (
    <>
      <TimeoutTextField
        label="Hail"
        variant="outlined"
        margin="dense"
        name="id"
        InputLabelProps={{ shrink: true }}
      />
      <TimeoutTextField
        label="Client"
        variant="outlined"
        margin="dense"
        name="moteur"
        InputLabelProps={{ shrink: true }}
      />
      <TimeoutTextField
        label="Chauffeur"
        variant="outlined"
        margin="dense"
        name="operateur"
        InputLabelProps={{ shrink: true }}
      />
      <TimeoutSelectField
        label="Course"
        variant="outlined"
        margin="dense"
        name="status"
        InputLabelProps={{ shrink: true }}
      >
        <MenuItem value=""><em>Tous</em></MenuItem>
        {hailTerminalStatus.map((st) => <MenuItem value={st}>{st}</MenuItem>)}
      </TimeoutSelectField>
    </>
  );

  const [customerAddresses, setCustomerAddresses] = React.useState({});
  const queue = new CallQueue(100); // Wait 1/10 second between each BAN call

  const columns = [
    {
      field: 'added_at_date',
      headerName: 'Date',
      flex: 1,
      sortable: false,
      valueGetter: ({ row }) => `${row.added_at}Z`,
      valueFormatter: ({ value }) => formatDate(value, 'date'),
    },
    {
      field: 'added_at_time',
      headerName: 'Heure locale',
      flex: 1,
      sortable: false,
      valueGetter: ({ row }) => `${row.added_at}Z`,
      valueFormatter: ({ value }) => formatDate(value, 'time'),
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
      field: 'customer_address',
      headerName: 'Adresse de prise en charge',
      flex: 2,
      sortable: false,
      // Make this column "editable" by moving its state to an object
      // So that once the coordinates are resolved to an address, we edit the source table.
      // Anything from valueFormatter to renderCell is not part of the clipboard or CSV export.
      valueGetter: ({ row }) => customerAddresses[`${row.customer_lon}, ${row.customer_lat}`],
      // customerAddresses will be filled by the component below
      renderCell: (params) => (
        <FillCustomerAddress
          {...params}
          queue={queue}
          customerAddresses={customerAddresses}
          setCustomerAddresses={setCustomerAddresses}
        />
      ),
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
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <HailStatus status={value} />,
    },
    {
      field: 'duration',
      headerName: 'Durée',
      flex: 1,
      sortable: false,
    },
  ];

  return (
    <Layout maxWidth="xxl">
      <APIListTable
        apiFunc={listHails}
        columns={columns}
        filters={filters}
        enableExport
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 100,
            },
          },
        }}
      />
    </Layout>
  );
}
