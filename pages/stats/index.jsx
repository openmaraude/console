import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from 'tss-react/mui';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
import { departements, departementNames } from '@/src/utils';

const useStyles = makeStyles()((theme) => ({
  root: {
    minWidth: theme.breakpoints.values.md,
  },
}));

export function Layout({
  filters,
  setFilters,
  children,
  ...props
}) {
  const userContext = React.useContext(UserContext);
  const { user } = userContext;
  const { classes } = useStyles();

  const handleAreaChange = (event) => {
    if (setFilters) setFilters({ ...filters, area: event.target.value });
  };

  const handleDeptChange = (event) => {
    if (setFilters) setFilters({ ...filters, departements: event.target.value });
  };

  const updateFilters = (newFilters) => {
    if (setFilters) setFilters({ ...filters, ...newFilters });
  };

  return (
    <MenuLayout className={classes.root} {...props}>
      <Menu>
        {hasRole(user, 'admin') && (
          <>
            <MyMenuItem title="Taxis" href="/stats/taxis" />
            <MyMenuItem title="Courses" href="/stats/hails" />
            <MyMenuItem title="Groupements" href="/stats/groupements" />
            <Stack spacing={4} sx={{ mt: 4 }}>
              <Typography variant="inherit">Rechercher par</Typography>
              <FormGroup>
                <FormLabel>Territoire</FormLabel>
                <FormControl>
                  <InputLabel>Grenoble, Lyon...</InputLabel>
                  <Select
                    variant="standard"
                    value={filters.area}
                    onChange={handleAreaChange}
                  >
                    <MenuItem value="">National</MenuItem>
                    <MenuItem value="grenoble">Grenoble</MenuItem>
                    <MenuItem value="lyon">Lyon</MenuItem>
                    <MenuItem value="rouen">Rouen</MenuItem>
                  </Select>
                </FormControl>
              </FormGroup>
              <FormGroup>
                <FormLabel>Départements</FormLabel>
                <FormControl>
                  <Select
                    multiple
                    variant="standard"
                    value={filters.departements}
                    onChange={handleDeptChange}
                    label="Un ou plusieurs départements"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={departementNames[value]} />
                        ))}
                      </Box>
                    )}
                    sx={{ maxWidth: 226 }}
                  >
                    {departements.map((value) => (
                      <MenuItem key={`dpt-${value}`} value={value}>
                        <Checkbox checked={filters.departements.indexOf(value) > -1} />
                        <ListItemText primary={departementNames[value]} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormGroup>
              <FormGroup>
                <FormLabel>Code INSEE</FormLabel>
                <FormControl>
                  <TimeoutGroup onSubmit={updateFilters}>
                    <TimeoutTextField
                      id="insee"
                      name="insee"
                      label="38185, 69123, 75056..."
                      value={filters.insee}
                    />
                  </TimeoutGroup>
                </FormControl>
              </FormGroup>
            </Stack>
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
  filters: {
    area: '',
    departements: [],
    insee: '',
  },
  setFilters: null,
  children: null,
};

Layout.propTypes = {
  filters: PropTypes.shape({
    area: PropTypes.string,
    departements: PropTypes.shape([]),
    insee: PropTypes.string,
  }),
  setFilters: PropTypes.func,
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
