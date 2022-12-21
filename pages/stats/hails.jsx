import React from 'react';

import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
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
        <TableRow key={`total-${month}`}>
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
  const [filters, setFilters] = React.useState(
    () => JSON.parse(localStorage.getItem('statsFilters')) || { departements: [], insee: [] },
  );
  React.useEffect(() => {
    localStorage.setItem('statsFilters', JSON.stringify(filters));
  }, [filters]);

  const { data, error } = useSWR(
    [filters, '/stats/hails', userContext.user.apikey],
    (args, url, token) => requestOne(url, { args, token }),
    { refreshInterval: 0 },
  );

  return (
    <Layout filters={filters} setFilters={setFilters}>
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
                  <TableCell>il y a 3 mois</TableCell>
                  <TableCell>il y a 6 mois</TableCell>
                  <TableCell>il y a 12 mois</TableCell>
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
                <TableRow>
                  <TableCell>Nombre de courses terminées</TableCell>
                  <TableCell>{data.hails_finished.today}</TableCell>
                  <TableCell>{data.hails_finished.three_months_ago}</TableCell>
                  <TableCell>{data.hails_finished.six_months_ago}</TableCell>
                  <TableCell>{data.hails_finished.twelve_months_ago}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nombre de courses en declined_by_taxi</TableCell>
                  <TableCell>{data.hails_declined_by_taxi.today}</TableCell>
                  <TableCell>{data.hails_declined_by_taxi.three_months_ago}</TableCell>
                  <TableCell>{data.hails_declined_by_taxi.six_months_ago}</TableCell>
                  <TableCell>{data.hails_declined_by_taxi.twelve_months_ago}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nombre de courses en declined_by_customer</TableCell>
                  <TableCell>{data.hails_declined_by_customer.today}</TableCell>
                  <TableCell>{data.hails_declined_by_customer.three_months_ago}</TableCell>
                  <TableCell>{data.hails_declined_by_customer.six_months_ago}</TableCell>
                  <TableCell>{data.hails_declined_by_customer.twelve_months_ago}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nombre de courses en timeout_taxi (pas de réponse)</TableCell>
                  <TableCell>{data.hails_timeout_taxi.today}</TableCell>
                  <TableCell>{data.hails_timeout_taxi.three_months_ago}</TableCell>
                  <TableCell>{data.hails_timeout_taxi.six_months_ago}</TableCell>
                  <TableCell>{data.hails_timeout_taxi.twelve_months_ago}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nombre de courses en timeout_taxi (course non terminée)</TableCell>
                  <TableCell>{data.hails_timeout_ride.today}</TableCell>
                  <TableCell>{data.hails_timeout_ride.three_months_ago}</TableCell>
                  <TableCell>{data.hails_timeout_ride.six_months_ago}</TableCell>
                  <TableCell>{data.hails_timeout_ride.twelve_months_ago}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nombre de courses en timeout_customer</TableCell>
                  <TableCell>{data.hails_timeout_customer.today}</TableCell>
                  <TableCell>{data.hails_timeout_customer.three_months_ago}</TableCell>
                  <TableCell>{data.hails_timeout_customer.six_months_ago}</TableCell>
                  <TableCell>{data.hails_timeout_customer.twelve_months_ago}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5">Nombre de courses distribuées par mois</Typography>
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
              <TableBody>
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
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </>
      )}
    </Layout>
  );
}
