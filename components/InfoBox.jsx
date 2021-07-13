import PropTypes from 'prop-types';

import clsx from 'clsx';

import { fade, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
  },
  content: {
    marginTop: theme.spacing(1),
  },
  typeInfo: {
    backgroundColor: fade(theme.palette.info.light, 0.15),
    borderTop: `1px solid ${theme.palette.info.main}`,
    borderBottom: `1px solid ${theme.palette.info.main}`,
  },
  typeWarning: {
    backgroundColor: fade(theme.palette.warning.light, 0.15),
    borderTop: `1px solid ${theme.palette.warning.main}`,
    borderBottom: `1px solid ${theme.palette.warning.main}`,
  },
  typeError: {
    backgroundColor: fade(theme.palette.error.light, 0.15),
    borderTop: `1px solid ${theme.palette.error.main}`,
    borderBottom: `1px solid ${theme.palette.error.main}`,
  },
}));

export default function InfoBox({ title, children, type }) {
  const classes = useStyles();
  const typeName = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className={clsx(classes.root, classes[`type${typeName}`])}>
      { title && <strong>{ title }</strong> }
      <div className={classes.content}>
        { children }
      </div>
    </div>
  );
}

InfoBox.defaultProps = {
  title: null,
  children: null,
  type: 'info',
};

InfoBox.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.oneOf(['info', 'warning', 'error']),
};
