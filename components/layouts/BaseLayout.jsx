import PropTypes from 'prop-types';

import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import { makeStyles } from 'tss-react/mui';
import Paper from '@mui/material/Paper';

const useStyles = makeStyles()((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),

    minHeight: '80vh',
  },
}));

export default function BaseLayout({
  loading,
  children,
  paperClassName,
  ...props
}) {
  const { classes, cx } = useStyles();
  return (
    <Container maxWidth="md" {...props}>
      <Paper className={cx(classes.paper, paperClassName)} elevation={10}>
        {loading ? <LinearProgress /> : children}
      </Paper>
    </Container>
  );
}

BaseLayout.defaultProps = {
  paperClassName: undefined,
  loading: false,
};

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
  paperClassName: PropTypes.string,
  loading: PropTypes.bool,
};
