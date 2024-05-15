import React from 'react';
import PropTypes from "prop-types";

import Link from 'next/link';

import useSWR from 'swr';

import GpsFixedTwoTone from '@mui/icons-material/GpsFixedTwoTone';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { makeStyles } from 'tss-react/mui';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import APIErrorAlert from '@/components/APIErrorAlert';
import APIListTable from '@/components/APIListTable';
import ReverseAddress from '@/components/ReverseAddress';
import SearchAddressDialog from '@/components/SearchAddressDialog';
import { TimeoutTextField, TimeoutContext } from '@/components/TimeoutForm';
import HailDetail from '@/components/integration/HailDetail';
import HailRequestForm from '@/components/integration/HailRequestForm';
import { formatDate, formatLoc } from '@/src/utils';
import { requestList, requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';
import { Layout } from './index';

const useStyles = makeStyles()((theme) => ({
  section: {
    marginBottom: theme.spacing(2),
  },

  detailsBox: {
    display: 'flex',
    flexWrap: 'wrap',

    '& > *': {
      margin: theme.spacing(2),
      minWidth: '25%',
      width: 'auto',
    },
  },

  tableTitle: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
  },
}));

/*
 * Display form to send a hail, or details of the sent hail.
 */
function TaxiHail({ customer, taxi }) {
  const { classes } = useStyles();
  const [currentHail, setCurrentHail] = React.useState();

  return (
    <section className={classes.section}>
      {currentHail
        ? <HailDetail hailId={currentHail.id} onBackClicked={() => setCurrentHail(null)} />
        : <HailRequestForm customer={customer} taxi={taxi} onRequest={setCurrentHail} />}
    </section>
  );
}

TaxiHail.propTypes = {
  customer: PropTypes.shape({
    lon: PropTypes.number,
    lat: PropTypes.number,
  }).isRequired,
  taxi: PropTypes.shape({}).isRequired,
};

function Taxi({ customer, taxi }) {
  const { classes } = useStyles();
  const userContext = React.useContext(UserContext);

  // If the user currently logged in is  the owner of the taxi, we should not
  // specify X-Logas header because integration account doesn't have the
  // permissions to view the item.
  const headers = (
    taxi.driver.professional_licence === "integration"
      ? { 'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL }
      : {}
  );

  const { data, error } = useSWR(
    [`/taxis/${taxi.id}`, userContext.user.apikey],
    (url, token) => requestOne(url, {
      token,
      headers,
    }),
    {
      refreshInterval: 1000,
    },
  );

  const TaxiSection = React.useCallback(({ children }) => (
    <section className={classes.section}>
      <Typography variant="h5">Détails du taxi {taxi.id}</Typography>

      {error && (error.status === 404
        ? (
          <Box marginTop={2} marginBottom={2}>
            <Alert severity="info">
              Ce taxi appartient à l'opérateur <strong>{taxi.operator}</strong>. Vous
              ne pouvez accéder qu'aux taxis vous appartenant, ou aux taxis de l'opérateur de
              test <strong>{process.env.INTEGRATION_ACCOUNT_EMAIL}</strong>.
            </Alert>
          </Box>
        ) : <APIErrorAlert error={error} />
      )}

      {children}
    </section>
  ), [taxi]);

  TaxiSection.propTypes = {
    children: PropTypes.node.isRequired,
  };

  if (!data) {
    return (
      <TaxiSection>
        {/* Only display progressbar if there is no error */}
        {!error && <LinearProgress />}
      </TaxiSection>
    );
  }

  const lastLocationUpdate = data.last_update ? new Date(data.last_update * 1000) : null;

  return (
    <>
      <TaxiSection>
        <Box className={classes.detailsBox}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell variant="head" className={classes.tableTitle} colSpan={2}>Informations du taxi</TableCell>
              </TableRow>

              <TableRow>
                <TableCell variant="head">Opérateur</TableCell>
                <TableCell>{data.operator}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell variant="head">Statut</TableCell>
                <TableCell>{data.status}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table>
            <TableBody>
              <TableRow>
                <TableCell variant="head" className={classes.tableTitle} colSpan={2}>Dernière géolocalisation</TableCell>
              </TableRow>
              <TableRow>

                <TableCell variant="head">Date</TableCell>
                <TableCell>{formatDate(lastLocationUpdate)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell variant="head">Longitude</TableCell>
                <TableCell>{data.position?.lon}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell variant="head">Latitude</TableCell>
                <TableCell>{data.position?.lat}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </TaxiSection>

      <TaxiHail key={data.id} customer={customer} taxi={data} />
    </>
  );
}

Taxi.propTypes = {
  customer: PropTypes.shape({
    lon: PropTypes.number,
    lat: PropTypes.number,
  }).isRequired,
  taxi: PropTypes.shape({
    id: PropTypes.string,
    operator: PropTypes.string,
    status: PropTypes.string,
    last_update: PropTypes.number,
    driver: PropTypes.shape({
      professional_licence: PropTypes.string,
    }),
  }).isRequired,
};

function AddressSearch({ onFound }) {
  const [searchDialog, setSearchDialog] = React.useState(false);
  // Put here because the context only exists after the APIListTable is rendered
  const updateValues = React.useContext(TimeoutContext);

  const onSearch = (address) => {
    if (address?.geometry?.coordinates) {
      const lon = address.geometry.coordinates[0];
      const lat = address.geometry.coordinates[1];
      onFound({ lon, lat });
      // Needed to submit the form as the onChange event didn't happen
      updateValues({ lon, lat });
    }
    setSearchDialog(false);
  };

  return (
    <>
      <Button variant="contained" color="secondary" size="small" onClick={() => setSearchDialog(true)}>Chercher une adresse</Button>
      <SearchAddressDialog open={searchDialog} onClose={onSearch} dialogContentText="" />
    </>
  );
}

AddressSearch.propTypes = {
  onFound: PropTypes.func.isRequired,
};

export default function IntegrationSearchPage() {
  const { classes } = useStyles();
  const userContext = React.useContext(UserContext);
  const [customer, setCustomer] = React.useState({});
  const [selectedTaxi, setSelectedTaxi] = React.useState();
  // Access the textfields below
  const lonFieldRef = React.useRef();
  const latFieldRef = React.useRef();

  const useListTaxisAvailable = (page, filters) => useSWR(
    ['/taxis', userContext.user.apikey, page, JSON.stringify(filters)],
    (url, token) => {
      if (!filters?.lon || !filters?.lat) {
        return null;
      }
      const lon = Number(filters.lon);
      const lat = Number(filters.lat);
      if (customer.lon !== lon || customer.lat !== lat) {
        setSelectedTaxi();
      }
      // Inelegant but way simpler than extracting the values from the components
      setCustomer({ lon, lat });

      return requestList(url, page, {
        token,
        args: filters,
        headers: {
          'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
        },
      });
    },
    { refreshInterval: 1000 },
  );

  const onAddressFound = ({ lon, lat }) => {
    lonFieldRef.current.value = lon;
    latFieldRef.current.value = lat;
    setSelectedTaxi();
  };

  const filters = (
    <>
      <TimeoutTextField
        label="Longitude"
        variant="outlined"
        margin="dense"
        name="lon"
        InputLabelProps={{ shrink: true }}
        type="number"
        inputProps={{ step: "any" }}
        inputRef={lonFieldRef}
      />
      <TimeoutTextField
        label="Latitude"
        variant="outlined"
        margin="dense"
        name="lat"
        InputLabelProps={{ shrink: true }}
        type="number"
        inputProps={{ step: "any" }}
        inputRef={latFieldRef}
      />
      <GpsFixedTwoTone color="primary" sx={{ margin: '0 0.25em -0.5ex' }} />
      <ReverseAddress lon={customer.lon} lat={customer.lat} />
      <AddressSearch onFound={onAddressFound} />
    </>
  );

  const columns = [
    {
      field: 'id',
      headerName: 'Id taxi',
      flex: 1,
      sortable: false,
    },
    {
      field: 'operator',
      headerName: 'Opérateur',
      flex: 2,
      sortable: false,
    },
    {
      field: 'position',
      headerName: 'Position',
      flex: 2,
      sortable: false,
      valueFormatter: ({ value }) => `${formatLoc(value.lon)}, ${formatLoc(value.lat)}`,
    },
    {
      field: 'crowfly_distance',
      headerName: 'Distance',
      flex: 1,
      sortable: false,
      valueFormatter: ({ value }) => `${value.toFixed(0)} m.`,
    },
    {
      field: 'vasp_handicap',
      headerName: "VASP handicap",
      flex: 2,
      sortable: false,
      valueGetter: ({ row }) => row.vehicle.characteristics.indexOf('vasp_handicap'),
      valueFormatter: ({ value }) => (value !== -1 ? "oui" : ''),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (cell) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setSelectedTaxi(cell.row)}
        >
          {">>"}
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Typography variant="h4">Simulation d'un applicatif client</Typography>

      <p>
        Vous souhaitez créer une application chauffeur afin d'envoyer à
        l'API la géolocalisation et la disponibilité de vos taxis.
        Comment faire pour simuler la demande de course de la part d'un
        client ? L'annulation de cette demande ?
      </p>

      <p>
        Cette page vous permet de simuler simplement un applicatif client.
      </p>

      <p>
        La <Link href="/documentation/introduction">documentation</Link> est
        disponible pour vous guider sur le développement de votre application.
      </p>

      <section className={classes.section}>
        <Typography variant="h5">Lister les taxis disponibles</Typography>

        <p>
          Renseignez des coordonnées pour lister les taxis autour de ce point.
          Seuls les taxis libres ayant mis à jour leur géolocalisation il y a
          moins de deux minutes sont affichés.
        </p>

        <APIListTable
          apiFunc={useListTaxisAvailable}
          columns={columns}
          filters={filters}
          // Hide table unless lon and lat filters are filled
          hideUntilFiltersFilled
        />
      </section>

      {selectedTaxi && <Taxi key={selectedTaxi.id} customer={customer} taxi={selectedTaxi} />}
    </Layout>
  );
}
