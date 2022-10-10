import React from 'react';

import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import useSWR from 'swr';

import APIErrorAlert from '@/components/APIErrorAlert';
import { requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';
import { formatDecimal } from '@/src/utils';
import { Layout } from './index';

export default function StatsHails() {
  const userContext = React.useContext(UserContext);
  const { data, error } = useSWR(
    ['/stats/hails', userContext.user.apikey],
    (url, token) => requestOne(url, { token }),
  );

  return (
    <Layout>
      <Typography variant="h4">Courses</Typography>

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
            <TableCell>{formatDecimal(data.hails_daily.total_average)}</TableCell>
            <TableCell>{formatDecimal(data.hails_weekly.total_average)}</TableCell>
            <TableCell>{formatDecimal(data.hails_monthly.total_average)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Taux d'échec client : timeout customer</TableCell>
            <TableCell>{formatDecimal(data.hails_daily.timeout_customer_average)}</TableCell>
            <TableCell>{formatDecimal(data.hails_weekly.timeout_customer_average)}</TableCell>
            <TableCell>{formatDecimal(data.hails_monthly.timeout_customer_average)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Taux d'échec client : declined_by_customer</TableCell>
            <TableCell>{formatDecimal(data.hails_daily.declined_by_customer_average)}</TableCell>
            <TableCell>{formatDecimal(data.hails_weekly.declined_by_customer_average)}</TableCell>
            <TableCell>{formatDecimal(data.hails_monthly.declined_by_customer_average)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              Taux/Nombre de courses annulées par les chauffeurs (après acceptation client)
            </TableCell>
            <TableCell>{formatDecimal(data.hails_daily.incident_taxi_average)}</TableCell>
            <TableCell>{formatDecimal(data.hails_weekly.incident_taxi_average)}</TableCell>
            <TableCell>{formatDecimal(data.hails_monthly.incident_taxi_average)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              Taux/Nombre de courses refusées par les chauffeurs (avant acceptation client)
            </TableCell>
            <TableCell>{formatDecimal(data.hails_daily.declined_by_taxi_average)}</TableCell>
            <TableCell>{formatDecimal(data.hails_weekly.declined_by_taxi_average)}</TableCell>
            <TableCell>{formatDecimal(data.hails_monthly.declined_by_taxi_average)}</TableCell>
          </TableRow>
        </Table>
        <Table>
          <TableRow>
            <TableCell>Temps moyen d’acceptation de course chauffeur</TableCell>
            <TableCell>{formatDecimal(data.average_accepted_by_taxi_time)} s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Temps moyen d’acceptation de course client</TableCell>
            <TableCell>{formatDecimal(data.average_accepted_by_customer_time)} s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Temps moyen d’échec client : timeout customer</TableCell>
            <TableCell>{formatDecimal(data.average_timeout_customer_time)} s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Temps moyen d’échec client : declined_by_customer</TableCell>
            <TableCell>{formatDecimal(data.average_declined_by_customer_time)} s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Temps moyen d’échec taxi : timeout taxi</TableCell>
            <TableCell>{formatDecimal(data.average_timeout_taxi_time)} s</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Temps moyen d’échec taxi : incident_taxi</TableCell>
            <TableCell>{formatDecimal(data.average_incident_taxi_time)} s</TableCell>
          </TableRow>
        </Table>
      </>
      )}
    </Layout>
  );
}
