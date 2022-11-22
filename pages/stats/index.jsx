import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { hasRole, UserContext } from '@/src/auth';
import {
  MenuLayout,
  Content,
  Menu,
  MenuItem as MyMenuItem, // name clash
} from '@/components/layouts/MenuLayout';
import {
  TimeoutGroup,
  TimeoutTextField,
} from '@/components/TimeoutForm';

const useStyles = makeStyles()((theme) => ({
  root: {
    minWidth: theme.breakpoints.values.md,
  },
}));

export function Layout({ filters, setFilters, children }) {
  const userContext = React.useContext(UserContext);
  const { user } = userContext;
  const { classes } = useStyles();

  const handleAreaChange = (event) => {
    if (setFilters) setFilters({ ...filters, area: event.target.value });
  };

  const updateFilters = (newFilters) => {
    if (setFilters) setFilters({ ...filters, ...newFilters });
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
                variant="standard"
                value={filters?.area}
                label="Territoire"
                onChange={handleAreaChange}
              >
                <MenuItem value="">National</MenuItem>
                <MenuItem value="grenoble">Grenoble</MenuItem>
                <MenuItem value="lyon">Lyon</MenuItem>
                <MenuItem value="rouen">Rouen</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth variant="filled">
              <TimeoutGroup onSubmit={updateFilters}>
                <TimeoutTextField
                  id="insee"
                  name="insee"
                  label="INSEE"
                  value={filters?.insee}
                />
              </TimeoutGroup>
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
  filters: PropTypes.shape({
    area: PropTypes.string,
    insee: PropTypes.string,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
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
