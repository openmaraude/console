import PropTypes from 'prop-types';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  status: {
    padding: theme.spacing(1),
    borderRadius: '1vh',
  },
  success: {
    color: '#17774f',
    backgroundColor: '#d4edbc',
  },
  failure: {
    color: '#b10202',
    backgroundColor: '#ffcfc9',
  },
  neutral: {
    color: 'black',
    backgroundColor: '#e8eaed',
  },
}));

export default function HailStatus({ children }) {
  const { classes, cx } = useStyles();
  let outcome;
  switch (children) {
    case 'finished':
    case 'customer_on_board':
      outcome = 'success';
      break;
    case 'failure':
    case 'timeout_taxi':
    case 'incident_taxi':
    case 'declined_by_taxi':
      outcome = 'failure';
      break;
    default:
      outcome = 'neutral';
  }

  return <span className={cx(classes.status, classes[outcome])}>{children}</span>;
}

HailStatus.propTypes = {
  children: PropTypes.node.isRequired,
};
