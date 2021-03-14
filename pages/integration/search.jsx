import React from 'react';
import PropTypes from "prop-types";

import Link from 'next/link';

import useSWR from 'swr';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import APIErrorAlert from '../../components/APIErrorAlert';
import APIListTable from '../../components/APIListTable';
import { formatDate } from '../../src/utils';
import { Layout } from './index';
import { requestList, requestOne } from '../../src/api';
import { TextLink } from '../../components/LinksRef';
import { TimeoutTextField } from '../../components/TimeoutForm';
import { UserContext } from '../../src/auth';

const useStyles = makeStyles((theme) => ({
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

function Taxi({ taxi }) {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);
  const { data, error } = useSWR(
    [`/taxis/${taxi.id}`, userContext.user.apikey],
    (url, token) => requestOne(url, {
      token,
      headers: {
        'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
      },
    }),
    { refreshInterval: 1 },
  );

  const TaxiLayout = ({ children }) => (
    <section className={classes.section}>
      <Typography variant="h5">Détails du taxi {taxi.id}</Typography>

      {error && <APIErrorAlert className={classes.error} error={error} />}

      { children }
    </section>
  );

  if (!data) {
    return (
      <TaxiLayout>
        <LinearProgress />
      </TaxiLayout>
    );
  }

  const lastLocationUpdate = data.last_update ? new Date(data.last_update * 1000) : null;

  return (
    <TaxiLayout>
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

        {data.position && (
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
        )}
      </Box>
    </TaxiLayout>
  );
}

Taxi.propTypes = {
  taxi: PropTypes.shape({
    id: PropTypes.string,
    operator: PropTypes.string,
    status: PropTypes.string,
    last_update: PropTypes.number,
  }).isRequired,
};

export default function IntegrationSearchPage() {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);
  const listTaxisAvailable = (page, filters) => useSWR(
    ['/taxis', userContext.user.apikey, page, JSON.stringify(filters)],
    (url, token) => {
      if (!filters?.lon || !filters?.lat) {
        return null;
      }
      return requestList(url, page, {
        token,
        args: filters,
        headers: {
          'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
        },
      });
    },
    { refreshInterval: 1 },
  );
  const [selectedTaxi, setSelectedTaxi] = React.useState();

  const filters = (
    <>
      <TimeoutTextField
        label="Longitude"
        variant="outlined"
        margin="dense"
        name="lon"
        InputLabelProps={{ shrink: true }}
        type="number"
        inputProps={{ step: 0.000001 }}
      />
      <TimeoutTextField
        label="Latitude"
        variant="outlined"
        margin="dense"
        name="lat"
        InputLabelProps={{ shrink: true }}
        type="number"
        inputProps={{ step: 0.000001 }}
      />
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
      flex: 1,
      sortable: false,
    },
    {
      field: 'lon',
      headerName: 'Longitude',
      flex: 1,
      sortable: false,
      valueFormatter: (cell) => cell.row.position.lon.toFixed(5),
    },
    {
      field: 'lat',
      headerName: 'Latitude',
      flex: 1,
      sortable: false,
      valueFormatter: (cell) => cell.row.position.lat.toFixed(5),
    },
    {
      field: 'crowfly_distance',
      headerName: 'Distance',
      flex: 1,
      sortable: false,
      valueFormatter: (cell) => `${cell.row.crowfly_distance.toFixed(0)} mètres`,
    },
    {
      field: 'licence_plate',
      headerName: 'Plaque d\'immatriculation',
      flex: 1,
      sortable: false,
      valueFormatter: (cell) => cell.row.vehicle.licence_plate,
    },
    {
      field: 'status',
      headerName: 'Statut',
      flex: 1,
      sortable: false,
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
        La <Link href="/documentation/introduction" passHref><TextLink>documentation</TextLink></Link> est
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
          apiFunc={listTaxisAvailable}
          columns={columns}
          filters={filters}
          // Hide table unless lon and lat filters are filled
          hideUntilFiltersFilled
        />
      </section>

      {selectedTaxi && <Taxi taxi={selectedTaxi} />}
    </Layout>
  );
}
