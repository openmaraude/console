import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from 'tss-react/mui';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { hasRole, UserContext } from '@/src/auth';
import {
  MenuLayout,
  Content,
  Menu,
  MenuItem as MyMenuItem, // name clash
} from '@/components/layouts/MenuLayout';
import { departements, departementNames } from '@/src/utils';
import { requestList } from '@/src/api';

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
  const [townInput, settownInput] = React.useState('');
  const [availableTowns, setAvailableTowns] = React.useState([]);
  const [selectedTowns, setSelectedTowns] = React.useState([]);

  // These towns are too costly to ask the server under three characters typed
  const shortTownNames = [
    { insee: '25104', name: "By" },
    { insee: '28064', name: "Bû" },
    { insee: '76255', name: "Eu" },
    { insee: '70282', name: "Gy" },
    { insee: '38289', name: "Oz" },
    { insee: '31404', name: "Oô" },
    { insee: '66155', name: "Py" },
    { insee: '61349', name: "Ri" },
    { insee: '76548', name: "Ry" },
    { insee: '08434', name: "Sy" },
    { insee: '66218', name: "Ur" },
    { insee: '95625', name: "Us" },
    { insee: '65458', name: "Uz" },
    { insee: '80829', name: "Y" },
  ];

  const fetch = React.useMemo(() => async (townName) => {
    const { data } = await requestList('/towns', null, {
      token: user.apikey,
      args: {
        search: townName,
      },
    });
    setAvailableTowns(data);
  }, []);

  const renderTown = ({ insee, name }) => {
    const departement = insee.substr(0, 2) === '97' ? insee.substr(0, 3) : insee.substr(0, 2);
    return `${name} (${departement})`;
  };

  React.useEffect(() => {
    if (!townInput) {
      // Leave current town list
    } else if (townInput.length < 3) {
      setAvailableTowns(
        shortTownNames.filter((option) => townInput.toLowerCase() === option.name.toLowerCase()),
      );
    } else {
      fetch(townInput);
    }
  }, [filters, townInput, fetch]);

  return (
    <MenuLayout className={classes.root} {...props}>
      <Menu>
        {hasRole(user, 'admin') && (
          <>
            <MyMenuItem title="Taxis" href="/stats/taxis" />
            <MyMenuItem title="Courses" href="/stats/hails" />
            <MyMenuItem title="Groupements" href="/stats/groupements" />
            {filters && (
              <Stack spacing={4} sx={{ mt: 4 }}>
                <Typography variant="inherit">Rechercher par</Typography>
                <FormGroup>
                  <FormLabel>Territoire</FormLabel>
                  <FormControl>
                    <InputLabel>Grenoble, Lyon...</InputLabel>
                    <Select
                      variant="standard"
                      value={filters.area}
                      onChange={(event) => {
                        setFilters({ ...filters, area: event.target.value });
                      }}
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
                    <Autocomplete
                      multiple
                      variant="standard"
                      freeSolo
                      disableCloseOnSelect
                      options={departements}
                      getOptionLabel={(option) => departementNames[option]}
                      value={filters.departements}
                      onChange={(event, value) => {
                        setFilters({ ...filters, departements: value });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} variant="standard" label="Un ou plusieurs départements" fullWidth />
                      )}
                      renderOption={(renderProps, option, { selected }) => (
                        <li {...renderProps} key={`dpt-${option}`}>
                          <Checkbox checked={selected} />
                          {departementNames[option]}
                        </li>
                      )}
                      sx={{ width: 226 }}
                    />
                  </FormControl>
                </FormGroup>
                <FormGroup>
                  <FormLabel>Commune</FormLabel>
                  <FormControl>
                    <Autocomplete
                      multiple
                      variant="standard"
                      freeSolo
                      disableCloseOnSelect
                      options={availableTowns}
                      getOptionLabel={renderTown}
                      filterOptions={(x) => x}
                      value={selectedTowns}
                      onChange={(event, value) => {
                        setSelectedTowns(value);
                        setFilters({ ...filters, insee: value.map((option) => option.insee) });
                      }}
                      onInputChange={(event, newInputValue) => {
                        settownInput(newInputValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} variant="standard" label="Une ou plusieurs communes" fullWidth />
                      )}
                      renderOption={(renderProps, option, { selected }) => (
                        <li {...renderProps} key={`town-${option.insee}`}>
                          <Checkbox checked={selected} />
                          {renderTown(option)}
                        </li>
                      )}
                      sx={{ width: 226 }}
                    />
                  </FormControl>
                </FormGroup>
              </Stack>
            )}
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
  filters: null,
  setFilters: null,
  children: null,
};

Layout.propTypes = {
  filters: PropTypes.shape({
    area: PropTypes.string,
    departements: PropTypes.shape([]),
    insee: PropTypes.shape([]),
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
