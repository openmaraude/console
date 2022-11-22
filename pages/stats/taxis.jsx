import React from 'react';

import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Card, CardContent, Typography } from '@mui/material';
import useSWR from 'swr';

import APIErrorAlert from '@/components/APIErrorAlert';
import { requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';
import { formatDecimal } from '@/src/utils';
import { Layout } from './index';

export default function StatsTaxis() {
  const userContext = React.useContext(UserContext);
  const [filters, setFilters] = React.useState({ area: '' });
  const { data, error } = useSWR(
    [filters, '/stats/taxis', userContext.user.apikey],
    (args, url, token) => requestOne(url, { args, token }),
  );

  return (
    <Layout filters={filters} setFilters={setFilters}>
      <Typography variant="h4">Taxis</Typography>

      {error && <APIErrorAlert error={error} />}

      {data && (
      <>
        <Card>
          <CardContent>
            <Table>
              <TableRow>
                <TableCell />
                <TableCell>Auj.</TableCell>
                <TableCell>-3 mois</TableCell>
                <TableCell>-6 mois</TableCell>
                <TableCell>-12 mois</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nombre de taxis enregistrés</TableCell>
                <TableCell>{data.registered_taxis.today}</TableCell>
                <TableCell>{data.registered_taxis.three_months_ago}</TableCell>
                <TableCell>{data.registered_taxis.six_months_ago}</TableCell>
                <TableCell>{data.registered_taxis.twelve_months_ago}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nombre de taxi connectés au moins une fois</TableCell>
                <TableCell>{data.connected_taxis.today}</TableCell>
                <TableCell>{data.connected_taxis.three_months_ago}</TableCell>
                <TableCell>{data.connected_taxis.six_months_ago}</TableCell>
                <TableCell>{data.connected_taxis.twelve_months_ago}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nombre de taxis enregistrés depuis le décret</TableCell>
                <TableCell>{data.registered_taxis_since_threshold.today}</TableCell>
                <TableCell>{data.registered_taxis_since_threshold.three_months_ago}</TableCell>
                <TableCell>{data.registered_taxis_since_threshold.six_months_ago}</TableCell>
                <TableCell>{data.registered_taxis_since_threshold.twelve_months_ago}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nombre de taxis connectés au moins une fois depuis le décret</TableCell>
                <TableCell>{data.connected_taxis_since_threshold.today}</TableCell>
                <TableCell>{data.connected_taxis_since_threshold.three_months_ago}</TableCell>
                <TableCell>{data.connected_taxis_since_threshold.six_months_ago}</TableCell>
                <TableCell>{data.connected_taxis_since_threshold.twelve_months_ago}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Courses mensuelles par taxi</TableCell>
                <TableCell>{formatDecimal(data.monthly_hails_per_taxi)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Valeur de réglage rayon moyen par taxi (mètres)</TableCell>
                <TableCell>{formatDecimal(data.average_radius)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pourcentage de modification du rayon</TableCell>
                <TableCell>{formatDecimal(data.average_radius_change)}</TableCell>
              </TableRow>
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
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5">Nombre de taxis connectés par plage horaire</Typography>
            <Table>
              <TableRow>
                <TableCell>
                  <Table>
                    {Object.entries(data.connected_taxis_per_hour).map(([k, v]) => (
                      <TableRow>
                        <TableCell>{k} h</TableCell>
                        <TableCell>{formatDecimal(v)}</TableCell>
                      </TableRow>
                    ))}
                  </Table>
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
