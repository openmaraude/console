import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { hasRole, UserContext } from '@/src/auth';
import {
  MenuLayout,
  Content,
  Menu,
  MenuItem as MyMenuItem, // name clash
} from '@/components/layouts/MenuLayout';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.breakpoints.width('md'),
  },
}));

export function Layout({ area, setArea, children }) {
  const userContext = React.useContext(UserContext);
  const { user } = userContext;
  const classes = useStyles();

  const handleAreaChange = (event) => {
    setArea(event.target.value);
  };

  return (
    <MenuLayout className={classes.root}>
      <Menu>
        {hasRole(user, 'admin') && (
          <>
            <MyMenuItem title="Taxis" href="/stats/taxis" />
            <MyMenuItem title="Courses" href="/stats/hails" />
            <MyMenuItem title="Groupements" href="/stats/groupements" />
            <FormControl fullWidth variant="filled">
              <InputLabel>Territoire</InputLabel>
              <Select
                value={area}
                label="Territoire"
                onChange={handleAreaChange}
              >
                <MenuItem value="">National</MenuItem>
                <MenuItem value="grenoble">Grenoble</MenuItem>
                <MenuItem value="lyon">Lyon</MenuItem>
                <MenuItem value="rouen">Rouen</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
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
  area: PropTypes.string.isRequired,
  setArea: PropTypes.func.isRequired,
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
