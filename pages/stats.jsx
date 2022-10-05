import React from 'react';

import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useSWR from 'swr';

import APIErrorAlert from '@/components/APIErrorAlert';
import BaseLayout from '@/components/layouts/BaseLayout';
import { requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  header: {
    marginTop: theme.spacing(2),
  },
}));

function roundDecimal(float) {
  if (!float) return '?';
  return float.toFixed(2).toString().replace('.', ',');
}

function StatsTaxis() {
  const userContext = React.useContext(UserContext);
  const { data, error } = useSWR(
    ['/stats/taxis', userContext.user.apikey],
    (url, token) => requestOne(url, { token }),
  );

  return (
    <>
      {error && <APIErrorAlert error={error} />}

      {data && (
      <>
        <Table>
          <TableRow>
            <TableCell>Nombre de groupements de taxis connectés</TableCell>
            <TableCell>{data.connected_groupements}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Nombre de taxis enregistrés</TableCell>
            <TableCell>{data.registered_taxis}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Nombre de taxi connectés au moins une fois</TableCell>
            <TableCell>{data.connected_taxis}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Nombre de taxis enregistrés depuis le décret</TableCell>
            <TableCell>{data.registered_taxis_since_threshold}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Nombre de taxis connectés au moins une fois depuis le décret</TableCell>
            <TableCell>{data.connected_taxis_since_threshold}</TableCell>
          </TableRow>
        </Table>
        <Table>
          <TableRow>
            <TableCell>Nombre de taxis connectés par plage horaires</TableCell>
          </TableRow>
        </Table>
        <Table>
          <TableRow>
            <>
              {Object.keys(data.connected_taxis_per_hour).map((k) => (
                <TableCell>{k} h</TableCell>
              ))}
            </>
          </TableRow>
          <TableRow>
            <>
              {Object.values(data.connected_taxis_per_hour).map((v) => (
                <TableCell>{roundDecimal(v)}</TableCell>
              ))}
            </>
          </TableRow>
        </Table>
        <Table>
          <TableRow>
            <TableCell>Moyenne quotidienne d'heures de connexion par taxi</TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell>
              Nombre d’heures moyennes de connexion par jour
              par taxi ayant indiqué faire de la CPAM / de l’aéroport
            </TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell>Courses mensuelles par taxi</TableCell>
            <TableCell>{roundDecimal(data.monthly_hails_per_taxi)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Valeur de réglage rayon moyen par taxi</TableCell>
            <TableCell>{roundDecimal(data.average_radius)} m</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Pourcentage de modification du rayon</TableCell>
            <TableCell>{roundDecimal(data.average_radius_change * 100)} %</TableCell>
          </TableRow>
        </Table>
      </>
      )}

    </>
  );
}

function StatsHails() {
  const userContext = React.useContext(UserContext);
  const { data, error } = useSWR(
    ['/stats/hails', userContext.user.apikey],
    (url, token) => requestOne(url, { token }),
  );

  return (
    <>
      {error && <APIErrorAlert error={error} />}

      {data && (
      <>
        <Table>
          <TableRow>
            <TableCell>Nombre de courses distribuées depuis le début</TableCell>
            <TableCell>{data.hails_received}</TableCell>
          </TableRow>
        </Table>
        <Table>
          <TableRow>
            <TableCell />
            <TableCell>Par jour</TableCell>
            <TableCell>Par semaine</TableCell>
            <TableCell>Par mois</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Moyenne de courses distribuées</TableCell>
            <TableCell>{roundDecimal(data.hails_daily.total_average)}</TableCell>
            <TableCell>{roundDecimal(data.hails_weekly.total_average)}</TableCell>
            <TableCell>{roundDecimal(data.hails_monthly.total_average)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Taux d'échec client : timeout customer</TableCell>
            <TableCell>{roundDecimal(data.hails_daily.timeout_customer_average)}</TableCell>
            <TableCell>{roundDecimal(data.hails_weekly.timeout_customer_average)}</TableCell>
            <TableCell>{roundDecimal(data.hails_monthly.timeout_customer_average)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Taux d'échec client : declined_by_customer</TableCell>
            <TableCell>{roundDecimal(data.hails_daily.declined_by_customer_average)}</TableCell>
            <TableCell>{roundDecimal(data.hails_weekly.declined_by_customer_average)}</TableCell>
            <TableCell>{roundDecimal(data.hails_monthly.declined_by_customer_average)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              Taux/Nombre de courses annulées par les chauffeurs (après acceptation client)
            </TableCell>
            <TableCell>{roundDecimal(data.hails_daily.incident_taxi_average)}</TableCell>
            <TableCell>{roundDecimal(data.hails_weekly.incident_taxi_average)}</TableCell>
            <TableCell>{roundDecimal(data.hails_monthly.incident_taxi_average)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              Taux/Nombre de courses refusées par les chauffeurs (avant acceptation client)
            </TableCell>
            <TableCell>{roundDecimal(data.hails_daily.declined_by_taxi_average)}</TableCell>
            <TableCell>{roundDecimal(data.hails_weekly.declined_by_taxi_average)}</TableCell>
            <TableCell>{roundDecimal(data.hails_monthly.declined_by_taxi_average)}</TableCell>
          </TableRow>
        </Table>
        <Table>
          <TableRow>
            <TableCell>Temps moyen d’acceptation de course chauffeur</TableCell>
            <TableCell>{roundDecimal(data.average_accepted_by_taxi_time)} s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Temps moyen d’acceptation de course client</TableCell>
            <TableCell>{roundDecimal(data.average_accepted_by_customer_time)} s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Temps moyen d’échec client : timeout customer</TableCell>
            <TableCell>{roundDecimal(data.average_timeout_customer_time)} s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Temps moyen d’échec client : declined_by_customer</TableCell>
            <TableCell>{roundDecimal(data.average_declined_by_customer_time)} s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Temps moyen d’échec taxi : timeout taxi</TableCell>
            <TableCell>{roundDecimal(data.average_timeout_taxi_time)} s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Temps moyen d’échec taxi : incident_taxi</TableCell>
            <TableCell>{roundDecimal(data.average_incident_taxi_time)} s</TableCell>
          </TableRow>
        </Table>
      </>
      )}
    </>
  );
}

export default function StatsPage() {
  const classes = useStyles();

  return (
    <BaseLayout className={classes.root}>
      <Typography variant="h3">Statistiques à usage interne</Typography>
      <Typography variant="h4" className={classes.header}>Taxis</Typography>
      <StatsTaxis />
      <Typography variant="h4" className={classes.header}>Courses</Typography>
      <StatsHails />
    </BaseLayout>
  );
}
