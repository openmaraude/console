import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { hasRole, UserContext } from '../../src/auth';
import {
  MenuLayout,
  Content,
  Menu,
  MenuItem,
} from '../../components/layouts/MenuLayout';

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
          (hasRole(user, 'admin') || hasRole(user, 'moteur'))
            && <MenuItem title="Sessions" href="/dashboards/sessions" />
        }

        {
          (hasRole(user, 'operateur') || hasRole(user, 'moteur'))
            && <MenuItem title="Courses" href="/dashboards/hails" />
        }

        {
          hasRole(user, 'operateur')
            && <MenuItem title="Taxis enregistrés" href="/dashboards/taxis" />
        }

        {
          (hasRole(user, 'admin') || hasRole(user, 'operateur') || hasRole(user, 'moteur'))
            && <MenuItem title="Taxis en ligne" href="/dashboards/map" />
        }

        {
          (hasRole(user, 'admin'))
            && <MenuItem title="Liste des ZUPC" href="/dashboards/zupc" />
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

export default function DashboardsPage() {
  return (
    <Layout>
      <Typography variant="h4">Tableaux de bord</Typography>
      <p> Sélectionnez le tableau de bord à afficher.</p>
    </Layout>
  );
}
