/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from 'tss-react/mui';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import {
  departementCode,
  departements,
  departementNames,
  regions,
  regionDetails,
  metropoles,
} from '@/src/utils';
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

  // Town autocomplete
  const [townInput, setTownInput] = React.useState('');
  const [availableTowns, setAvailableTowns] = React.useState([]);
  const [selectedTowns, setSelectedTowns] = React.useState(
    () => JSON.parse(localStorage.getItem('statsSelectedTowns')) || [],
  );

  // Groupement autocomplete
  const [groupInput, setGroupInput] = React.useState('');
  const [availableGroups, setAvailableGroups] = React.useState([]);
  const [selectedGroups, setSelectedGroups] = React.useState(
    () => JSON.parse(localStorage.getItem('stateSelectedGroups')) || [],
  );

  // These filters are only local
  const [metropole, setMetropole] = React.useState(
    () => JSON.parse(localStorage.getItem('statsMetropole')) || '',
  );
  const [region, setRegion] = React.useState(
    () => JSON.parse(localStorage.getItem('statsRegion')) || '',
  );
  const [managers, setManagers] = React.useState([]);
  const [manager, setManager] = React.useState(
    () => JSON.parse(localStorage.getItem('statsManager')) || '',
  );

  // Store current values
  React.useEffect(() => {
    localStorage.setItem('statsSelectedTowns', JSON.stringify(selectedTowns));
  }, [selectedTowns]);
  React.useEffect(() => {
    localStorage.setItem('statsSelectedGroups', JSON.stringify(selectedGroups));
  }, [selectedGroups]);
  React.useEffect(() => {
    localStorage.setItem('statsMetropole', JSON.stringify(metropole));
  }, [metropole]);
  React.useEffect(() => {
    localStorage.setItem('statsRegion', JSON.stringify(region));
  }, [region]);
  React.useEffect(() => {
    localStorage.setItem('statsManager', JSON.stringify(manager));
  }, [manager]);

  /*
   * Town autocomplete
   */
  const fetchTowns = React.useMemo(() => (name) => {
    requestList('/towns', null, {
      token: user.apikey,
      args: {
        search: name,
      },
    }).then(({ data }) => setAvailableTowns(data));
  }, []);
  const renderTown = ({ insee, name }) => {
    const departement = departementCode(insee);
    return `${name} (${departement})`;
  };
  React.useEffect(() => {
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

    if (!townInput) {
      // Leave current town list
    } else if (townInput.length < 3) {
      setAvailableTowns(
        shortTownNames.filter((option) => townInput.toLowerCase() === option.name.toLowerCase()),
      );
    } else {
      fetchTowns(townInput);
    }
  }, [filters, townInput, fetchTowns]);

  /*
   * Groupement autocomplete
   */
  const fetchGroups = React.useMemo(() => (name) => {
    requestList('/stats/groups', null, {
      token: user.apikey,
      args: {
        search: name,
      },
    }).then(({ data }) => setAvailableGroups(data));
  }, []);
  /* eslint-disable camelcase */
  const renderGroup = ({ email, commercial_name }) => (commercial_name || email);
  React.useEffect(() => {
    if (groupInput?.length >= 3) {
      fetchGroups(groupInput);
    }
  }, [filters, groupInput, fetchGroups]);

  /*
   * Managers on load
   */
  React.useEffect(() => {
    requestList('/stats/managers', null, {
      token: user.apikey,
    }).then(({ data }) => setManagers(data));
  }, []);

  const resetFilters = () => {
    setFilters({});
    setTownInput('');
    setSelectedTowns([]);
    setSelectedGroups([]);
    setMetropole('');
    setRegion('');
    setManager('');
  };

  return (
    <MenuLayout className={classes.root} {...props}>
      <Menu>
        {hasRole(user, 'admin') && (
          <>
            <MyMenuItem title="Taxis" href="/stats/taxis" />
            <MyMenuItem title="Courses" href="/stats/hails" />
            <MyMenuItem title="Groupements" href="/stats/groupements" />
            <MyMenuItem title="Carte des ADS" href="/stats/adsmap" />
            <MyMenuItem title="Suivi client" href="/stats/customers" />
            <MyMenuItem title="Heatmap hails" href="/stats/hail_heatmap" />
            <MyMenuItem title="Héler un taxi" href="/stats/taxihail" />
            <MyMenuItem title="Stats recherches" href="/stats/searches" />
            <MyMenuItem title="Heatmap recherches" href="/stats/search_heatmap" />
            {filters && (
              <>
                <Stack spacing={4} sx={{ mt: 4 }}>
                  <Typography variant="inherit">Rechercher par...</Typography>
                  <FormGroup>
                    <FormLabel>Métropole</FormLabel>
                    <FormControl>
                      <InputLabel>Grenoble, Lyon...</InputLabel>
                      <Select
                        variant="standard"
                        value={metropole}
                        onChange={({ target: { value } }) => {
                          setMetropole(value);
                          setRegion('');
                          setSelectedTowns([]);
                          if (value) {
                            setFilters({
                              ...filters,
                              insee: metropoles[value].insee,
                              departements: [],
                            });
                          } else {
                            setFilters({ ...filters, insee: [], departements: [] });
                          }
                        }}
                      >
                        <MenuItem value="">&nbsp;</MenuItem>
                        {Object.entries(metropoles).map(([key, value]) => <MenuItem value={key} key={`metro-${key}`}>{value.name}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Région ou collectivité</FormLabel>
                    <FormControl>
                      <InputLabel>Grand Est, Normandie...</InputLabel>
                      <Select
                        variant="standard"
                        value={region}
                        onChange={({ target: { value } }) => {
                          setMetropole('');
                          setRegion(value);
                          setSelectedTowns([]);
                          if (value) {
                            setFilters({
                              ...filters,
                              insee: [],
                              departements: regionDetails[value].departements,
                            });
                          } else {
                            setFilters({
                              ...filters,
                              insee: [],
                              departements: [],
                            });
                          }
                        }}
                      >
                        <MenuItem value="">&nbsp;</MenuItem>
                        {regions.map((id) => <MenuItem value={id} key={`region-${id}`}>{regionDetails[id].name}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Département ou collectivité</FormLabel>
                    <FormControl>
                      <Autocomplete
                        multiple
                        variant="standard"
                        freeSolo
                        disableCloseOnSelect
                        options={departements}
                        getOptionLabel={(option) => departementNames[option]}
                        value={filters.departements || []}
                        onChange={(event, value) => {
                          setMetropole('');
                          setRegion('');
                          setSelectedTowns([]);
                          setFilters({ ...filters, insee: [], departements: value });
                        }}
                        renderInput={(params) => (
                          <TextField {...params} variant="standard" label="Un ou plusieurs départements" fullWidth />
                        )}
                        renderOption={(renderProps, option, { selected }) => (
                          <li {...renderProps}>
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
                          setMetropole('');
                          setRegion('');
                          setSelectedTowns(value);
                          setFilters({
                            ...filters,
                            insee: (value.map((option) => option.insee)),
                            departements: [],
                          });
                        }}
                        onInputChange={(event, newInputValue) => {
                          setTownInput(newInputValue);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} variant="standard" label="Une ou plusieurs communes" fullWidth />
                        )}
                        renderOption={(renderProps, option, { selected }) => (
                          <li {...renderProps}>
                            <Checkbox checked={selected} />
                            {renderTown(option)}
                          </li>
                        )}
                        sx={{ width: 226 }}
                      />
                    </FormControl>
                  </FormGroup>
                </Stack>
                <Stack spacing={4} sx={{ mt: 4 }}>
                  <Typography variant="inherit">Afficher uniquement les taxis de...</Typography>
                  <FormGroup>
                    <FormLabel>Groupement</FormLabel>
                    <FormControl>
                      <Autocomplete
                        multiple
                        variant="standard"
                        freeSolo
                        disableCloseOnSelect
                        options={availableGroups}
                        getOptionLabel={renderGroup}
                        filterOptions={(x) => x}
                        value={selectedGroups}
                        onChange={(event, value) => {
                          setSelectedGroups(value);
                          setFilters({ ...filters, groups: value.map((option) => option.id) });
                        }}
                        onInputChange={(event, newInputValue) => {
                          setGroupInput(newInputValue);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} variant="standard" label="Un ou plusieurs groupements" fullWidth />
                        )}
                        renderOption={(renderProps, option, { selected }) => (
                          <li {...renderProps}>
                            <Checkbox checked={selected} />
                            {renderGroup(option)}
                          </li>
                        )}
                        sx={{ width: 226 }}
                      />
                    </FormControl>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Éditeur</FormLabel>
                    <FormControl>
                      <InputLabel>Appsolu, Tessa...</InputLabel>
                      <Select
                        variant="standard"
                        value={manager}
                        onChange={({ target: { value } }) => {
                          setManager(value);
                          if (value) {
                            setFilters({ ...filters, manager: value });
                          } else {
                            setFilters({ ...filters, manager: '' });
                          }
                        }}
                      >
                        <MenuItem value="">&nbsp;</MenuItem>
                        {managers.map((option) => <MenuItem value={option.id} key={`manager-${option.id}`}>{renderGroup(option)}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </FormGroup>
                  <FormGroup>
                    <FormControl>
                      <Button type="button" onClick={resetFilters}>Réinitialiser les filtres</Button>
                    </FormControl>
                  </FormGroup>
                </Stack>
              </>
            )}
          </>
        )}
      </Menu>
      <Content>
        {children}
        {filters !== null && (
          <>
            <hr />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>debug filtres</AccordionSummary>
              <AccordionDetails>
                <pre>{JSON.stringify(filters, null, 4)}</pre>
              </AccordionDetails>
            </Accordion>
          </>
        )}
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
    departements: PropTypes.arrayOf(PropTypes.string),
    insee: PropTypes.arrayOf(PropTypes.string),
  }),
  setFilters: PropTypes.func,
  children: PropTypes.node,
};

export default function StatsPage() {
  return (
    <Layout>
      <Typography variant="h4">Analyse</Typography>
      <p> Sélectionnez la page à afficher.</p>
    </Layout>
  );
}
