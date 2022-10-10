import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { hasRole, UserContext } from '@/src/auth';
import {
  MenuLayout,
  Content,
  Menu,
  MenuItem,
} from '@/components/layouts/MenuLayout';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.breakpoints.width('md'),
  },
}));

export function Layout({ children }) {
  const userContext = React.useContext(UserContext);
  const { user } = userContext;
  const classes = useStyles();

  return (
    <MenuLayout className={classes.root}>
      <Menu>
        {
          hasRole(user, 'admin') && <MenuItem title="Taxis" href="/stats/taxis" />
        }

        {
          hasRole(user, 'admin') && <MenuItem title="Courses" href="/stats/hails" />
        }
      </Menu>
      <Content>
        { children }
      </Content>
    </MenuLayout>
  );
}

Layout.defaultProps = {
  children: null,
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default function StatsPage() {
  return (
    <Layout>
      <Typography variant="h4">Statistiques</Typography>
      <p> Sélectionnez les statistiques à afficher.</p>
    </Layout>
  );
}
