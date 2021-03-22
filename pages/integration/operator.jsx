import React from 'react';

import Link from 'next/link';

import useSWR from 'swr';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import faker from 'faker/locale/fr';

import APIErrorAlert from '../../components/APIErrorAlert';
import APIListTable from '../../components/APIListTable';
import { Layout } from './index';
import { requestOne, requestList } from '../../src/api';
import { TextLink } from '../../components/LinksRef';
import { UserContext } from '../../src/auth';

const useStyles = makeStyles((theme) => ({
  section: {
    marginBottom: theme.spacing(2),
  },
}));

export default function IntegrationOperatorPage() {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);
  const listIntegrationTaxis = (page) => useSWR(
    ['/taxis/all', userContext.user.apikey, page],
    (url, token) => requestList(url, page, {
      token,
      headers: {
        'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
      },
    }),
    { refreshInterval: 1000 },
  );
  const [error, setApiError] = React.useState();

  // Create new taxi: POST /ads, POST /drivers, POST /vehicles, POST /taxis.
  // Let SWR refresh the table after refreshInterval seconds.
  async function createIntegrationTaxi() {
    // Helper to send POST request.
    function doPOSTRequest(endpoint, data) {
      return requestOne(endpoint, {
        token: userContext.user.apikey,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Logas': process.env.INTEGRATION_ACCOUNT_EMAIL,
        },
        body: JSON.stringify({
          data: [{
            ...data,
          }],
        }),
      });
    }

    const birthDate = new Date(faker.date.between(1950, 2001));

    try {
      const driver = await doPOSTRequest('/drivers', {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        birth_date: `${birthDate.getFullYear()}-${birthDate.getMonth() + 1}-${birthDate.getDate()}`,
        professional_licence: `fake-${(Math.random() * 10 ** 12).toFixed(0)}`,
        departement: {
          nom: 'Paris',
        },
      });

      const vehicle = await doPOSTRequest('/vehicles', {
        color: faker.vehicle.color(),
        licence_plate: faker.vehicle.vrm(),
      });

      const ads = await doPOSTRequest('/ads', {
        insee: '75056',
        numero: (Math.random() * 10 ** 9).toFixed(0).toString(),
      });

      await doPOSTRequest('/taxis', {
        ads: {
          insee: ads.insee,
          numero: ads.numero,
        },
        driver: {
          departement: driver.departement.numero,
          professional_licence: driver.professional_licence,
        },
        vehicle: {
          licence_plate: vehicle.licence_plate,
        },
      });
      setApiError(null);
    } catch (err) {
      setApiError(err);
    }
  }

  const columns = [
    {
      field: 'id',
      headerName: 'Id taxi',
      flex: 1,
      sortable: false,
    },
    {
      field: 'vehicle',
      headerName: 'Plaque d\'immatriculation',
      flex: 1,
      sortable: false,
      valueFormatter: (cell) => cell.value.licence_plate,
    },
    {
      field: 'ads',
      headerName: 'Code INSEE de l\'ADS',
      flex: 1,
      sortable: false,
      valueFormatter: (cell) => cell.value.insee,
    },
    {
      field: 'driver',
      headerName: 'Chauffeur',
      flex: 1,
      sortable: false,
      valueFormatter: (cell) => `${cell.value.first_name || ""} ${cell.value.last_name || ""}`,
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
      renderCell: () => (
        <Button
          variant="contained"
          color="primary"
        >
          {">>"}
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Typography variant="h4">Simulation d'un applicatif chauffeur</Typography>

      <p>
        Vous souhaitez créer une application client afin de mettre en relation
        vos utilisateurs avec des taxis. Comment faire pour simuler un taxi
        prêt à recevoir une course ? Un taxi qui accepte ou refuse la demande ?
      </p>

      <p>
        Cette page vous permet de simuler simplement une application opérateur.
      </p>

      <p>
        La <Link href="/documentation/introduction" passHref><TextLink>documentation</TextLink></Link> est
        disponible pour vous guider sur le développement de votre application.
      </p>

      <section className={classes.section}>
        <Typography variant="h5">Lister les taxis disponibles</Typography>

        <p>
          Sélectionnez un des taxis de la liste ci-dessous. Ces taxis
          appartiennent à l'opérateur de
          test <strong>{process.env.INTEGRATION_ACCOUNT_EMAIL}</strong>. Vous
          pourrez ensuite modifier le statut du taxi sélectionné, changer sa
          géolocalisation et le statut des courses reçues.
        </p>

        <p>
          Vous pouvez aussi&nbsp;
          <Button variant="contained" color="primary" size="small" onClick={createIntegrationTaxi}>
            créer nouveau taxi
          </Button>.
        </p>

        {error && <APIErrorAlert error={error} />}

        <APIListTable
          apiFunc={listIntegrationTaxis}
          columns={columns}
        />
      </section>

    </Layout>
  );
}
