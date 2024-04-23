/*
 * Display the number of available taxis in the ZUPC.
 */

/* eslint-disable new-cap */

import React from 'react';
import PropTypes from 'prop-types';

import useSWR from 'swr';

import Box from '@mui/material/Box';

import APIErrorAlert from '@/components/APIErrorAlert';
import { requestList } from '@/src/api';
import { UserContext } from '@/src/auth';

export default function AvailableTaxis({ center }) {
  const userContext = React.useContext(UserContext);

  const { data, error } = useSWR(
    ['/zupc', userContext.user.apikey, center[1], center[0]],
    (url, token, lon, lat) => requestList(url, null, {
      token,
      args: {
        lon,
        lat,
      },
    }),
    { refreshInterval: 5000 },
  );

  const statsOperators = (operators) => {
    if (!operators) {
      return null;
    }
    return (
      <span>, dont
        {Object.entries(operators).map(
          ([operator, num]) => (
            <span key={operator}>&nbsp;<strong>{num}</strong> taxis <i>{operator}</i></span>
          ),
        )}
      </span>
    );
  };

  return (
    <>
      {error && <APIErrorAlert error={error} />}

      <Box display="flex" justifyContent="flex-end" paddingRight={1}>
        {!error && !data && <p>...</p>}
        {
          data?.data.map((entry) => (entry.type === 'ZUPC' ? (
            <p key={entry.zupc_id}>
              <strong>{entry.stats.total}</strong> taxis connectés
              dans la ZUPC <strong>{entry.name}</strong>
              {statsOperators(entry.stats.operators)}
            </p>
          ) : (
            <p key={entry.insee}>
              <strong>{entry.stats.total}</strong> taxis connectés à <strong>{entry.name}</strong>
              {statsOperators(entry.stats.operators)}
            </p>
          )))
        }
      </Box>
    </>
  );
}

AvailableTaxis.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
};
