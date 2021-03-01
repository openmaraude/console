import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),

    minHeight: '80vh',
  },
}));

export default function BaseLayout({ children, paperClassName, ...props }) {
  const classes = useStyles();
  return (
    <Container maxWidth="md" {...props}>
      <Paper className={clsx(classes.paper, paperClassName)} elevation={10}>
        {children}
      </Paper>
    </Container>
  );
}

BaseLayout.defaultProps = {
  paperClassName: undefined,
};

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
  paperClassName: PropTypes.string,
};
