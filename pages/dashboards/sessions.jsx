import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import useSWR from 'swr';

import { fade, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import APIErrorAlert from '../../components/APIErrorAlert';
import { Layout } from './index';
import { UserContext } from '../../src/auth';
import { requestList } from '../../src/api';

const useStyles = makeStyles((theme) => ({
  rowSuccess: {
    borderLeft: `3px solid ${theme.palette.success.main}`,
    borderRight: `3px solid ${theme.palette.success.main}`,
  },
  rowFailure: {
    borderLeft: `3px solid ${theme.palette.error.main}`,
    borderRight: `3px solid ${theme.palette.error.main}`,
  },
  hailsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  hail: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '350px',
  },
  hailTitle: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  hailSuccessTitle: {
    backgroundColor: fade(theme.palette.success.light, 0.35),
  },
  hailFailureTitle: {
    backgroundColor: fade(theme.palette.error.light, 0.35),
  },
}));

// Hails with these status are considered successful.
const HAIL_SUCCESS_STATUS = ['finished', 'customer_on_board'];

const formatDate = (str) => {
  const date = new Date(str);
  return `${date.toLocaleDateString('fr')} ${date.toLocaleTimeString('fr')}`;
};

// Format longitude or latitude
const formatLoc = (num) => num?.toFixed(5);

function Hail({ hail }) {
  const classes = useStyles();
  const success = HAIL_SUCCESS_STATUS.indexOf(hail.status) !== -1;

  return (
    <Card className={classes.hail}>
      <CardContent>
        <Typography
          className={clsx(
            classes.hailTitle,
            success && classes.hailSuccessTitle,
            !success && classes.hailFailureTitle,
          )}
          variant="subtitle1"
        >
          Hail {hail.id}
        </Typography>
        <dl>
          <dt>Date</dt>
          <dd>{formatDate(hail.added_at)}</dd>

          <dt>Statut</dt>
          <dd><strong>{hail.status}</strong></dd>

          <dt>Opérateur</dt>
          <dd>{hail.operateur.commercial_name || hail.operateur.email}</dd>

          <dt>Moteur</dt>
          <dd>{hail.moteur.commercial_name || hail.moteur.email}</dd>

          <dt>Taxi</dt>
          <dd>{hail.taxi.id}</dd>

          <dt>Client adresse</dt>
          <dd>{hail.customer_address}</dd>

          <dt>Client lon/lat</dt>
          <dd>{formatLoc(hail.customer_lon)}/{formatLoc(hail.customer_lat)}</dd>

          <dt>Taxi lon/lat</dt>
          <dd>{formatLoc(hail.initial_taxi_lon)}/{formatLoc(hail.initial_taxi_lat)}</dd>

          <dt>Client tél.</dt>
          <dd>{hail.customer_phone_number}</dd>

          <dt>Taxi tél.</dt>
          <dd>{hail.taxi_phone_number}</dd>
        </dl>
      </CardContent>
    </Card>
  );
}

/* eslint-disable react/forbid-prop-types */
Hail.propTypes = {
  hail: PropTypes.any.isRequired,
};
/* eslint-enable react/forbid-prop-types */

function Session({ session }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  // Session is considered successful if at least one hail is finished or
  // customer_on_board.
  const success = session.hails.map(
    (hail) => hail.status,
  ).some(
    (status) => HAIL_SUCCESS_STATUS.indexOf(status) !== -1,
  );

  return (
    <>
      <TableRow className={clsx(success && classes.rowSuccess, !success && classes.rowFailure)}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{formatDate(session.added_at)}</TableCell>
        <TableCell>{session.session_id}</TableCell>
        <TableCell>{session.hails.length}</TableCell>
        <TableCell>{session.hails.slice(-1)?.[0].status}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ border: 'none', paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className={classes.hailsContainer}>
              {session.hails.map((hail) => <Hail key={hail.id} hail={hail} />)}
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

/* eslint-disable react/forbid-prop-types */
Session.propTypes = {
  session: PropTypes.shape({
    session_id: PropTypes.string,
    hails: PropTypes.array,
    added_at: PropTypes.string,
  }).isRequired,
};
/* eslint-enable react/forbid-prop-types */

export default function DashboardSession() {
  const userContext = React.useContext(UserContext);
  const [page, setPage] = React.useState(0);
  const { data, error } = useSWR(
    [`/sessions`, userContext.user.apikey, page],
    (url, token) => requestList(url, page, { token }),
  );

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  return (
    <Layout>
      <Typography variant="h4">Liste des sessions</Typography>

      <p>
        Ce tableau présente les demandes utilisateurs. Lorsqu'un utilisateur
        commande un taxi via son application, plusieurs requêtes peuvent être
        effectuées. Par exemple, si le premier taxi refuse la course mais le
        second l'accepte, la session est considérée comme un succès, mais la
        première demande de course comme échouée.
      </p>

      {!data && <LinearProgress />}
      {error && <APIErrorAlert error={error} />}

      {data && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Date</TableCell>
              <TableCell>Session</TableCell>
              <TableCell>Nombre de hails</TableCell>
              <TableCell>Dernier statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((session) => (
              <Session key={session.session_id} session={session} />
            ))}

            <TableRow>
              <TablePagination
                count={data?.meta.total}
                page={page}
                onChangePage={handleChangePage}
                rowsPerPage={data?.meta.per_page}
                rowsPerPageOptions={[]}
              />
            </TableRow>
          </TableBody>
        </Table>
      )}
    </Layout>
  );
}
