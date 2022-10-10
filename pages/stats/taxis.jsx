import React from 'react';

import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import useSWR from 'swr';

import APIErrorAlert from '@/components/APIErrorAlert';
import { requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';
import { Layout } from './index';

function roundDecimal(float) {
  if (!float) return '?';
  return float.toFixed(2).toString().replace('.', ',');
}

export default function StatsTaxis() {
  const userContext = React.useContext(UserContext);
  const { data, error } = useSWR(
    ['/stats/taxis', userContext.user.apikey],
    (url, token) => requestOne(url, { token }),
  );

  return (
    <Layout>
      <Typography variant="h4">Taxis</Typography>

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
            <TableCell>
              <Table>
                {Object.entries(data.connected_taxis_per_hour).map(([k, v]) => (
                  <TableRow>
                    <TableCell>{k} h</TableCell>
                    <TableCell>{roundDecimal(v)}</TableCell>
                  </TableRow>
                ))}
              </Table>
            </TableCell>
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

    </Layout>
  );
}
