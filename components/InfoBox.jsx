import PropTypes from 'prop-types';

import { fade, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: fade(theme.palette.info.light, 0.15),
    borderTop: `1px solid ${theme.palette.info.main}`,
    borderBottom: `1px solid ${theme.palette.info.main}`,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

export default function InfoBox({ title, children }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      { title && <strong>{ title }</strong> }
      { children }
    </div>
  );
}

InfoBox.defaultProps = {
  title: null,
};

InfoBox.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};
