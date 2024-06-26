import React from 'react';
import PropTypes from "prop-types";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';

import APIErrorAlert from '@/components/APIErrorAlert';
import HailStatus from '@/components/HailStatus';
import { requestOne } from '@/src/api';
import { UserContext } from '@/src/auth';

const useStyles = makeStyles()((theme) => ({
  actionsCards: {
    display: 'flex',
    flexWrap: 'wrap',

    '& > *': {
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
      width: '270px',
      textAlign: 'center',
    },
  },
}));

// Change hail status
export default function HailDetailActions({ hail, integration = true }) {
  const { classes } = useStyles();
  const userContext = React.useContext(UserContext);
  const [response, setApiResponse] = React.useState({});
  const headers = {
    'Content-Type': 'application/json',
  };
  if (integration) {
    headers['X-Logas'] = process.env.INTEGRATION_ACCOUNT_EMAIL;
  }
  let actions;

  function updateHailStatus(newStatus) {
    return async () => {
      try {
        const resp = await requestOne(`/hails/${hail.id}`, {
          token: userContext.user.apikey,
          method: 'PUT',
          headers,
          body: JSON.stringify({
            data: [{
              status: newStatus,
            }],
          }),
        });
        setApiResponse({ resp });
      } catch (err) {
        setApiResponse({ error: err });
      }
    };
  }

  const incidentCustomerCard = (
    <Card>
      <CardContent>
        <Button variant="contained" onClick={updateHailStatus('incident_customer')} color="error">Déclarer un incident</Button>

        <p>
          Mettre le statut en <strong>incident_customer</strong> pour
          signaler un problème au niveau du client.
        </p>
      </CardContent>
    </Card>
  );

  switch (hail.status) {
    case 'received':
      actions = (
        <p>
          La course a été reçue par l'API le.taxi, qui va la transmettre à l'opérateur du taxi.
        </p>
      );
      break;
    case 'received_by_operator':
      actions = (
        <p>
          La course a été transmise à l'opérateur du taxi, qui va la transmettre au taxi.
        </p>
      );
      break;
    case 'received_by_taxi':
      actions = (
        <p>
          Le taxi dispose de 30 secondes pour accepter ou refuser la course.
        </p>
      );
      break;
    case 'accepted_by_taxi':
      actions = (
        <>
          <p>
            Le taxi a vu et accepté la course.
          </p>

          <div className={classes.actionsCards}>
            <Card>
              <CardContent>
                <Button variant="contained" onClick={updateHailStatus('accepted_by_customer')}>
                  Accepter la course
                </Button>

                <p>
                  Mettre le statut en <strong>accepted_by_customer</strong> pour
                  signaler que le client souhaite toujours effectuer la course.
                  Sans confirmation de la part du client, la course passera
                  automatiquement en <strong>timeout_customer</strong> après 30 secondes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Button variant="contained" onClick={updateHailStatus('declined_by_customer')} color="secondary">Refuser la course</Button>

                <p>
                  Mettre le statut en <strong>declined_by_customer</strong> pour signaler
                  que le client ne souhaite plus effectuer la course.
                </p>
              </CardContent>
            </Card>

            {incidentCustomerCard}
          </div>
        </>
      );
      break;
    case 'accepted_by_customer':
      actions = (
        <>
          <p>
            Le client a accepté la course. Le taxi est en route vers le client.
          </p>

          <div className={classes.actionsCards}>
            {incidentCustomerCard}
          </div>
        </>
      );
      break;
    case 'customer_on_board':
      actions = (
        <>
          <p>
            Le client est à bord. Il peut déclarer à tout moment un incident.
          </p>
          
          <div className={classes.actionsCards}>
            {incidentCustomerCard}
          </div>
        </>
      );
      break;
    case 'timeout_customer':
      actions = (
        <p>
          Le client n'a pas répondu à temps. Il n'est pas possible de changer son statut.
        </p>
      );
      break;
    case 'timeout_taxi':
      actions = (
        <p>
          Le taxi n'a pas répondu à temps. Il n'est pas possible de changer son statut.
        </p>
      );
      break;
    case 'declined_by_customer':
      actions = (
        <p>
          Le client a effectué une demande de course, mais a explicitement refusé de
          poursuivre. Il n'est pas possible de changer son statut.
        </p>
      );
      break;
    case 'incident_customer':
      actions = (
        <p>
          Le client a déclaré un incident. Il n'est pas possible de changer son statut.
        </p>
      );
      break;
    case 'incident_taxi':
      actions = (
        <p>
          Le taxi a déclaré un incident. Il n'est pas possible de changer son statut.
        </p>
      );
      break;
    case 'finished':
      actions = (
        <p>
          La course s'est correctement effectuée. Il n'est pas possible de changer son
          statut.
        </p>
      );
      break;
    default:
      actions = null;
      break;
  }

  return (
    <Box marginTop={2}>
      <Typography variant="h5">Changer le statut de la course</Typography>
      <p>
        La course a le statut <HailStatus>{hail.status}</HailStatus>
      </p>
      {actions}
      {response.error && <APIErrorAlert error={response.error} />}
    </Box>
  );
}

HailDetailActions.propTypes = {
  hail: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  integration: PropTypes.bool,
};
