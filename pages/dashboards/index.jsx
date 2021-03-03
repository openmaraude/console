import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import { hasRole, UserContext } from '../../src/auth';
import {
  MenuLayout,
  Content,
  Menu,
  MenuItem,
} from '../../components/layouts/MenuLayout';

export function Layout({ children }) {
  const userContext = React.useContext(UserContext);
  const { user } = userContext;

  return (
    <MenuLayout>
      <Menu>
        {
          hasRole(user, 'admin')
            && <MenuItem title="Courses par utilisateur" href="/dashboards/xxx" />
        }

        {
          (hasRole(user, 'operateur') || hasRole(user, 'moteur'))
            && <MenuItem title="Courses" href="/dashboards/hails" />
        }

        {
          hasRole(user, 'operateur')
            && <MenuItem title="Taxis" href="/dashboards/taxis" />
        }
      </Menu>
      <Content>
        { children }
      </Content>
    </MenuLayout>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function DashboardsPage() {
  return (
    <Layout>
      <Typography variant="h5">Tableaux de bord</Typography>
      <p> Sélectionnez le tableau de bord à afficher.</p>
    </Layout>
  );
}
