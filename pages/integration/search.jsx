import React from 'react';

import Link from 'next/link';

import useSWR from 'swr';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import APIListTable from '../../components/APIListTable';
import { Layout } from './index';
import { requestList } from '../../src/api';
import { TextLink } from '../../components/LinksRef';
import { TimeoutTextField } from '../../components/TimeoutForm';
import { UserContext } from '../../src/auth';

export default function IntegrationSearchPage() {
  const userContext = React.useContext(UserContext);
  const listTaxisAvailable = (page, filters) => useSWR(
    ['/taxis', userContext.user.apikey, page, JSON.stringify(filters)],
    (url, token) => {
      if (!filters?.lon || !filters?.lat) {
        return null;
      }
      return requestList(
        url,
        page,
        { token, args: filters, headers: { 'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL } },
      );
    },
  );

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

      <Divider />

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
    </Layout>
  );
}
