import React from 'react';
import PropTypes from 'prop-types';

import useSWR from 'swr';

import { makeStyles } from 'tss-react/mui';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import APIErrorAlert from '@/components/APIErrorAlert';
import { formatDate } from '@/src/utils';
import HailCard, { HAIL_SUCCESS_STATUS } from '@/components/HailCard';
import { UserContext } from '@/src/auth';
import { requestList } from '@/src/api';
import { Layout } from './index';

const useStyles = makeStyles()((theme) => ({
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
}));

function Session({ session }) {
  const { classes, cx } = useStyles();
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
      <TableRow className={cx(success && classes.rowSuccess, !success && classes.rowFailure)}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{formatDate(new Date(session.added_at))}</TableCell>
        <TableCell>{session.session_id}</TableCell>
        <TableCell>{session.hails.length}</TableCell>
        <TableCell>{session.hails.slice(-1)?.[0].status}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ border: 'none', paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className={classes.hailsContainer}>
              {session.hails.map((hail) => <HailCard key={hail.id} hail={hail} />)}
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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
                onPageChange={handleChangePage}
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
