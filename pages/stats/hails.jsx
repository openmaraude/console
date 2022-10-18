import React from 'react';

import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useSWR from 'swr';

import APIErrorAlert from '@/components/APIErrorAlert';
import { requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';
import { formatDecimal, formatMonth } from '@/src/utils';
import { Layout } from './index';

function StatsHailsAverage(data) {
  const { daily, weekly, monthly } = data;
  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Par jour</TableCell>
          <TableCell>Par semaine</TableCell>
          <TableCell>Par mois</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Moyenne de courses distribuées</TableCell>
          <TableCell>{formatDecimal(daily.total)}</TableCell>
          <TableCell>{formatDecimal(weekly.total)}</TableCell>
          <TableCell>{formatDecimal(monthly.total)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Taux d'échec client : timeout customer</TableCell>
          <TableCell>{formatDecimal(daily.timeout_customer)}</TableCell>
          <TableCell>{formatDecimal(weekly.timeout_customer)}</TableCell>
          <TableCell>{formatDecimal(monthly.timeout_customer)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Taux d'échec client : declined_by_customer</TableCell>
          <TableCell>{formatDecimal(daily.declined_by_customer)}</TableCell>
          <TableCell>{formatDecimal(weekly.declined_by_customer)}</TableCell>
          <TableCell>{formatDecimal(monthly.declined_by_customer)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Taux/Nombre de courses annulées par les chauffeurs (après acceptation client)
          </TableCell>
          <TableCell>{formatDecimal(daily.incident_taxi)}</TableCell>
          <TableCell>{formatDecimal(weekly.incident_taxi)}</TableCell>
          <TableCell>{formatDecimal(monthly.incident_taxi)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Taux/Nombre de courses refusées par les chauffeurs (avant acceptation client)
          </TableCell>
          <TableCell>{formatDecimal(daily.declined_by_taxi)}</TableCell>
          <TableCell>{formatDecimal(weekly.declined_by_taxi)}</TableCell>
          <TableCell>{formatDecimal(monthly.declined_by_taxi)}</TableCell>
        </TableRow>
      </TableBody>
    </>
  );
}

function StatsHailsTotal(data) {
  const months = Object.fromEntries(data);

  return (
    <TableBody>
      {Object.entries(months).map(([month, total]) => (
        <TableRow>
          <TableCell>{formatMonth(month)}</TableCell>
          <TableCell>{total}</TableCell>
        </TableRow>
      ))}
      <TableRow>
        <TableCell>Total</TableCell>
        <TableCell>{Object.values(months).reduce((prev, curr) => prev + curr, 0)}</TableCell>
      </TableRow>
    </TableBody>
  );
}

export default function StatsHails() {
  const userContext = React.useContext(UserContext);
  const [area, setArea] = React.useState('');
  const { data, error } = useSWR(
    [area, '/stats/hails', userContext.user.apikey],
    (area_, url, token) => requestOne(url, { args: { area: area_ }, token }),
  );

  return (
    <Layout area={area} setArea={setArea}>
      <Typography variant="h4">Courses</Typography>

      {error && <APIErrorAlert error={error} />}

      {data && (
      <>
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Auj.</TableCell>
                  <TableCell>-3 mois</TableCell>
                  <TableCell>-6 mois</TableCell>
                  <TableCell>-12 mois</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Nombre de courses distribuées depuis le décret</TableCell>
                  <TableCell>{data.hails_received.today}</TableCell>
                  <TableCell>{data.hails_received.three_months_ago}</TableCell>
                  <TableCell>{data.hails_received.six_months_ago}</TableCell>
                  <TableCell>{data.hails_received.twelve_months_ago}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5">Nombre de courses par mois</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Cette année</Typography>
                    <Table>
                      {StatsHailsTotal(data.hails_total.current_year)}
                    </Table>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">L'année dernière</Typography>
                    <Table>
                      {StatsHailsTotal(data.hails_total.last_year)}
                    </Table>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>

            <Typography variant="h5">Moyenne de courses distribuées</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="center" colSpan={3}>3 derniers mois</TableCell>
                </TableRow>
              </TableHead>
              {StatsHailsAverage(data.hails_average.last_three_months)}
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="center" colSpan={3}>Cette année</TableCell>
                </TableRow>
              </TableHead>
              {StatsHailsAverage(data.hails_average.current_year)}
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="center" colSpan={3}>L'année dernière</TableCell>
                </TableRow>
              </TableHead>
              {StatsHailsAverage(data.hails_average.last_year)}
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5">Temps moyen de réaction</Typography>
            <Table>
              <TableRow>
                <TableCell>Temps moyen d’acceptation de course chauffeur</TableCell>
                <TableCell>{formatDecimal(data.average_times.accepted_by_taxi)} s</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Temps moyen d’acceptation de course client</TableCell>
                <TableCell>{formatDecimal(data.average_times.accepted_by_customer)} s</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Temps moyen d’échec client : timeout customer</TableCell>
                <TableCell>{formatDecimal(data.average_times.timeout_customer)} s</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Temps moyen d’échec client : declined_by_customer</TableCell>
                <TableCell>{formatDecimal(data.average_times.declined_by_customer)} s</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Temps moyen d’échec taxi : timeout taxi</TableCell>
                <TableCell>{formatDecimal(data.average_times.timeout_taxi)} s</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Temps moyen d’échec taxi : incident_taxi</TableCell>
                <TableCell>{formatDecimal(data.average_times.incident_taxi)} s</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Temps moyen d’échec taxi : une fois le client à bord</TableCell>
                <TableCell>
                  {formatDecimal(data.average_times.customer_on_board_incident_taxi)} s
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Temps moyen de prise en charge</TableCell>
                <TableCell>
                  {formatDecimal(data.average_times.customer_on_board)} s
                </TableCell>
              </TableRow>
            </Table>
          </CardContent>
        </Card>
      </>
      )}
    </Layout>
  );
}
