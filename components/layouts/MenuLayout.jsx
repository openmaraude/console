/*
 * Layout to display a menu on the left, and content on the right.
 */
import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),

    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },

  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: '200px',
    minWidth: '200px',
  },
}));

export function MenuPanel({ index, selectedTabIndex, children }) {
  return (
    <div
      role="tabpanel"
      hidden={index !== selectedTabIndex}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {index === selectedTabIndex && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

MenuPanel.defaultProps = {
  index: 0,
  selectedTabIndex: 0,
  children: null,
};

MenuPanel.propTypes = {
  index: PropTypes.number,
  selectedTabIndex: PropTypes.number,
  children: PropTypes.node,
};

export function MenuLayout({ children }) {
  const classes = useStyles();
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTabIndex(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Paper className={classes.paper} elevation={10}>
        <Tabs
          orientation="vertical"
          value={selectedTabIndex}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          {
            React.Children.toArray(children).map((panel) => (
              <Tab key={panel.props.title} label={panel.props.title} />
            ))
          }
        </Tabs>

        {
          React.Children.toArray(children).map((panel, index) => (
            <MenuPanel
              key={panel.props.title}
              index={index}
              selectedTabIndex={selectedTabIndex}
            >
              {panel.props.children}
            </MenuPanel>
          ))
        }
      </Paper>
    </Container>
  );
}

MenuLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
